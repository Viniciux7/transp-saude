/**
 * database/userService.ts
 *
 * Este arquivo contém todas as operações de banco relacionadas a usuários:
 *   - cadastrarUsuario → INSERT
 *   - buscarUsuarioPorCpf → SELECT (usado no login)
 *
 * ─── POR QUE EXISTE ESTE ARQUIVO? ───────────────────────────
 * Poderíamos escrever o SQL direto nas telas, mas isso seria ruim:
 *   - Se precisar mudar o SQL, teria que mudar em vários lugares
 *   - A tela ficaria misturada com lógica de banco
 *   - Mais difícil de testar e entender
 *
 * Com este arquivo, a tela só faz:
 *   const usuario = await buscarUsuarioPorCpf('123.456.789-00');
 *
 * ─── SOBRE SENHAS ────────────────────────────────────────────
 * Em produção real, NUNCA salvamos a senha em texto puro.
 * Usaríamos um algoritmo de hash (bcrypt, por exemplo).
 * Para este projeto acadêmico, vamos salvar sem hash para simplificar,
 * mas o comentário está aqui para você saber que existe essa questão.
 */

import { db } from './db';

// ─────────────────────────────────────────────────────────────
// TIPOS
//
// TypeScript usa "interface" para descrever o formato de um objeto.
// Isso nos ajuda a não esquecer nenhum campo e evita erros de digitação.
// ─────────────────────────────────────────────────────────────
export interface Usuario {
  id?:             number;  // opcional porque é gerado pelo banco
  nome:            string;
  cpf:             string;
  dataNascimento:  string;
  senha:           string;
  role:            'citizen' | 'admin'; // só esses dois valores são válidos
  createdAt?:      string;  // opcional porque é gerado automaticamente
}

// ─────────────────────────────────────────────────────────────
// CADASTRAR USUÁRIO
//
// Recebe os dados do formulário e insere no banco.
// Retorna { sucesso: true } ou { sucesso: false, erro: '...' }
//
// Por que retornamos um objeto em vez de lançar exceção?
// Porque é mais fácil tratar na tela com um if simples.
// ─────────────────────────────────────────────────────────────
export function cadastrarUsuario(
  dados: Omit<Usuario, 'id' | 'createdAt' | 'role'>
  // Omit<Usuario, 'id' | 'createdAt' | 'role'> significa:
  // "todos os campos de Usuario, EXCETO id, createdAt e role"
  // porque esses três são gerados automaticamente
): { sucesso: boolean; erro?: string } {

  try {
    // Verificar se o CPF já existe antes de tentar inserir
    const jaExiste = db.getFirstSync<{ id: number }>(
      'SELECT id FROM users WHERE cpf = ?',
      [dados.cpf]
    );

    if (jaExiste) {
      return { sucesso: false, erro: 'Este CPF já está cadastrado.' };
    }

    // INSERT INTO: insere uma nova linha na tabela users
    //
    // Os "?" são placeholders — protegem contra SQL Injection.
    // SQL Injection é quando alguém coloca SQL malicioso num campo de texto.
    // Usando placeholders, o valor é tratado como texto puro, nunca como SQL.
    //
    // runSync executa o comando e retorna informações sobre a operação.
    db.runSync(
      `INSERT INTO users (nome, cpf, dataNascimento, senha, role, createdAt)
       VALUES (?, ?, ?, ?, 'citizen', ?)`,
      [
        dados.nome,
        dados.cpf,
        dados.dataNascimento,
        dados.senha,
        new Date().toISOString(), // ex: "2024-05-18T14:32:00.000Z"
      ]
    );

    return { sucesso: true };

  } catch (erro: any) {
    console.error('Erro ao cadastrar usuário:', erro);
    return { sucesso: false, erro: 'Erro interno. Tente novamente.' };
  }
}

// ─────────────────────────────────────────────────────────────
// BUSCAR USUÁRIO POR CPF (para o login)
//
// getFirstSync executa um SELECT e retorna apenas a primeira linha.
// Retorna null se não encontrar nenhum registro.
//
// Na tela de login, verificamos:
//   1. O usuário existe? (CPF cadastrado)
//   2. A senha bate?
// ─────────────────────────────────────────────────────────────
export function buscarUsuarioPorCpf(cpf: string): Usuario | null {
  try {
    const usuario = db.getFirstSync<Usuario>(
      'SELECT * FROM users WHERE cpf = ?',
      [cpf]
    );

    // getFirstSync retorna undefined se não achar — convertemos para null
    return usuario ?? null;

  } catch (erro: any) {
    console.error('Erro ao buscar usuário:', erro);
    return null;
  }
}