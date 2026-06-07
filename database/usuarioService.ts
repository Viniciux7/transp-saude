import { db } from "./sqlite";

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
}
