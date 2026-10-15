export const categories = ['Integração', 'Procedimentos de campo', 'Organização das ações', 'Encerramento e aprendizados'] as const;
export type Category = typeof categories[number];
export type PlaybookVersion = { version: number; author: string; date: string; summary: string; content: string };
export type PlaybookEntry = { id: string; title: string; category: Category; versions: PlaybookVersion[] };

const welcome = 'Guia inicial com missões, valores e primeiros passos.\n\n1. Conheça a missão da AbrigoAção.\n2. Participe do encontro de integração.\n3. Acesse o Playbook para procedimentos.\n4. Registre suas atividades semanalmente.';
const closing = 'Passos para entrega, termo de recebimento e lições aprendidas.\n\n1. Vistoria final.\n2. Assinatura do termo.\n3. Registro de aprendizados.';

// Versões estáticas de demonstração, ordenadas da mais recente à mais antiga.
export const entries: PlaybookEntry[] = [
  { id: '1', title: 'Boas-vindas ao voluntário', category: 'Integração', versions: [
    { version: 2, author: 'Ana Costa (demo)', date: '2024-06-10', summary: 'Atualização de passos de integração.', content: welcome },
    { version: 1, author: 'Ana Costa (demo)', date: '2024-05-01', summary: 'Criação inicial.', content: 'Guia inicial com missões, valores e primeiros passos.\n\n1. Conheça a missão.\n2. Participe do encontro.\n3. Acesse o Playbook.' },
  ] },
  { id: '2', title: 'Procedimento de visita a obra', category: 'Procedimentos de campo', versions: [
    { version: 1, author: 'Pedro Lima (demo)', date: '2024-05-22', summary: 'Criação inicial.', content: 'Checklist de segurança, relatório fotográfico e entrega de materiais.\n\n- Verificar EPIs.\n- Fotografia antes/depois.\n- Preencher formulário de visita.' },
  ] },
  { id: '3', title: 'Encerramento de projeto', category: 'Encerramento e aprendizados', versions: [
    { version: 3, author: 'Carla Mendes (demo)', date: '2024-04-30', summary: 'Inclusão de lições aprendidas.', content: closing },
    { version: 2, author: 'Carla Mendes (demo)', date: '2024-04-10', summary: 'Ajuste no termo de recebimento.', content: 'Passos para entrega, termo de recebimento e lições aprendidas.' },
    { version: 1, author: 'Carla Mendes (demo)', date: '2024-03-20', summary: 'Criação inicial.', content: 'Passos para entrega e termo de recebimento.' },
  ] },
  { id: '4', title: 'Gestão de doações recorrentes', category: 'Organização das ações', versions: [
    { version: 1, author: 'Lucas Rocha (demo)', date: '2024-07-01', summary: 'Criação inicial.', content: 'Como registrar intenções, acompanhar simulações e relatar à coordenação.\n\nIntenções mensais não representam pagamentos recebidos. Neste protótipo não há cobrança nem registro financeiro.' },
  ] },
  { id: '5', title: 'Comunicação com apoiadores', category: 'Organização das ações', versions: [
    { version: 1, author: 'Fernanda Dias (demo)', date: '2024-06-15', summary: 'Criação inicial.', content: 'Modelos de e-mail, frequência de atualizações e boas práticas.' },
  ] },
  { id: '6', title: 'Segurança no canteiro', category: 'Procedimentos de campo', versions: [
    { version: 2, author: 'Roberto Alves (demo)', date: '2024-03-18', summary: 'Revisão dos procedimentos de emergência (exemplo).', content: 'EPIs obrigatórios, sinalização e procedimentos de emergência.' },
  ] },
];

export function findEntry(id: string | undefined) {
  return entries.find(entry => entry.id === id);
}

export function formatDemoDate(iso: string) {
  return iso.split('-').reverse().join('/');
}
