/**(BANCO ANTIGOSQLITE)import { db } from "./sqlite";

type ResultadoCadastro = { sucesso: true } | { sucesso: false; erro: string };

interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

export function cadastrarUsuario(dados: DadosCadastro): ResultadoCadastro {
  if (!db) return { sucesso: false, erro: "Banco indisponível." };

  try {
    db.runSync(
      `INSERT INTO usuarios (nome, email, senha, createdAt) VALUES (?, ?, ?, ?)`,
      [dados.nome, dados.email, dados.senha, new Date().toISOString()],
    );
    return { sucesso: true };
  } catch (e: any) {
    if (e?.message?.includes("UNIQUE")) return { sucesso: false, erro: "E-mail já cadastrado." };
    return { sucesso: false, erro: "Erro ao salvar cadastro." };
  }
}

export function buscarUsuarioPorEmail(email: string): Usuario | null {
  if (!db) return null;
  return db.getFirstSync<Usuario>(`SELECT * FROM usuarios WHERE email = ? LIMIT 1`, [email]) ?? null;
}

export function atualizarUsuario(dados: Usuario): ResultadoCadastro {
  if (!db) return { sucesso: false, erro: "Banco indisponível." };

  try {
    db.runSync(
      `UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?`,
      [dados.nome, dados.email, dados.senha, dados.id],
    );
    return { sucesso: true };
  } catch {
    return { sucesso: false, erro: "Erro ao atualizar usuário." };
  }
}

export function excluirUsuario(id: number): boolean {
  if (!db) return false;
  db.runSync(`DELETE FROM usuarios WHERE id = ?`, [id]);
  return true;
}*/

/**
 * database/usuarioService.ts
 *
 * Camada de serviço para autenticação e dados do usuário.
 * As telas NÃO importam Firebase diretamente — tudo passa por aqui.
 *
 * Funções exportadas:
 *  - cadastrarUsuario()      → cria conta no Auth + documento no Firestore
 *  - fazerLogin()            → autentica e retorna role do usuário
 *  - fazerLogout()           → encerra a sessão
 *  - obterUsuarioAtual()     → retorna dados do usuário logado (do Firestore)
 *  - escutarViagensDoCidadao() → listener em tempo real das viagens do usuário
 */

/**
 * database/usuarioService.ts
 *
 * Camada de serviço para autenticação e dados do usuário.
 * As telas NÃO importam Firebase diretamente — tudo passa por aqui.
 *
 * Funções exportadas:
 *  - cadastrarUsuario()      → cria conta no Auth + documento no Firestore
 *  - fazerLogin()            → autentica e retorna role do usuário
 *  - fazerLogout()           → encerra a sessão
 *  - obterUsuarioAtual()     → retorna dados do usuário logado (do Firestore)
 *  - escutarViagensDoCidadao() → listener em tempo real das viagens do usuário
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // ajuste o caminho se necessário

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

export type Role = 'citizen' | 'admin';

export interface DadosUsuario {
  uid: string;
  nome: string;
  email: string;
  role: Role;
}

export type StatusViagem = 'pending' | 'confirmed' | 'rejected';

export interface Viagem {
  id: string;
  dataViagem: string;
  destino: string;
  acompanhante: boolean;
  observacao: string;
  status: StatusViagem;
}

// ─────────────────────────────────────────────────────────────────────────────
// CADASTRO
// ─────────────────────────────────────────────────────────────────────────────

interface ParamsCadastro {
  nome: string;
  email: string;
  senha: string;
}

interface ResultadoCadastro {
  sucesso: boolean;
  erro?: string;
}

/**
 * Cria um novo usuário no Firebase Auth e salva seus dados no Firestore.
 * Role padrão: 'citizen'. Admins são promovidos manualmente no console.
 */
export async function cadastrarUsuario(params: ParamsCadastro): Promise<ResultadoCadastro> {
  const { nome, email, senha } = params;

  try {
    // 1. Criar conta no Firebase Auth
    const credencial = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), senha);
    const uid = credencial.user.uid;

    // 2. Atualizar displayName (visível no auth.currentUser)
    await updateProfile(credencial.user, { displayName: nome.trim() });

    // 3. Salvar documento na coleção 'users' do Firestore
    await setDoc(doc(db, 'users', uid), {
      uid,
      nome:  nome.trim(),
      email: email.trim().toLowerCase(),
      role:  'citizen' as Role,
      createdAt: serverTimestamp(),
    });

    return { sucesso: true };

  } catch (erro: unknown) {
    const mensagem = traduzirErroFirebase(erro);
    return { sucesso: false, erro: mensagem };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────

interface ResultadoLogin {
  sucesso: boolean;
  role?: Role;
  erro?: string;
}

/**
 * Autentica o usuário e retorna seu role para que a tela possa redirecionar.
 *  - 'citizen' → /home  (ou /(app)/home)
 *  - 'admin'   → /painel (ou /(admin)/painel)
 */
export async function fazerLogin(email: string, senha: string): Promise<ResultadoLogin> {
  try {
    const credencial = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      senha,
    );

    const uid = credencial.user.uid;

    // Buscar role no Firestore
    const snap = await getDoc(doc(db, 'users', uid));

    if (!snap.exists()) {
      // Conta existe no Auth mas não no Firestore — situação anômala
      return {
        sucesso: false,
        erro: 'Conta não encontrada. Entre em contato com a prefeitura.',
      };
    }

    const dados = snap.data() as DadosUsuario;
    return { sucesso: true, role: dados.role };

  } catch (erro: unknown) {
    return { sucesso: false, erro: traduzirErroFirebase(erro) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────────────────────

/** Encerra a sessão do usuário atual. */
export async function fazerLogout(): Promise<void> {
  await signOut(auth);
}

// ─────────────────────────────────────────────────────────────────────────────
// DADOS DO USUÁRIO ATUAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorna os dados completos do usuário logado buscando no Firestore.
 * Retorna null se não houver sessão ativa.
 */
export async function obterUsuarioAtual(): Promise<DadosUsuario | null> {
  const usuario = auth.currentUser;
  if (!usuario) return null;

  const snap = await getDoc(doc(db, 'users', usuario.uid));
  if (!snap.exists()) return null;

  return snap.data() as DadosUsuario;
}

/**
 * Retorna o primeiro nome do usuário logado (para saudações).
 * Usa displayName do Auth como fallback rápido, sem hit no Firestore.
 */
export function primeiroNomeAtual(): string {
  const usuario = auth.currentUser;
  if (!usuario) return 'Cidadão';
  const nome = usuario.displayName ?? usuario.email?.split('@')[0] ?? 'Cidadão';
  return nome.split(' ')[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// VIAGENS (listener em tempo real)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Escuta em tempo real as viagens do usuário logado.
 * Retorna uma função de cleanup para ser chamada no useEffect.
 *
 * @param onDados   callback chamado toda vez que a lista muda
 * @param onErro    callback chamado se ocorrer erro na query
 */
export function escutarViagensDoCidadao(
  onDados: (viagens: Viagem[]) => void,
  onErro: (erro: Error) => void,
): () => void {
  const usuario = auth.currentUser;

  // Se não há usuário logado, retorna cleanup vazio
  if (!usuario) {
    onDados([]);
    return () => {};
  }

  const q = query(
    collection(db, 'trips'),
    where('userId', '==', usuario.uid),
    orderBy('createdAt', 'desc'),
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const dados: Viagem[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Viagem, 'id'>),
      }));
      onDados(dados);
    },
    (erro) => onErro(erro),
  );

  return unsubscribe;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITÁRIO INTERNO
// ─────────────────────────────────────────────────────────────────────────────

function traduzirErroFirebase(erro: unknown): string {
  const msg = erro instanceof Error ? erro.message : '';

  if (msg.includes('email-already-in-use'))
    return 'Este e-mail já está cadastrado.';
  if (msg.includes('invalid-email'))
    return 'Formato de e-mail inválido.';
  if (msg.includes('weak-password'))
    return 'Senha muito fraca. Use ao menos 6 caracteres.';
  if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential'))
    return 'E-mail ou senha incorretos.';
  if (msg.includes('too-many-requests'))
    return 'Muitas tentativas. Tente novamente mais tarde.';
  if (msg.includes('network-request-failed'))
    return 'Sem conexão com a internet.';

  return msg || 'Erro desconhecido. Tente novamente.';
}
