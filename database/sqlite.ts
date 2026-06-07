import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

export const db = Platform.OS !== 'web'
  ? SQLite.openDatabaseSync('transpsaude.db')
  : null;

export function inicializarBanco(): void {
  if (!db) return;

  db.execSync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT    NOT NULL,
      email     TEXT    NOT NULL UNIQUE,
      senha     TEXT    NOT NULL,
      createdAt TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pacientes (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT    NOT NULL UNIQUE,
      idade     INTEGER NOT NULL,
      contato   TEXT    NOT NULL,
      lembrete  TEXT,
      createdAt TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS veiculos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo        TEXT    NOT NULL,
      placa       TEXT    NOT NULL UNIQUE,
      assentos    INTEGER NOT NULL,
      createdAt   TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transportes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      data        TEXT    NOT NULL,
      hora        TEXT    NOT NULL,
      hospital    TEXT    NOT NULL,
      veiculoId   INTEGER NOT NULL,
      lembrete    TEXT,
      createdAt   TEXT    NOT NULL,
      FOREIGN KEY (veiculoId) REFERENCES veiculos(id)
    );
  `);
}
