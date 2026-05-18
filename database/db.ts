/**
 * database/db.ts
 *
 * Este arquivo faz duas coisas:
 *   1. Abre (ou cria) o arquivo do banco de dados SQLite no celular
 *   2. Cria as tabelas se elas ainda não existirem
 *
 * ─── O QUE É SQLite? ────────────────────────────────────────
 * SQLite é um banco de dados que fica salvo num arquivo dentro
 * do próprio celular. Quando você chama openDatabaseSync('banco.db'),
 * o Expo cria um arquivo chamado "banco.db" no armazenamento interno
 * do app. Esse arquivo persiste mesmo fechando o app.
 *
 * ─── POR QUE SEPARAR ESTE ARQUIVO? ─────────────────────────
 * Boa prática: a tela não deve saber como o banco funciona.
 * Ela só chama funções como "cadastrarUsuario(dados)".
 * Quem sabe do SQL é este arquivo e o userService.ts.
 * Isso se chama "separação de responsabilidades".
 */

import * as SQLite from 'expo-sqlite';

// ─────────────────────────────────────────────────────────────
// ABRIR O BANCO
//
// openDatabaseSync abre o arquivo SQLite de forma síncrona.
// Se o arquivo não existir, ele é criado automaticamente.
// Exportamos "db" para que outros arquivos possam usar a mesma conexão.
// ─────────────────────────────────────────────────────────────
export const db = SQLite.openDatabaseSync('transpsaude.db');

// ─────────────────────────────────────────────────────────────
// INICIALIZAR TABELAS
//
// Esta função cria as tabelas do banco na primeira vez que o app abre.
// "CREATE TABLE IF NOT EXISTS" = só cria se ainda não existe.
// Assim podemos chamar essa função toda vez sem medo de apagar dados.
//
// Deve ser chamada UMA VEZ na inicialização do app (em _layout.tsx).
// ─────────────────────────────────────────────────────────────
export function inicializarBanco(): void {
  db.execSync(`
    -- Tabela de usuários
    -- Guarda os dados de quem se cadastrou no app.
    --
    -- INTEGER PRIMARY KEY AUTOINCREMENT:
    --   O banco gera um número único automaticamente para cada linha.
    --   Não precisamos informar o id ao inserir.
    --
    -- NOT NULL:
    --   O campo é obrigatório — o banco rejeita inserções sem esse valor.
    --
    -- UNIQUE:
    --   Não permite dois registros com o mesmo valor nessa coluna.
    --   Usamos em CPF para evitar cadastros duplicados.

    CREATE TABLE IF NOT EXISTS users (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      nome            TEXT    NOT NULL,
      cpf             TEXT    NOT NULL UNIQUE,
      dataNascimento  TEXT    NOT NULL,
      senha           TEXT    NOT NULL,
      role            TEXT    NOT NULL DEFAULT 'citizen',
      createdAt       TEXT    NOT NULL
    );
  `);
}