import { AppTabs } from '@/components/AppTabs';
export default function PublicTabs() {
  return <AppTabs tabs={[
    { name: 'index', title: 'Início', icon: 'home-outline' },
    { name: 'projects', title: 'Projetos', icon: 'folder-outline' },
    { name: 'donations', title: 'Apoiar', icon: 'heart-outline' },
    { name: 'about', title: 'Sobre', icon: 'information-circle-outline' },
  ]} />;
}
