import { db } from './db';

type ResultadoCadastro = { sucesso: true } | { sucesso: false; erro: string };

interface DadosCadastro {
  nome: string;
  email?: string;
  cpf?: string;
  dataNascimento?: string;
  senha: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: string;
  createdAt: string;
}

export function cadastrarUsuario(dados: DadosCadastro): ResultadoCadastro {
  try {
    db.runSync(
      `INSERT INTO users (nome, email, senha, role, createdAt) VALUES (?, ?, ?, 'citizen', ?)`,
      [dados.nome, dados.email ?? '', dados.senha, new Date().toISOString()]
    );
    return { sucesso: true };
  } catch (e: any) {
    if (e?.message?.includes('UNIQUE')) {
      return { sucesso: false, erro: 'Este e-mail já está cadastrado.' };
    }
    return { sucesso: false, erro: 'Erro ao salvar cadastro.' };
  }
}

export function buscarUsuarioPorEmail(email: string): Usuario | null {
  const result = db.getFirstSync<Usuario>(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email]
  );
  return result ?? null;
}
