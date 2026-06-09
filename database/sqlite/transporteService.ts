/**import { db } from "./sqlite";

type ResultadoCadastro = { sucesso: true } | { sucesso: false; erro: string };

export interface Transporte {
  id: number;
  data: string;
  hora: string;
  hospital: string;
  veiculoId: number;   // referência ao veículo cadastrado
  lembrete: string;
}

// CREATE
export function cadastrarTransporte(dados: Omit<Transporte, "id">): ResultadoCadastro {
  if (!db) return { sucesso: false, erro: "Banco indisponível." };

  try {
    db.runSync(
      `INSERT INTO transportes (data, hora, hospital, veiculoId, lembrete, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
      [dados.data, dados.hora, dados.hospital, dados.veiculoId, dados.lembrete, new Date().toISOString()],
    );
    return { sucesso: true };
  } catch (e: any) {
    return { sucesso: false, erro: "Erro ao salvar transporte." };
  }
}

// READ
export function buscarTransportePorVeiculo(veiculoId: number): Transporte | null {
  if (!db) return null;

  const result = db.getFirstSync<Transporte>(
    `SELECT * FROM transportes WHERE veiculoId = ? LIMIT 1`,
    [veiculoId],
  );
  return result ?? null;
}

export function listarTransportes(): Transporte[] {
  if (!db) return [];
  return db.getAllSync<Transporte>(`SELECT * FROM transportes ORDER BY data, hora`) ?? [];
}

// UPDATE
export function atualizarTransporte(dados: Transporte): ResultadoCadastro {
  if (!db) return { sucesso: false, erro: "Banco indisponível." };

  try {
    db.runSync(
      `UPDATE transportes SET data = ?, hora = ?, hospital = ?, veiculoId = ?, lembrete = ? WHERE id = ?`,
      [dados.data, dados.hora, dados.hospital, dados.veiculoId, dados.lembrete, dados.id],
    );
    return { sucesso: true };
  } catch {
    return { sucesso: false, erro: "Erro ao atualizar transporte." };
  }
}

// DELETE
export function excluirTransporte(id: number): boolean {
  if (!db) return false;
  db.runSync(`DELETE FROM transportes WHERE id = ?`, [id]);
  return true;
}
*/