'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { PageTransition } from '@/components/PageTransition';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('aside') && !target.closest('button[aria-label*="menu"]')) {
          setIsMobileMenuOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen, isMobile]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skip to content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? isMobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        } transition-transform duration-300 ease-in-out ${
          isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'
        }`}
      >
        <Sidebar
          isCollapsed={isMobile ? false : isSidebarCollapsed}
          onToggle={handleToggleSidebar}
          isMobile={isMobile}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={handleToggleSidebar}
          isMobile={isMobile}
        />
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6 lg:p-8"
          role="main"
          aria-label="Main content"
        >
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* Offline indicator */}
      <OfflineIndicator />
    </div>
  );
}
