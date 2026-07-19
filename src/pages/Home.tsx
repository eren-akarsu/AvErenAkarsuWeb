import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { buildWebSiteSchema, buildPersonSchema, combineSchemas } from '../utils/schema';
import { getCanonicalUrl } from '../utils/seo';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Education } from '../components/sections/Education';
import { Stats } from '../components/sections/Stats';
import { Services } from '../components/sections/Services';
import { RecentPosts } from '../components/sections/RecentPosts';
import { LegalDecisions } from '../components/sections/LegalDecisions';
import { PaymentSystem } from '../components/sections/PaymentSystem';
import { ContactForm } from '../components/sections/ContactForm';
import { AppointmentSystem } from '../components/sections/AppointmentSystem';
import { NewsletterSection } from '../components/sections/NewsletterSection';

export const Home: React.FC = () => {
  const homeSchema = combineSchemas(buildWebSiteSchema(), buildPersonSchema());

  return (
    <>
      <SEOHead
        title="Av. Eren Akarsu | Hukuki Bilgilendirme ve LegalTech Platformu"
        description="Bilişim hukuku, ceza hukuku, iş hukuku ve aile hukuku alanlarında genel bilgilendirme içerikleri. Av. Eren Akarsu, İstanbul Barosu üyesi."
        canonical="/"
        ogType="website"
        jsonLd={homeSchema}
      />
      <Hero />
      <About />
      <Education />
      <Stats />
      <Services />
      <RecentPosts />
      <LegalDecisions />
      <PaymentSystem />
      <ContactForm />
      <AppointmentSystem />
      <NewsletterSection />
    </>
  );
};
export default Home;
