import { db } from "./sqlite";

interface Veiculo {
  id: number;
  tipo: string;
  placa: string;
  assentos: number;
}

export function cadastrarVeiculo(dados: Omit<Veiculo, "id">): boolean {
  if (!db) return false;
  db.runSync(
    `INSERT INTO veiculos (tipo, placa, assentos, createdAt) VALUES (?, ?, ?, ?)`,
    [dados.tipo, dados.placa, dados.assentos, new Date().toISOString()],
  );
  return true;
}

export function buscarVeiculoPorPlaca(placa: string): Veiculo | null {
  if (!db) return null;
  return db.getFirstSync<Veiculo>(`SELECT * FROM veiculos WHERE placa = ? LIMIT 1`, [placa]) ?? null;
}

export function atualizarVeiculo(dados: Veiculo): boolean {
  if (!db) return false;
  db.runSync(
    `UPDATE veiculos SET tipo = ?, placa = ?, assentos = ? WHERE id = ?`,
    [dados.tipo, dados.placa, dados.assentos, dados.id],
  );
  return true;
}

export function excluirVeiculo(id: number): boolean {
  if (!db) return false;
  db.runSync(`DELETE FROM veiculos WHERE id = ?`, [id]);
  return true;
}
