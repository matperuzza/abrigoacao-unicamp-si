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
  relatedProcedures?: string[];
};

// Todos os nomes, números e relatos abaixo são fictícios.
export const projects: Project[] = [
  {
    id: '1',
    title: 'Casa Nova Vila Esperança',
    status: 'Em andamento',
    progress: 60,
    description: 'Reforma de 10 moradias na região metropolitana de Campinas.',
    objective: 'Oferecer moradia digna a 10 famílias através de reforma completa (estrutura, cobertura, instalações, acabamento).',
    updates: [
      'Junho: Início das demolições e limpeza dos terrenos.',
      'Julho: Estrutura concluída em 4 casas; alvenaria iniciada nas demais.',
      'Agosto: Cobertura finalizada em 6 casas; instalações elétricas em andamento.',
      'Setembro: Pintura e acabamentos internos nas 4 primeiras unidades.',
    ],
    responsible: 'Filipe Angi',
    overdue: 1,
    learnings: [
      'Importância de cronograma flexível para acomodar imprevistos climáticos.',
      'Comunicação semanal entre equipe e famílias reduziu retrabalho em 30%.',
      'Parceria com loja local de materiais agilizou entregas.',
    ],
    pending: ['Entrega de tintas e revestimentos', 'Vistoria elétrica das 6 casas cobertas', 'Limpeza final e preparação para entrega'],
    transition: 'Transição prevista para outubro: João Tamosaitis assumirá a coordenação de acabamentos.',
    relatedProcedures: ['2', '3', '6'],
  },
  {
    id: '2',
    title: 'Mutirão São João',
    status: 'Planejamento',
    progress: 15,
    description: 'Construção de 5 casas para famílias em vulnerabilidade no bairro São João.',
    objective: 'Erguer 5 novas unidades habitacionais em mutirão comunitário com voluntários e famílias beneficiadas.',
    updates: [
      'Maio: Levantamento topográfico e geotécnico do terreno concluído.',
      'Junho: Aprovação de plantas e alvará de construção.',
      'Julho: Seleção das 5 famílias beneficiadas; cronograma de mutirões definido.',
      'Agosto: Captação de 30 voluntários para primeira etapa (fundação).',
    ],
    responsible: 'João Tamosaitis',
    overdue: 0,
    learnings: [],
    pending: ['Compra de cimento e ferragens (cotação em andamento)', 'Definição de datas dos mutirões com famílias', 'Treinamento de segurança para voluntários'],
    transition: '',
    relatedProcedures: ['1', '2', '6'],
  },
  {
    id: '3',
    title: 'Reforma Centro Comunitário',
    status: 'Concluído',
    progress: 100,
    description: 'Revitalização completa do espaço de convivência do bairro Vila Nova.',
    objective: 'Modernizar o centro para atender 200 pessoas/mês com salas de aula, cozinha comunitária e área de lazer.',
    updates: [
      'Março: Obras finalizadas — pintura, piso, instalações, mobiliário.',
      'Abril: Inauguração com presença de 150 moradores e autoridades locais.',
      'Maio: Primeira oficina de capacitação profissional realizada no espaço.',
    ],
    responsible: 'Matheus Peruzza',
    overdue: 0,
    learnings: [
      'Engajamento da comunidade na pintura acelerou obra em 2 semanas.',
      'Parceria com empresa de móveis garantiu doação de 50 cadeiras e 10 mesas.',
    ],
    pending: [],
    transition: 'Projeto encerrado. Lições registradas no playbook (proc. "Encerramento de projeto").',
    relatedProcedures: ['3', '5'],
  },
  {
    id: '4',
    title: 'Projeto Luz no Lar',
    status: 'Em andamento',
    progress: 40,
    description: 'Instalação de sistemas fotovoltaicos em 8 residências da região.',
    objective: 'Melhorar as condições de energia das moradias, reduzindo custo mensal em até 70%.',
    updates: [
      'Junho: Estudo de viabilidade técnica concluído para 8 residências.',
      'Julho: Projeto executivo aprovado; equipamentos cotados com 3 fornecedores.',
      'Agosto: Instalação iniciada nas 3 primeiras residências.',
    ],
    responsible: 'André Luis',
    overdue: 0,
    learnings: [],
    pending: ['Aquisição de inversores e módulos (aguardando melhor preço)', 'Agendamento de instalação nas 5 residências restantes', 'Capacitação de moradores para manutenção básica'],
    transition: '',
    relatedProcedures: ['2', '6'],
  },
  {
    id: '5',
    title: 'Jardim Solidário',
    status: 'Planejamento',
    progress: 10,
    description: 'Criação de hortas comunitárias em 3 bairros para segurança alimentar e convivência.',
    objective: 'Apoiar os espaços de convivência dos projetos habitacionais com produção de alimentos e geração de renda.',
    updates: [
      'Julho: Levantamento inicial dos 3 espaços disponíveis (terrenos ociosos da prefeitura).',
      'Agosto: Reunião com associações de moradores para definição de regras de uso.',
    ],
    responsible: 'Giovana Carvalho',
    overdue: 0,
    learnings: [],
    pending: ['Formalização de termo de cessão de uso com prefeitura', 'Preparação do solo e canteiros', 'Compra de mudas, sementes e ferramentas'],
    transition: '',
    relatedProcedures: ['1', '5'],
  },
  {
    id: '6',
    title: 'Reforma Moradia Acolhedora',
    status: 'Planejamento',
    progress: 5,
    description: 'Reforma de moradia para família em situação de vulnerabilidade no bairro Jardim das Flores.',
    objective: 'Proporcionar moradia digna e segura através de reforma estrutural, hidráulica e elétrica completa.',
    updates: [
      'Agosto: Visita técnica de avaliação realizada.',
      'Setembro: Levantamento de orçamentos e captação de materiais.',
    ],
    responsible: 'Betania',
    overdue: 0,
    learnings: [],
    pending: ['Aprovação do projeto pela família', 'Captação de voluntários para mutirão', 'Aquisição de materiais de construção'],
    transition: '',
    relatedProcedures: ['1', '2', '3', '6'],
  },
];

export function findProject(id: string | undefined) {
  return projects.find(project => project.id === id);
}