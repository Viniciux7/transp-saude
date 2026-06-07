import { db } from "./sqlite";

type ResultadoCadastro = { sucesso: true } | { sucesso: false; erro: string };

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  contato: string;
  lembrete: string;
}

export function cadastrarPaciente(dados: Omit<Paciente, "id">): ResultadoCadastro {
  if (!db) return { sucesso: false, erro: "Banco indisponível." };

  try {
    db.runSync(
      `INSERT INTO pacientes (nome, idade, contato, lembrete, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [dados.nome, dados.idade, dados.contato, dados.lembrete, new Date().toISOString()],
    );
    return { sucesso: true };
  } catch {
    return { sucesso: false, erro: "Erro ao salvar paciente." };
  }
}

export function buscarPacientePorNome(nome: string): Paciente | null {
  if (!db) return null;
  return db.getFirstSync<Paciente>(`SELECT * FROM pacientes WHERE nome = ? LIMIT 1`, [nome]) ?? null;
}

export function atualizarPaciente(dados: Paciente): ResultadoCadastro {
  if (!db) return { sucesso: false, erro: "Banco indisponível." };

  try {
    db.runSync(
      `UPDATE pacientes SET nome = ?, idade = ?, contato = ?, lembrete = ? WHERE id = ?`,
      [dados.nome, dados.idade, dados.contato, dados.lembrete, dados.id],
    );
    return { sucesso: true };
  } catch {
    return { sucesso: false, erro: "Erro ao atualizar paciente." };
  }
}

export function excluirPaciente(id: number): boolean {
  if (!db) return false;
  db.runSync(`DELETE FROM pacientes WHERE id = ?`, [id]);
  return true;
}
