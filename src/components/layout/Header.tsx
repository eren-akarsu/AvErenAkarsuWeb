import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Menu, X, ChevronDown, BookOpen, Clock, Eye, Scale } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, language, toggleLanguage, currentRoute, navigateTo, blogPosts, t, setSelectedCategory } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scrollspy active section mapping
      if (currentRoute === 'home') {
        const sections = [
          { id: 'hero', name: 'home' },
          { id: 'about', name: 'about' },
          { id: 'education', name: 'about' },
          { id: 'stats', name: 'about' },
          { id: 'practice', name: 'practice' },
          { id: 'recent-posts', name: 'blog' },
          { id: 'legal-decisions', name: 'blog' },
          { id: 'payment', name: 'contact' },
          { id: 'contact', name: 'contact' },
          { id: 'appointment', name: 'appointment' }
        ];

        const viewportMiddle = window.innerHeight / 2;
        let currentActive = 'home';

        for (const section of sections) {
          const el = document.getElementById(section.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
              currentActive = section.name;
              break;
            }
          }
        }

        if (window.scrollY < 100) {
          currentActive = 'home';
        }

        setActiveSection(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  const handleNavClick = (route: 'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari') => {
    navigateTo(route);
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  };

  const handleAnchorClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    handleNavClick('home');

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const headerElement = document.querySelector('header');
        const headerHeight = headerElement ? headerElement.offsetHeight : 64;
        
        const viewportHeight = window.innerHeight;
        const remainingHeight = viewportHeight - headerHeight;
        
        const rect = element.getBoundingClientRect();
        const sectionHeight = rect.height;
        const absoluteElementTop = rect.top + window.scrollY;
        
        // Symmetrically center the section in the visible viewport area below header
        const scrollOffset = Math.max(0, (remainingHeight - sectionHeight) / 2);
        const targetScrollTop = absoluteElementTop - headerHeight - scrollOffset;
        
        window.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const recentPosts = blogPosts.slice(0, 4);

  return (
    <>
    <header
      style={{
        position: 'fixed',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        
        // Dynamic scroll states centered symmetrically without translateX
        top: isScrolled ? '20px' : '0',
        left: '0',
        right: '0',
        margin: '0 auto',
        width: isScrolled ? '95%' : '100%',
        maxWidth: isScrolled ? '1440px' : '100%',
        transform: 'none',
        borderRadius: isScrolled ? '50px' : '0',
        height: isScrolled ? '64px' : '90px',
        padding: isScrolled ? '0 32px' : '0 40px',
        border: isScrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        borderBottom: isScrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        background: isScrolled 
          ? (theme === 'dark' ? 'rgba(28, 35, 64, 0.7)' : 'rgba(250, 246, 240, 0.7)')
          : 'transparent',
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.25)' : 'none',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
      }}
    >
      {/* Brand Logo */}
      <div 
        onClick={() => handleNavClick('home')} 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <img
          src="/ea-monogram.png"
          alt="EA Monogram"
          style={{
            height: isScrolled ? '32px' : '42px',
            width: 'auto',
            objectFit: 'contain',
            transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
            {t('brand.title')}
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="desktop-only">
        <span
          onClick={() => handleNavClick('home')}
          className={`nav-link ${currentRoute === 'home' && activeSection === 'home' ? 'active' : ''}`}
        >
          {t('nav.home')}
        </span>
        <a
          href="#about"
          onClick={(e) => handleAnchorClick(e, 'about')}
          className={`nav-link ${currentRoute === 'home' && activeSection === 'about' ? 'active' : ''}`}
        >
          {t('nav.about')}
        </a>
        <a
          href="#practice"
          onClick={(e) => handleAnchorClick(e, 'practice')}
          className={`nav-link ${currentRoute === 'home' && activeSection === 'practice' ? 'active' : ''}`}
        >
          {t('nav.practice')}
        </a>

        {/* Mega Menu Trigger */}
        <div
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
          style={{ 
            position: 'relative', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center',
            padding: '0 10px'
          }}
        >
          <span
            onClick={() => handleNavClick('knowledge-hub')}
            className={`nav-link ${currentRoute === 'knowledge-hub' || (currentRoute === 'home' && activeSection === 'blog') ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {t('nav.blog')} <ChevronDown size={14} style={{ transform: isMegaMenuOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition-fast)' }} />
          </span>

          {/* Mega Menu Panel */}
          {isMegaMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '900px',
                paddingTop: '15px',
                zIndex: 999,
                cursor: 'default'
              }}
            >
              <div
                className="glass-panel"
                style={{
                  borderRadius: '16px',
                  padding: '30px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.5fr',
                  gap: '30px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                  animation: 'fadeIn 0.2s ease',
                  border: '1px solid var(--border-color)',
                  background: theme === 'dark' ? 'rgba(10, 13, 24, 0.98)' : 'rgba(250, 246, 240, 0.98)',
                  backdropFilter: 'blur(24px)'
                }}
              >
                {/* Left Column: Categories list */}
                <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '24px' }}>
                  <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', marginBottom: '16px', fontFamily: 'Outfit' }}>
                    {language === 'en' ? 'Categories' : 'Kategoriler'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { 
                        title: language === 'en' ? 'Petition and Document Templates' : 'Dilekçe ve Doküman Örnekleri',
                        categoryKey: 'Dilekçeler'
                      },
                      { 
                        title: language === 'en' ? 'Articles' : 'Makaleler',
                        categoryKey: 'Makaleler'
                      },
                      { 
                        title: language === 'en' ? 'Legal Evaluations' : 'Hukuki Değerlendirmeler',
                        categoryKey: 'Değerlendirmeler',
                        subCategories: [
                          { 
                            title: language === 'en' ? 'Court Decisions' : 'Yargı Kararları',
                            categoryKey: 'Kararlar'
                          },
                          { 
                            title: language === 'en' ? 'Law and Precedent Analyses' : 'Kanun ve İçtihat Analizleri',
                            categoryKey: 'Analizler'
                          }
                        ]
                      },
                      { 
                        title: language === 'en' ? 'Practice Notes' : 'Meslekten Notlar',
                        categoryKey: 'Notlar'
                      },
                      { 
                        title: language === 'en' ? 'Legal Calculation Tools' : 'Hukuki Hesaplama Araçları',
                        route: 'hukuki-hesaplama-araclari'
                      }
                    ].map((item: any, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span
                          onClick={() => {
                            if (item.categoryKey) {
                              setSelectedCategory(item.categoryKey);
                            }
                            item.route ? handleNavClick(item.route) : handleNavClick('knowledge-hub');
                          }}
                          style={{ 
                            fontSize: '13px', 
                            color: 'var(--text-primary)', 
                            cursor: 'pointer', 
                            transition: 'var(--transition-fast)',
                            fontWeight: item.subCategories ? 600 : 400
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-burgundy)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                        >
                          {item.title}
                        </span>
                        {item.subCategories && item.subCategories.map((sub: any, subIdx: number) => (
                          <span
                            key={subIdx}
                            onClick={() => {
                              if (sub.categoryKey) {
                                setSelectedCategory(sub.categoryKey);
                              }
                              handleNavClick('knowledge-hub');
                            }}
                            style={{ 
                              fontSize: '12px', 
                              color: 'var(--text-secondary)', 
                              cursor: 'pointer', 
                              paddingLeft: '16px',
                              display: 'block', 
                              transition: 'var(--transition-fast)' 
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-burgundy)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                          >
                            ↳ {sub.title}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Dynamic latest articles from context */}
                <div>
                  <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 600, fontFamily: 'Outfit' }}>
                    {language === 'en' ? 'Recent Legal Content' : 'Son Eklenen İçerikler'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {recentPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => {
                          navigateTo('knowledge-hub');
                          setIsMegaMenuOpen(false);
                        }}
                        style={{ display: 'flex', gap: '12px', cursor: 'pointer', transition: 'var(--transition-fast)' }}
                      >
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          style={{ width: '60px', height: '45px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.2' }}>
                            {post.title}
                          </span>
                          <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.readingTime} {language === 'en' ? 'Read' : 'Okuma'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <a
          href="#contact"
          onClick={(e) => handleAnchorClick(e, 'contact')}
          className={`nav-link ${currentRoute === 'home' && activeSection === 'contact' ? 'active' : ''}`}
        >
          {t('nav.contact')}
        </a>
        <a
          href="#appointment"
          onClick={(e) => handleAnchorClick(e, 'appointment')}
          className={`nav-link ${currentRoute === 'home' && activeSection === 'appointment' ? 'active' : ''}`}
        >
          {t('nav.appointment')}
        </a>

        {/* Secure Admin Gate Link */}
        <span
          onClick={() => handleNavClick('admin')}
          style={{
            cursor: 'pointer',
            fontSize: '13px',
            background: 'rgba(80, 34, 60, 0.1)',
            padding: '6px 12px',
            borderRadius: '20px',
            color: 'var(--color-burgundy)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 500
          }}
        >
          <Lock size={12} /> {t('nav.admin')}
        </span>
      </nav>

      {/* Right Controls: TR/EN and Dark/Light Mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-only">
        {/* Language selector pill */}
        <div
          onClick={toggleLanguage}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'var(--input-bg)',
            userSelect: 'none',
            gap: '6px'
          }}
        >
          <span style={{ color: language === 'tr' ? 'var(--color-burgundy)' : 'var(--text-secondary)' }}>TR</span>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <span style={{ color: language === 'en' ? 'var(--color-burgundy)' : 'var(--text-secondary)' }}>EN</span>
        </div>

        {/* Theme mode toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Mobile Burger Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          zIndex: 1001
        }}
        className="mobile-burger"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Slide-in Drawer */}
    </header>

      {/* Mobile Slide-in Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 99998,
              animation: 'fadeIn 0.2s ease'
            }}
          />
          <div
            className="glass-panel"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              height: '100dvh',
              width: '290px',
              padding: '80px 24px 30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              zIndex: 99999,
              animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              background: theme === 'dark' ? 'rgba(10, 13, 24, 0.98)' : 'rgba(245, 238, 230, 0.98)',
              borderLeft: '1px solid var(--border-color)',
              overflowY: 'auto'
            }}
          >
            {/* Menu Title / Header inside drawer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              <img src="/ea-monogram.png" alt="EA Logo" style={{ height: '30px', width: 'auto' }} />
              <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                {t('brand.title')}
              </span>
            </div>

            {/* Links navigation list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'home', label: t('nav.home'), onClick: () => { handleNavClick('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                { id: 'about', label: t('nav.about'), onClick: (e: any) => handleAnchorClick(e, 'about') },
                { id: 'practice', label: t('nav.practice'), onClick: (e: any) => handleAnchorClick(e, 'practice') },
              ].map((link: any, idx) => {
                const isLinkActive = currentRoute === 'home' && activeSection === link.id;
                return link.href ? (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontSize: '16px',
                      fontWeight: isLinkActive ? 700 : 500,
                      color: isLinkActive ? 'var(--color-burgundy)' : 'var(--text-primary)',
                      padding: '8px 0',
                      borderLeft: isLinkActive ? '3px solid var(--color-burgundy)' : 'none',
                      paddingLeft: isLinkActive ? '10px' : '0',
                      display: 'block'
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <span
                    key={idx}
                    onClick={link.onClick}
                    style={{
                      fontSize: '16px',
                      fontWeight: isLinkActive ? 700 : 500,
                      color: isLinkActive ? 'var(--color-burgundy)' : 'var(--text-primary)',
                      padding: '8px 0',
                      borderLeft: isLinkActive ? '3px solid var(--color-burgundy)' : 'none',
                      paddingLeft: isLinkActive ? '10px' : '0',
                      display: 'block',
                      cursor: 'pointer'
                    }}
                  >
                    {link.label}
                  </span>
                );
              })}

              {/* Accordion Menu Trigger for Hukuki İçerikler */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
                  style={{
                    fontSize: '16px',
                    fontWeight: currentRoute === 'knowledge-hub' ? 700 : 500,
                    color: currentRoute === 'knowledge-hub' ? 'var(--color-burgundy)' : 'var(--text-primary)',
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span>{t('nav.blog')}</span>
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      transform: isMobileAccordionOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.2s ease',
                      color: 'var(--text-secondary)'
                    }} 
                  />
                </div>

                {/* Accordion content list */}
                {isMobileAccordionOpen && (
                  <div 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px', 
                      paddingLeft: '14px', 
                      borderLeft: '1.5px solid var(--border-color)', 
                      marginTop: '4px',
                      animation: 'fadeIn 0.2s ease'
                    }}
                  >
                    {[
                      { title: language === 'en' ? 'Petition Templates' : 'Dilekçe ve Doküman Örnekleri', categoryKey: 'Dilekçeler' },
                      { title: language === 'en' ? 'Articles' : 'Makaleler', categoryKey: 'Makaleler' },
                      { title: language === 'en' ? 'Court Decisions' : 'Yargı Kararları', categoryKey: 'Kararlar' },
                      { title: language === 'en' ? 'Law & Precedent Analyses' : 'Kanun ve İçtihat Analizleri', categoryKey: 'Analizler' },
                      { title: language === 'en' ? 'Practice Notes' : 'Meslekten Notlar', categoryKey: 'Notlar' },
                      { title: language === 'en' ? 'Calculation Tools' : 'Hukuki Hesaplama Araçları', route: 'hukuki-hesaplama-araclari' }
                    ].map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        onClick={() => {
                          if (sub.categoryKey) {
                            setSelectedCategory(sub.categoryKey);
                          }
                          sub.route ? handleNavClick(sub.route as any) : handleNavClick('knowledge-hub');
                        }}
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '4px 0',
                          display: 'block'
                        }}
                      >
                        ↳ {sub.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rest of standard links */}
              {[
                { id: 'contact', label: t('nav.contact'), onClick: (e: any) => handleAnchorClick(e, 'contact') },
                { id: 'appointment', label: t('nav.appointment'), onClick: (e: any) => handleAnchorClick(e, 'appointment') }
              ].map((link: any, idx) => {
                const isLinkActive = currentRoute === 'home' && activeSection === link.id;
                return link.href ? (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontSize: '16px',
                      fontWeight: isLinkActive ? 700 : 500,
                      color: isLinkActive ? 'var(--color-burgundy)' : 'var(--text-primary)',
                      padding: '8px 0',
                      borderLeft: isLinkActive ? '3px solid var(--color-burgundy)' : 'none',
                      paddingLeft: isLinkActive ? '10px' : '0',
                      display: 'block'
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <span
                    key={idx}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (link.onClick) link.onClick(e);
                    }}
                    style={{
                      fontSize: '16px',
                      fontWeight: isLinkActive ? 700 : 500,
                      color: isLinkActive ? 'var(--color-burgundy)' : 'var(--text-primary)',
                      padding: '8px 0',
                      borderLeft: isLinkActive ? '3px solid var(--color-burgundy)' : 'none',
                      paddingLeft: isLinkActive ? '10px' : '0',
                      display: 'block',
                      cursor: 'pointer'
                    }}
                  >
                    {link.label}
                  </span>
                );
              })}
            </div>
            
            {/* Admin panel redirect gate */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px' }}>
              <span 
                onClick={() => handleNavClick('admin')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-burgundy)', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}
              >
                <Lock size={15} /> {t('nav.admin')}
              </span>
            </div>

            {/* Theme & Language controls matching desktop design */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              {/* Language Switcher Pill */}
              <div
                onClick={toggleLanguage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: 'var(--input-bg)',
                  userSelect: 'none',
                  gap: '8px',
                  flex: 1
                }}
              >
                <span style={{ color: language === 'tr' ? 'var(--color-burgundy)' : 'var(--text-secondary)' }}>TR</span>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <span style={{ color: language === 'en' ? 'var(--color-burgundy)' : 'var(--text-secondary)' }}>EN</span>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  flexShrink: 0
                }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Styled JSX for Responsive Header Styles & keyframes */}
      <style>{`
        @media (max-width: 1023px) {
          .desktop-only { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

// Extra icon lock
const Lock: React.FC<{ size: number }> = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
