export type PersonRole = 'integrante' | 'professora';

export type Person = {
  id: string;
  displayName: string;
  academicId: string;
  role: PersonRole;
  firstName: string;
};

export type AccessProfile = 'Coordenação' | 'Voluntário';

export type Credential = {
  personId: string;
  login: string;
  profile: AccessProfile;
};

export const people: Person[] = [
  { id: 'p1', displayName: 'Filipe Angi', academicId: 'Integrante do grupo', role: 'integrante', firstName: 'Filipe' },
  { id: 'p2', displayName: 'João Tamosaitis', academicId: 'Integrante do grupo', role: 'integrante', firstName: 'João' },
  { id: 'p3', displayName: 'André Luis', academicId: 'Integrante do grupo', role: 'integrante', firstName: 'André' },
  { id: 'p4', displayName: 'Giovana Carvalho', academicId: 'Integrante do grupo', role: 'integrante', firstName: 'Giovana' },
  { id: 'p5', displayName: 'Isabela Patino', academicId: 'Integrante do grupo', role: 'integrante', firstName: 'Isabela' },
  { id: 'p6', displayName: 'Lucas Blanes', academicId: 'Integrante do grupo', role: 'integrante', firstName: 'Lucas' },
  { id: 'p7', displayName: 'Matheus Peruzza', academicId: 'Integrante do grupo', role: 'integrante', firstName: 'Matheus' },
  { id: 'p8', displayName: 'Betania', academicId: 'Professora Betania', role: 'professora', firstName: 'Betania' },
];

export const credentials: Credential[] = [
  { personId: 'p1', login: 'Filipe', profile: 'Coordenação' },
  { personId: 'p1', login: 'v-Filipe', profile: 'Voluntário' },
  { personId: 'p2', login: 'João', profile: 'Coordenação' },
  { personId: 'p2', login: 'v-João', profile: 'Voluntário' },
  { personId: 'p3', login: 'André', profile: 'Coordenação' },
  { personId: 'p3', login: 'v-André', profile: 'Voluntário' },
  { personId: 'p4', login: 'Giovana', profile: 'Coordenação' },
  { personId: 'p4', login: 'v-Giovana', profile: 'Voluntário' },
  { personId: 'p5', login: 'Isabela', profile: 'Coordenação' },
  { personId: 'p5', login: 'v-Isabela', profile: 'Voluntário' },
  { personId: 'p6', login: 'Lucas', profile: 'Coordenação' },
  { personId: 'p6', login: 'v-Lucas', profile: 'Voluntário' },
  { personId: 'p7', login: 'Matheus', profile: 'Coordenação' },
  { personId: 'p7', login: 'v-Matheus', profile: 'Voluntário' },
  { personId: 'p8', login: 'Betania', profile: 'Coordenação' },
  { personId: 'p8', login: 'v-Betania', profile: 'Voluntário' },
];

const DEMO_PASSWORD = '0000';

export function normalizeLogin(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

export function findCredential(login: string, password: string): Credential | null {
  if (password !== DEMO_PASSWORD) return null;
  const normalized = normalizeLogin(login);
  return credentials.find(c => normalizeLogin(c.login) === normalized) ?? null;
}

export function getDemoPassword(): string {
  return DEMO_PASSWORD;
}

export function getPersonById(personId: string): Person | undefined {
  return people.find(p => p.id === personId);
}

export function getCredentialsByPersonId(personId: string): Credential[] {
  return credentials.filter(c => c.personId === personId);
}

export function getDisplayName(personId: string): string {
  const person = getPersonById(personId);
  return person?.displayName ?? 'Desconhecido';
}

export function getAllPeople(): Person[] {
  return [...people];
}

export function getAllCredentials(): Credential[] {
  return [...credentials];
}

export function getTeamMembers(): Person[] {
  return people.filter(p => p.role === 'integrante');
}

export function getProfessor(): Person | undefined {
  return people.find(p => p.role === 'professora');
}