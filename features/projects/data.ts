export type ProjectStatus = 'Em andamento' | 'Planejamento' | 'Concluído';
export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  progress: number;
  description: string;
  objective: string;
  updates: string[];
  responsible: string;
  learnings: string[];
  pending: string[];
  overdue: number;
  transition: string;
};

// Todos os nomes, números e relatos abaixo são fictícios.
export const projects: Project[] = [
  {
    id: '1', title: 'Casa Nova Vila Esperança', status: 'Em andamento', progress: 60,
    description: 'Reforma de 10 moradias na região metropolitana.',
    objective: 'Oferecer moradia digna a 10 famílias através de reforma completa.',
    updates: ['Junho: Início das demolições.', 'Julho: Estrutura concluída em 4 casas.', 'Agosto: Pintura e acabamentos.'],
    responsible: 'Maria Silva (demo)', overdue: 1,
    learnings: ['Importância de cronograma flexível.', 'Comunicação semanal reduziu retrabalho.'],
    pending: ['Entrega de tintas', 'Vistoria elétrica', 'Limpeza final'],
    transition: 'Transição para João Souza (demo) prevista para agosto.',
  },
  {
    id: '2', title: 'Mutirão São João', status: 'Planejamento', progress: 10,
    description: 'Construção de 5 casas para famílias em vulnerabilidade.',
    objective: 'Erguer 5 novas unidades habitacionais em mutirão comunitário.',
    updates: ['Maio: Levantamento de terreno.', 'Junho: Aprovação de plantas.'],
    responsible: 'João Souza (demo)', overdue: 0, learnings: [], pending: [], transition: '',
  },
  {
    id: '3', title: 'Reforma Centro Comunitário', status: 'Concluído', progress: 100,
    description: 'Revitalização do espaço de convivência.', objective: 'Modernizar o centro para atender 200 pessoas/mês (exemplo fictício).',
    updates: ['Março: Obras finalizadas.', 'Abril: Inauguração.'],
    responsible: 'Carla Mendes (demo)', overdue: 0,
    learnings: ['Engajamento da comunidade acelerou obra.'], pending: [],
    transition: 'Projeto encerrado, lições registradas.',
  },
  {
    id: '4', title: 'Projeto Luz no Lar', status: 'Em andamento', progress: 35,
    description: 'Instalação de energia solar em 8 residências.', objective: 'Melhorar as condições de energia das moradias.',
    updates: ['Planejamento técnico em avaliação (exemplo).'], responsible: 'Equipe demonstrativa',
    overdue: 0, learnings: [], pending: [], transition: '',
  },
  {
    id: '5', title: 'Jardim Solidário', status: 'Planejamento', progress: 5,
    description: 'Criação de hortas comunitárias em 3 bairros.', objective: 'Apoiar os espaços de convivência dos projetos habitacionais.',
    updates: ['Levantamento inicial dos espaços (exemplo).'], responsible: 'Equipe demonstrativa',
    overdue: 0, learnings: [], pending: [], transition: '',
  },
];

export function findProject(id: string | undefined) {
  return projects.find(project => project.id === id);
}
