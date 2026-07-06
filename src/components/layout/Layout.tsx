import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingActions } from './FloatingActions';
import { CookieConsent } from './CookieConsent';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="main-wrapper">
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <FloatingActions />
      <CookieConsent />
    </div>
  );
};
