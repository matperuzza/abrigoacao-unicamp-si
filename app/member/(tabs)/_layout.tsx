import { AppTabs } from '@/components/AppTabs';
export default function MemberTabs() {
  return <AppTabs tabs={[
    { name: 'overview', title: 'Visão geral', icon: 'grid-outline' },
    { name: 'playbook', title: 'Playbook', icon: 'book-outline' },
    { name: 'projects', title: 'Projetos', icon: 'folder-outline' },
    { name: 'guide', title: 'Guia', icon: 'compass-outline' },
  ]} />;
}
