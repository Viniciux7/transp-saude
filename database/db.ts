import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('transpsaude.db');

export function inicializarBanco(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT    NOT NULL,
      email     TEXT    NOT NULL UNIQUE,
      senha     TEXT    NOT NULL,
      role      TEXT    NOT NULL DEFAULT 'citizen',
      createdAt TEXT    NOT NULL
    );
  `);
}
