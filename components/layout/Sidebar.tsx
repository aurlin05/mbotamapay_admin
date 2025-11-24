'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: ArrowLeftRight,
  },
];

export function Sidebar({ isCollapsed, onToggle, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        isMobile && 'fixed inset-y-0 left-0 z-50 shadow-lg'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold" id="sidebar-title">MbotamaPay</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('ml-auto', isCollapsed && 'mx-auto')}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-navigation"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav 
        id="sidebar-navigation"
        className="flex-1 space-y-1 p-2" 
        aria-labelledby="sidebar-title"
      >
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
                isCollapsed && 'justify-center'
              )}
              aria-label={item.title}
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer - User Profile Section */}
      <div className="border-t p-4" role="contentinfo" aria-label="User information">
        <div
          className={cn(
            'flex items-center gap-3',
            isCollapsed && 'justify-center'
          )}
        >
          <div 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-label="Admin avatar"
          >
            <span className="text-sm font-medium" aria-hidden="true">A</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">Admin</p>
              <p className="truncate text-xs text-muted-foreground">
                admin@mbotamapay.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
