export const categories = ['Integração', 'Procedimentos de campo', 'Organização das ações', 'Encerramento e aprendizados'] as const;
export type Category = typeof categories[number];
export type PlaybookVersion = { version: number; author: string; date: string; summary: string; title: string; category: Category; content: string };
export type PlaybookEntry = { id: string; title: string; category: Category; versions: PlaybookVersion[] };

export function formatDemoDate(iso: string): string {
  return iso.split('-').reverse().join('/');
}