// controllers/authController.ts
//
// Camada intermediária entre as telas e o Firebase.
// As telas chamam funções daqui; este arquivo chama o usuarioService.
// Assim, cada parte tem uma responsabilidade só:
//   Tela → mostra a interface
//   Controller → valida os dados
//   Service → fala com o Firebase

import {
  cadastrarUsuario,
  fazerLogin,
  fazerLogout,
} from "../database/firebase/usuarioService";

type Resultado = { sucesso: boolean; role?: "citizen" | "admin"; erro?: string };

// Valida os campos e autentica o usuário no Firebase
export async function loginController(
  email: string,
  senha: string
): Promise<Resultado> {
  if (!email.trim() || !senha.trim())
    return { sucesso: false, erro: "Preencha todos os campos." };

  return fazerLogin(email, senha);
}

// Valida os campos e cria a conta no Firebase
export async function cadastroController(
  nome: string,
  email: string,
  senha: string
): Promise<Resultado> {
  if (!nome.trim())
    return { sucesso: false, erro: "Nome é obrigatório." };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { sucesso: false, erro: "Formato de e-mail incorreto." };

  if (senha.length < 6)
    return { sucesso: false, erro: "Senha deve ter pelo menos 6 caracteres." };

  const resultado = await cadastrarUsuario({ nome, email, senha });
  if (!resultado.sucesso) return resultado;
  return { sucesso: true, role: "citizen" as const };
}

// Encerra a sessão do usuário
export async function logoutController(): Promise<void> {
  return fazerLogout();
}
