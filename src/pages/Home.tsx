import React from 'react';
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
  return (
    <>
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
