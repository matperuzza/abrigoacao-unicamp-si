import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories, formatDemoDate } from '@/features/playbook/data';

export type Category = typeof categories[number];
export type PlaybookVersion = { version: number; author: string; date: string; summary: string; title: string; category: Category; content: string };
export type PlaybookEntry = { id: string; title: string; category: Category; versions: PlaybookVersion[] };

const STORAGE_KEY = 'abrigoacao.playbook.v1';
const SCHEMA_VERSION = 1;

type StoredPlaybook = {
  schemaVersion: number;
  entries: PlaybookEntry[];
  updatedAt: string;
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDateForStorage(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDemoAuthor(profile: 'Voluntário' | 'Coordenação'): string {
  return `${profile} (demo)`;
}

async function getInitialEntries(): Promise<PlaybookEntry[]> {
  const welcome = 'Guia inicial com missões, valores e primeiros passos.\n\n1. Conheça a missão da AbrigoAção.\n2. Participe do encontro de integração.\n3. Acesse o Playbook para procedimentos.\n4. Registre suas atividades semanalmente.';
  const closing = 'Passos para entrega, termo de recebimento e lições aprendidas.\n\n1. Vistoria final.\n2. Assinatura do termo.\n3. Registro de aprendizados.';

  return [
    {
      id: '1',
      title: 'Boas-vindas ao voluntário',
      category: 'Integração',
      versions: [
        {
          version: 2,
          author: 'Ana Costa (demo)',
          date: '2024-06-10',
          summary: 'Atualização de passos de integração.',
          title: 'Boas-vindas ao voluntário',
          category: 'Integração',
          content: welcome,
        },
        {
          version: 1,
          author: 'Ana Costa (demo)',
          date: '2024-05-01',
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
          version: 1,
          author: 'Pedro Lima (demo)',
          date: '2024-05-22',
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
          version: 3,
          author: 'Carla Mendes (demo)',
          date: '2024-04-30',
          summary: 'Inclusão de lições aprendidas.',
          title: 'Encerramento de projeto',
          category: 'Encerramento e aprendizados',
          content: closing,
        },
        {
          version: 2,
          author: 'Carla Mendes (demo)',
          date: '2024-04-10',
          summary: 'Ajuste no termo de recebimento.',
          title: 'Encerramento de projeto',
          category: 'Encerramento e aprendizados',
          content: 'Passos para entrega, termo de recebimento e lições aprendidas.',
        },
        {
          version: 1,
          author: 'Carla Mendes (demo)',
          date: '2024-03-20',
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
          version: 1,
          author: 'Lucas Rocha (demo)',
          date: '2024-07-01',
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
          version: 1,
          author: 'Fernanda Dias (demo)',
          date: '2024-06-15',
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
          version: 2,
          author: 'Roberto Alves (demo)',
          date: '2024-03-18',
          summary: 'Revisão dos procedimentos de emergência (exemplo).',
          title: 'Segurança no canteiro',
          category: 'Procedimentos de campo',
          content: 'EPIs obrigatórios, sinalização e procedimentos de emergência.',
        },
      ],
    },
  ];
}

export async function loadPlaybook(): Promise<PlaybookEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = await getInitialEntries();
      await savePlaybook(initial);
      return initial;
    }
    const parsed: StoredPlaybook = JSON.parse(stored);
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      const initial = await getInitialEntries();
      await savePlaybook(initial);
      return initial;
    }
    if (!Array.isArray(parsed.entries)) {
      const initial = await getInitialEntries();
      await savePlaybook(initial);
      return initial;
    }
    return parsed.entries;
  } catch {
    return getInitialEntries();
  }
}

export async function savePlaybook(entries: PlaybookEntry[]): Promise<void> {
  const payload: StoredPlaybook = {
    schemaVersion: SCHEMA_VERSION,
    entries,
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function createEntry(
  title: string,
  category: Category,
  content: string,
  summary: string,
  profile: 'Voluntário' | 'Coordenação'
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
        author: getDemoAuthor(profile),
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
  profile: 'Voluntário' | 'Coordenação'
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
    author: getDemoAuthor(profile),
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

export { categories, formatDemoDate };