import { cadastrarViagem } from "../database/firebase/usuarioService";

type Resultado = { sucesso: true } | { sucesso: false; erro: string };

export async function transporteController(dados: {
  nomePaciente: string;
  dataNascPaciente: string;
  nomeAcompanhante: string;
  dataNascAcompanhante: string;
  hospital: string;
  pontoEmbarque: string;
  veiculo: "onibus" | "van";
  horario: string;
}): Promise<Resultado> {
  if (!dados.nomePaciente.trim())
    return { sucesso: false, erro: "Nome do paciente é obrigatório." };
  if (!dados.dataNascPaciente.trim())
    return { sucesso: false, erro: "Data de nascimento do paciente é obrigatória." };
  if (!dados.hospital)
    return { sucesso: false, erro: "Selecione o hospital de destino." };
  if (dados.hospital === "Outro hospital" && !dados.hospital.trim())
    return { sucesso: false, erro: "Informe o nome do hospital." };
  if (!dados.pontoEmbarque.trim())
    return { sucesso: false, erro: "Informe o ponto de embarque." };

  return cadastrarViagem(dados);
}
