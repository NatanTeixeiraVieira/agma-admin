import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { logout } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Icon, IconName } from '../icon';
import { Link } from '../link';

const MENU_ITEMS = [
  { title: 'Portal da Transparência', url: '/transparencia', icon: 'FileText' },
  {
    title: 'Tipos de Transparência',
    url: '/tipos-transparencia',
    icon: 'Tag',
  },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div
          className={cn(
            'py-4 flex items-center gap-2 p-4',
            collapsed && 'justify-center',
          )}
        >
          <Icon name="FileText" className="w-6 h-6 shrink-0" />
          {!collapsed && (
            <span className="font-bold text-sm leading-tight">
              Painel Admin
            </span>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.map((item) => (
                <Link
                  to={item.url}
                  end
                  className="hover:bg-sidebar-accent/50"
                  activeClassName="bg-sidebar-accent text-sidebar-primary-foreground font-medium"
                >
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <Icon name={item.icon as IconName} />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const {
    state: { auth },
    actions,
  } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      actions.logout();
      navigate('/login');
    },
    onError: () => {
      toast.error('Houve um erro ao sair.');
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
  }, [auth, navigate]);

  if (!auth) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-sm font-semibold text-foreground">
                Painel Administrativo
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
            >
              <Icon name="LogOut" className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </header>
          <main className="flex-1 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
