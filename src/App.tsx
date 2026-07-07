import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { KnowledgeHub } from './pages/KnowledgeHub';
import { AdminPanel } from './pages/AdminPanel';
import { CookiePolicy } from './pages/CookiePolicy';
import { LegalCalculatorPage } from './pages/LegalCalculatorPage';
import { KvkkDisclosure } from './pages/KvkkDisclosure';
import { ExplicitConsent } from './pages/ExplicitConsent';
import { TermsOfUse } from './pages/TermsOfUse';
import { Disclaimer } from './pages/Disclaimer';
import { ContentDetailPage } from './pages/ContentDetailPage';
import { ToastContainer } from './components/layout/ToastContainer';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  // If we are on the admin page, render it standalone without the client header/footer
  if (currentRoute === 'admin') {
    return <AdminPanel />;
  }

  return (
    <Layout>
      {currentRoute === 'home' && <Home />}
      {currentRoute === 'knowledge-hub' && <KnowledgeHub />}
      {currentRoute === 'content-detail' && <ContentDetailPage />}
      {currentRoute === 'cerez-politikasi' && <CookiePolicy />}
      {currentRoute === 'hukuki-hesaplama-araclari' && <LegalCalculatorPage />}
      {currentRoute === 'kvkk-aydinlatma-metni' && <KvkkDisclosure />}
      {currentRoute === 'acik-riza-metni' && <ExplicitConsent />}
      {currentRoute === 'kullanim-kosullari' && <TermsOfUse />}
      {currentRoute === 'sorumluluk-reddi-beyani' && <Disclaimer />}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
