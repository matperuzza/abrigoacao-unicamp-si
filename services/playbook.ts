import AsyncStorage from '@react-native-async-storage/async-storage';

export const categories = ['Integração', 'Procedimentos de campo', 'Organização das ações', 'Encerramento e aprendizados'] as const;
export type Category = typeof categories[number];
export type PlaybookVersion = { version: number; author: string; date: string; summary: string; title: string; category: Category; content: string };
export type PlaybookEntry = { id: string; title: string; category: Category; versions: PlaybookVersion[] };

export function formatDemoDate(iso: string): string {
  return iso.split('-').reverse().join('/');
}

const STORAGE_KEY = 'abrigoacao.playbook.v1';
const SCHEMA_VERSION = 1;
const DATA_VERSION = 4;

type StoredPlaybook = {
  schemaVersion: number;
  dataVersion: number;
  entries: PlaybookEntry[];
  updatedAt: string;
};

export class PlaybookStorageError extends Error {
  public readonly code: 'NOT_FOUND' | 'PARSE_ERROR' | 'SCHEMA_MISMATCH' | 'INVALID_STRUCTURE' | 'INVALID_CONTENT' | 'WRITE_ERROR' | 'UNKNOWN';
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: 'NOT_FOUND' | 'PARSE_ERROR' | 'SCHEMA_MISMATCH' | 'INVALID_STRUCTURE' | 'INVALID_CONTENT' | 'WRITE_ERROR' | 'UNKNOWN',
    originalError?: Error
  ) {
    super(message);
    this.name = 'PlaybookStorageError';
    this.code = code;
    this.originalError = originalError;
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDateForStorage(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDemoAuthor(profile: 'Voluntário' | 'Coordenação', personName?: string): string {
  if (personName) {
    return `${personName} (${profile})`;
  }
  return `${profile} (demo)`;
}

function validateVersion(version: unknown): version is PlaybookVersion {
  if (!version || typeof version !== 'object') return false;
  const v = version as Record<string, unknown>;
  return (
    typeof v.version === 'number' &&
    typeof v.author === 'string' &&
    typeof v.date === 'string' &&
    typeof v.summary === 'string' &&
    typeof v.title === 'string' &&
    typeof v.category === 'string' &&
    categories.includes(v.category as Category) &&
    typeof v.content === 'string'
  );
}

function validateEntry(entry: unknown): entry is PlaybookEntry {
  if (!entry || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.title === 'string' &&
    typeof e.category === 'string' &&
    categories.includes(e.category as Category) &&
    Array.isArray(e.versions) &&
    e.versions.length > 0 &&
    e.versions.every(validateVersion)
  );
}

const teamMembers = [
  { firstName: 'Filipe', displayName: 'Filipe Angi' },
  { firstName: 'João', displayName: 'João Tamosaitis' },
  { firstName: 'André', displayName: 'André Luis' },
  { firstName: 'Giovana', displayName: 'Giovana Carvalho' },
  { firstName: 'Isabela', displayName: 'Isabela Patino' },
  { firstName: 'Lucas', displayName: 'Lucas Blanes' },
  { firstName: 'Matheus', displayName: 'Matheus Peruzza' },
  { firstName: 'Betania', displayName: 'Betania' },
] as const;

function findTeamMemberByFirstName(firstName: string): { displayName: string } | undefined {
  return teamMembers.find(p => p.firstName === firstName);
}

function getAuthorName(firstName: string, profile: 'Voluntário' | 'Coordenação'): string {
  const member = findTeamMemberByFirstName(firstName);
  const name = member?.displayName ?? firstName;
  return `${name} (${profile})`;
}

async function getInitialEntries(): Promise<PlaybookEntry[]> {
  const filipe = findTeamMemberByFirstName('Filipe');
  const lucas = findTeamMemberByFirstName('Lucas');
  const isabela = findTeamMemberByFirstName('Isabela');

  const filipeName = filipe?.displayName ?? 'Filipe Angi';
  const lucasName = lucas?.displayName ?? 'Lucas Blanes';
  const isabelaName = isabela?.displayName ?? 'Isabela Patino';

  const welcome = `Guia inicial com missões, valores e primeiros passos.

1. Conheça a missão da AbrigoAção: moradia digna por meio de voluntariado organizado.
2. Participe do encontro de integração (realizado mensalmente).
3. Acesse o Playbook para consultar procedimentos de campo, organização e encerramento.
4. Registre suas atividades e aprendizados no projeto ao qual está vinculado.

Contatos úteis:
- Coordenação geral: ${filipeName}
- Segurança: ${lucasName}
- Comunicação: ${isabelaName}`;

  const fieldVisit = `Procedimento padrão para visita a obra.

Checklist de segurança:
- Verificar EPIs obrigatórios (capacete, botina, colete, luvas).
- Confirmar sinalização do canteiro.
- Validar autorização de acesso com o responsável local.

Relatório fotográfico:
- Fotografar frente, fundos e laterais da obra.
- Registrar detalhes de instalações (elétrica, hidráulica, acabamento).
- Capturar não conformidades com legenda descritiva.

Entrega de materiais:
- Conferir nota fiscal contra requisição.
- Registrar no formulário de visita (papel ou app).
- Comunicar divergências à coordenação em até 24h.`;

  const closing = `Passos para entrega formal, termo de recebimento e lições aprendidas.

1. Vistoria final conjunta (responsável técnico + família beneficiada + coordenação).
2. Preenchimento do termo de recebimento com assinaturas.
3. Entrega de chaves e manuais de uso/manutenção.
4. Registro de lições aprendidas no Playbook (categoria "Encerramento e aprendizados").
5. Arquivamento de fotos, plantas e documentos no armazenamento da ONG.

Modelo de termo de recebimento anexo ao procedimento.`;

  const donations = `Como registrar intenções de doação recorrente, acompanhar simulações e relatar à coordenação.

Fluxo demonstrativo:
1. Apoiador escolhe valor (R$ 20, R$ 50 ou R$ 100) na área pública.
2. Confirma a simulação — nenhuma cobrança é realizada.
3. Resultado exibido com aviso explícito de simulação.
4. Coordenação consulta relatório consolidado (futuro backend).

Intenções mensais não representam pagamentos recebidos. Neste protótipo não há cobrança nem registro financeiro.`;

  const communication = `Modelos de e-mail, frequência de atualizações e boas práticas para comunicação com apoiadores.

Frequência sugerida:
- Mensal: resumo de avanços dos projetos (fotos + indicadores).
- Trimestral: relatório de impacto com depoimentos.
- Eventual: campanhas específicas (ex: mutirão, emergência).

Boas práticas:
- Tom pessoal e transparente.
- Sempre incluir fotos reais (com autorização).
- Link para área de projetos do site/app.
- Agradecimento nominal quando possível (LGPD).`;

  const safety = `EPIs obrigatórios, sinalização e procedimentos de emergência no canteiro.

EPIs mínimos por atividade:
- Obra geral: capacete, botina, colete, luvas, óculos.
- Altura: cinto de segurança tipo paraquedista + talabarte duplo.
- Elétrica: luvas isolantes, óculos de proteção, calçado dielétrico.
- Solda: máscara de solda, avental de raspa, luvas de vaqueta.

Sinalização:
- Fita zebrada em áreas de risco.
- Placas "Área de obra - Proibida a entrada de pessoas não autorizadas".
- Sinalização noturna se houver trabalho após o pôr do sol.

Emergência:
- Kit de primeiros socorros acessível e sinalizado.
- Contatos de emergência afixados (SAMU 192, Bombeiros 193, responsável local).
- Ponto de encontro definido e comunicado a todos no início do dia.`;

  const now = new Date();
  const currentYear = now.getFullYear();
  const lastYear = currentYear - 1;
  const twoYearsAgo = currentYear - 2;

  return [
    {
      id: '1',
      title: 'Boas-vindas ao voluntário',
      category: 'Integração',
      versions: [
        {
          version: 3,
          author: getAuthorName('Filipe', 'Coordenação'),
          date: `${currentYear}-06-15`,
          summary: 'Atualização de contatos da equipe real.',
          title: 'Boas-vindas ao voluntário',
          category: 'Integração',
          content: welcome,
        },
        {
          version: 2,
          author: getAuthorName('Filipe', 'Coordenação'),
          date: `${lastYear}-06-10`,
          summary: 'Atualização de passos de integração e contatos.',
          title: 'Boas-vindas ao voluntário',
          category: 'Integração',
          content: welcome,
        },
        {
          version: 1,
          author: getAuthorName('Filipe', 'Coordenação'),
          date: `${twoYearsAgo}-05-01`,
          summary: 'Criação inicial.',
          title: 'Boas-vindas ao voluntário',
          category: 'Integração',
          content: 'Guia inicial com missões, valores e primeiros passos.\n\n1. Conheça a missão.\n2. Participe do encontro.\n3. Acesse o Playbook.',
        },
      ],
    },
    {
      id: '2',
      title: 'Procedimento de visita a obra',
      category: 'Procedimentos de campo',
      versions: [
        {
          version: 3,
          author: getAuthorName('Lucas', 'Voluntário'),
          date: `${currentYear}-07-20`,
          summary: 'Atualização de checklist e responsáveis.',
          title: 'Procedimento de visita a obra',
          category: 'Procedimentos de campo',
          content: fieldVisit,
        },
        {
          version: 2,
          author: getAuthorName('Lucas', 'Voluntário'),
          date: `${lastYear}-07-15`,
          summary: 'Inclusão de checklist de entrega de materiais e contatos.',
          title: 'Procedimento de visita a obra',
          category: 'Procedimentos de campo',
          content: fieldVisit,
        },
        {
          version: 1,
          author: getAuthorName('Lucas', 'Voluntário'),
          date: `${twoYearsAgo}-05-22`,
          summary: 'Criação inicial.',
          title: 'Procedimento de visita a obra',
          category: 'Procedimentos de campo',
          content: 'Checklist de segurança, relatório fotográfico e entrega de materiais.\n\n- Verificar EPIs.\n- Fotografia antes/depois.\n- Preencher formulário de visita.',
        },
      ],
    },
    {
      id: '3',
      title: 'Encerramento de projeto',
      category: 'Encerramento e aprendizados',
      versions: [
        {
          version: 5,
          author: getAuthorName('Matheus', 'Coordenação'),
          date: `${currentYear}-08-25`,
          summary: 'Atribuição ao responsável do projeto Reforma Centro Comunitário.',
          title: 'Encerramento de projeto',
          category: 'Encerramento e aprendizados',
          content: closing,
        },
        {
          version: 4,
          author: getAuthorName('Matheus', 'Coordenação'),
          date: `${lastYear}-08-20`,
          summary: 'Adição de modelo de termo e arquivamento.',
          title: 'Encerramento de projeto',
          category: 'Encerramento e aprendizados',
          content: closing,
        },
        {
          version: 3,
          author: getAuthorName('Matheus', 'Coordenação'),
          date: `${lastYear}-04-30`,
          summary: 'Inclusão de lições aprendidas.',
          title: 'Encerramento de projeto',
          category: 'Encerramento e aprendizados',
          content: closing,
        },
        {
          version: 2,
          author: getAuthorName('Matheus', 'Coordenação'),
          date: `${lastYear}-04-10`,
          summary: 'Ajuste no termo de recebimento.',
          title: 'Encerramento de projeto',
          category: 'Encerramento e aprendizados',
          content: 'Passos para entrega, termo de recebimento e lições aprendidas.',
        },
        {
          version: 1,
          author: getAuthorName('Matheus', 'Coordenação'),
          date: `${twoYearsAgo}-03-20`,
          summary: 'Criação inicial.',
          title: 'Encerramento de projeto',
          category: 'Encerramento e aprendizados',
          content: 'Passos para entrega e termo de recebimento.',
        },
      ],
    },
    {
      id: '4',
      title: 'Gestão de doações recorrentes',
      category: 'Organização das ações',
      versions: [
        {
          version: 3,
          author: getAuthorName('Giovana', 'Voluntário'),
          date: `${currentYear}-07-15`,
          summary: 'Atualização com fluxo demonstrativo e avisos.',
          title: 'Gestão de doações recorrentes',
          category: 'Organização das ações',
          content: donations,
        },
        {
          version: 2,
          author: getAuthorName('Giovana', 'Voluntário'),
          date: `${lastYear}-07-10`,
          summary: 'Detalhamento do fluxo demonstrativo e avisos.',
          title: 'Gestão de doações recorrentes',
          category: 'Organização das ações',
          content: donations,
        },
        {
          version: 1,
          author: getAuthorName('Giovana', 'Voluntário'),
          date: `${twoYearsAgo}-07-01`,
          summary: 'Criação inicial.',
          title: 'Gestão de doações recorrentes',
          category: 'Organização das ações',
          content: 'Como registrar intenções, acompanhar simulações e relatar à coordenação.\n\nIntenções mensais não representam pagamentos recebidos. Neste protótipo não há cobrança nem registro financeiro.',
        },
      ],
    },
    {
      id: '5',
      title: 'Comunicação com apoiadores',
      category: 'Organização das ações',
      versions: [
        {
          version: 3,
          author: getAuthorName('Isabela', 'Voluntário'),
          date: `${currentYear}-06-25`,
          summary: 'Atualização de modelos e boas práticas.',
          title: 'Comunicação com apoiadores',
          category: 'Organização das ações',
          content: communication,
        },
        {
          version: 2,
          author: getAuthorName('Isabela', 'Voluntário'),
          date: `${lastYear}-06-20`,
          summary: 'Adição de frequência e boas práticas.',
          title: 'Comunicação com apoiadores',
          category: 'Organização das ações',
          content: communication,
        },
        {
          version: 1,
          author: getAuthorName('Isabela', 'Voluntário'),
          date: `${twoYearsAgo}-06-15`,
          summary: 'Criação inicial.',
          title: 'Comunicação com apoiadores',
          category: 'Organização das ações',
          content: 'Modelos de e-mail, frequência de atualizações e boas práticas.',
        },
      ],
    },
    {
      id: '6',
      title: 'Segurança no canteiro',
      category: 'Procedimentos de campo',
      versions: [
        {
          version: 4,
          author: getAuthorName('André', 'Coordenação'),
          date: `${currentYear}-05-10`,
          summary: 'Revisão completa com EPIs por atividade e emergência.',
          title: 'Segurança no canteiro',
          category: 'Procedimentos de campo',
          content: safety,
        },
        {
          version: 3,
          author: getAuthorName('André', 'Coordenação'),
          date: `${lastYear}-05-05`,
          summary: 'Revisão completa com EPIs por atividade e emergência.',
          title: 'Segurança no canteiro',
          category: 'Procedimentos de campo',
          content: safety,
        },
        {
          version: 2,
          author: getAuthorName('André', 'Coordenação'),
          date: `${twoYearsAgo}-03-18`,
          summary: 'Revisão dos procedimentos de emergência.',
          title: 'Segurança no canteiro',
          category: 'Procedimentos de campo',
          content: 'EPIs obrigatórios, sinalização e procedimentos de emergência.',
        },
      ],
    },
  ];
}

function replaceDemoAuthors(entry: PlaybookEntry): PlaybookEntry {
  const demoAuthorMap: Record<string, string> = {
    'Ana Costa (demo)': getAuthorName('Filipe', 'Coordenação'),
    'Pedro Lima (demo)': getAuthorName('Lucas', 'Voluntário'),
    'Carla Mendes (demo)': getAuthorName('Matheus', 'Coordenação'),
    'Lucas Rocha (demo)': getAuthorName('Giovana', 'Voluntário'),
    'Fernanda Dias (demo)': getAuthorName('Isabela', 'Voluntário'),
    'Roberto Alves (demo)': getAuthorName('André', 'Coordenação'),
  };

  const updatedVersions = entry.versions.map(version => {
    const newAuthor = demoAuthorMap[version.author] ?? version.author;
    return newAuthor !== version.author ? { ...version, author: newAuthor } : version;
  });

  return { ...entry, versions: updatedVersions };
}

async function migrateDataIfNeeded(parsed: StoredPlaybook): Promise<PlaybookEntry[]> {
  if (parsed.dataVersion === DATA_VERSION) {
    return parsed.entries.map(replaceDemoAuthors);
  }

  const initialEntries = await getInitialEntries();
  const initialMap = new Map(initialEntries.map(e => [e.id, e]));
  const migratedEntries: PlaybookEntry[] = [];

  for (const entry of parsed.entries) {
    if (!validateEntry(entry)) {
      continue;
    }
    const initial = initialMap.get(entry.id);
    if (initial && JSON.stringify(initial.versions[0].content) === JSON.stringify(entry.versions[0].content)) {
      const mergedVersions = mergeVersions(initial.versions, entry.versions);
      migratedEntries.push({ ...initial, versions: mergedVersions });
    } else {
      migratedEntries.push(replaceDemoAuthors(entry));
    }
  }

  for (const initial of initialEntries) {
    if (!migratedEntries.some(e => e.id === initial.id)) {
      migratedEntries.push(initial);
    }
  }

  const filteredEntries = removeTesteEntry(migratedEntries);

  return filteredEntries;
}

function mergeVersions(initialVersions: PlaybookVersion[], userVersions: PlaybookVersion[]): PlaybookVersion[] {
  const versionMap = new Map<number, PlaybookVersion>();
  
  for (const v of initialVersions) {
    versionMap.set(v.version, v);
  }
  
  for (const v of userVersions) {
    if (!versionMap.has(v.version)) {
      versionMap.set(v.version, v);
    }
  }
  
  return Array.from(versionMap.values()).sort((a, b) => b.version - a.version);
}

function removeTesteEntry(entries: PlaybookEntry[]): PlaybookEntry[] {
  return entries.filter(entry => entry.title.toLowerCase().trim() !== 'teste');
}

export async function deleteEntryByTitle(title: string): Promise<boolean> {
  try {
    const entries = await loadPlaybook();
    const filtered = entries.filter(entry => entry.title.toLowerCase().trim() !== title.toLowerCase().trim());
    
    if (filtered.length === entries.length) {
      return false;
    }
    
    await savePlaybook(filtered);
    return true;
  } catch {
    return false;
  }
}

export async function deleteTesteEntry(): Promise<boolean> {
  return deleteEntryByTitle('Teste');
}

export async function loadPlaybook(): Promise<PlaybookEntry[]> {
  let stored: string | null;
  try {
    stored = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (e) {
    throw new PlaybookStorageError('Falha ao acessar o armazenamento.', 'UNKNOWN', e as Error);
  }

  if (stored === null) {
    const initial = await getInitialEntries();
    try {
      await savePlaybook(initial);
    } catch (e) {
      throw new PlaybookStorageError('Falha ao inicializar o playbook.', 'WRITE_ERROR', e as Error);
    }
    return initial;
  }

  let parsed: StoredPlaybook;
  try {
    parsed = JSON.parse(stored);
  } catch (e) {
    throw new PlaybookStorageError('Dados corrompidos no armazenamento.', 'PARSE_ERROR', e as Error);
  }

  if (parsed.schemaVersion !== SCHEMA_VERSION) {
    throw new PlaybookStorageError(`Versão de esquema incompatível: esperado ${SCHEMA_VERSION}, encontrado ${parsed.schemaVersion}.`, 'SCHEMA_MISMATCH');
  }

  if (!Array.isArray(parsed.entries)) {
    throw new PlaybookStorageError('Estrutura inválida: "entries" não é um array.', 'INVALID_STRUCTURE');
  }

  for (const entry of parsed.entries) {
    if (!validateEntry(entry)) {
      throw new PlaybookStorageError('Conteúdo inválido: entrada ou versão com campos ausentes ou inválidos.', 'INVALID_CONTENT');
    }
  }

  const migrated = await migrateDataIfNeeded(parsed);

  if (parsed.dataVersion !== DATA_VERSION || JSON.stringify(migrated) !== JSON.stringify(parsed.entries)) {
    try {
      await savePlaybook(migrated);
    } catch (e) {
      throw new PlaybookStorageError('Falha ao atualizar dados do playbook.', 'WRITE_ERROR', e as Error);
    }
  }

  return migrated;
}

export async function savePlaybook(entries: PlaybookEntry[]): Promise<void> {
  const payload: StoredPlaybook = {
    schemaVersion: SCHEMA_VERSION,
    dataVersion: DATA_VERSION,
    entries,
    updatedAt: new Date().toISOString(),
  };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    throw new PlaybookStorageError('Falha ao gravar no armazenamento.', 'WRITE_ERROR', e as Error);
  }
}

export async function createEntry(
  title: string,
  category: Category,
  content: string,
  summary: string,
  profile: 'Voluntário' | 'Coordenação',
  personName?: string
): Promise<PlaybookEntry> {
  const entries = await loadPlaybook();
  const now = new Date();
  const newEntry: PlaybookEntry = {
    id: generateId(),
    title,
    category,
    versions: [
      {
        version: 1,
        author: getDemoAuthor(profile, personName),
        date: formatDateForStorage(now),
        summary,
        title,
        category,
        content,
      },
    ],
  };
  const updated = [...entries, newEntry];
  await savePlaybook(updated);
  return newEntry;
}

export async function updateEntry(
  id: string,
  title: string,
  category: Category,
  content: string,
  summary: string,
  profile: 'Voluntário' | 'Coordenação',
  personName?: string
): Promise<PlaybookEntry | null> {
  const entries = await loadPlaybook();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const entry = entries[index];
  const currentVersion = entry.versions[0];
  const hasChanges =
    currentVersion.title !== title ||
    currentVersion.category !== category ||
    currentVersion.content !== content;

  if (!hasChanges) return entry;

  const now = new Date();
  const newVersion: PlaybookVersion = {
    version: currentVersion.version + 1,
    author: getDemoAuthor(profile, personName),
    date: formatDateForStorage(now),
    summary,
    title,
    category,
    content,
  };

  const updatedEntry: PlaybookEntry = {
    ...entry,
    title,
    category,
    versions: [newVersion, ...entry.versions],
  };

  const updatedEntries = [...entries];
  updatedEntries[index] = updatedEntry;
  await savePlaybook(updatedEntries);
  return updatedEntry;
}

export async function findEntry(id: string | undefined): Promise<PlaybookEntry | undefined> {
  if (!id) return undefined;
  const entries = await loadPlaybook();
  return entries.find((e) => e.id === id);
}

export async function getAllEntries(): Promise<PlaybookEntry[]> {
  return loadPlaybook();
}