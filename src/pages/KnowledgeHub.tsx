import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { BlogPost } from '../context/AppContext';
import { Search, Scale, FileText, ArrowRight, Eye, ThumbsUp, Printer, MessageSquare, Download, Share2, ZoomIn, ZoomOut, ChevronDown } from 'lucide-react';

export const KnowledgeHub: React.FC = () => {
  const { blogPosts, precedentDecisions, t, language, theme, navigateTo, showToast, selectedCategory, setSelectedCategory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Hepsi');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'likes'>('newest');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Sync selectedCategory from context if set by other components
  React.useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
      setSelectedCategory(null);
    }
  }, [selectedCategory, setSelectedCategory]);
  
  const isEn = language === 'en';

  // Map precedent decisions to BlogPost structure dynamically
  const mappedDecisionsAsPosts: BlogPost[] = precedentDecisions
    .filter(dec => dec.status === 'Yayında' && dec.showOnLegalDocs)
    .map(dec => ({
      id: dec.id,
      title: dec.title || `${dec.court} - ${dec.esas}/${dec.karar}`,
      slug: dec.id,
      excerpt: dec.summary,
      content: `${isEn ? 'COURT' : 'MAHKEME'}: ${dec.court}\n${isEn ? 'MERIT / DECISION' : 'ESAS / KARAR'}: ${dec.esas} - ${dec.karar}\n\n${dec.fullText}`,
      coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      category: 'Kararlar', // Matches "Yargı Kararları" subcategory key
      readingTime: isEn ? 'Precedent' : 'Emsal Karar',
      viewCount: 0,
      likeCount: 0,
      publishedAt: dec.decisionDate,
      tags: dec.tags
    }));

  const allPosts = [...blogPosts, ...mappedDecisionsAsPosts];

  // Adjust Hepsi category selection fallback when language changes
  React.useEffect(() => {
    setActiveCategory(isEn ? 'All' : 'Hepsi');
  }, [language]);

  // Font scaling for readability
  const [fontSize, setFontSize] = useState(15);

  // Social sharing mockup
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Hierarchical categories structure
  const categoriesList = [
    { key: 'Hepsi', title: isEn ? 'All' : 'Hepsi' },
    { key: 'Dilekçeler', title: isEn ? 'Petition and Document Templates' : 'Dilekçe ve Doküman Örnekleri' },
    { key: 'Makaleler', title: isEn ? 'Articles' : 'Makaleler' },
    { 
      key: 'Değerlendirmeler', 
      title: isEn ? 'Legal Evaluations' : 'Hukuki Değerlendirmeler',
      subCategories: [
        { key: 'Kararlar', title: isEn ? 'Court Decisions' : 'Yargı Kararları' },
        { key: 'Analizler', title: isEn ? 'Law and Precedent Analyses' : 'Kanun ve İçtihat Analizleri' }
      ]
    },
    { key: 'Notlar', title: isEn ? 'Practice Notes' : 'Meslekten Notlar' },
    { key: 'hukuki-hesaplama-araclari', title: isEn ? 'Legal Calculation Tools' : 'Hukuki Hesaplama Araçları', route: 'hukuki-hesaplama-araclari' }
  ];

  // Filtering logs
  const filteredPosts = allPosts
    .filter(post => {
      const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchCategory = 
        activeCategory === 'Hepsi' || 
        activeCategory === 'All' || 
        post.category === activeCategory ||
        (activeCategory === 'Değerlendirmeler' && 
         (post.category === 'Değerlendirmeler' || post.category === 'Kararlar' || post.category === 'Analizler'));
        
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'views') return b.viewCount - a.viewCount;
      if (sortBy === 'likes') return b.likeCount - a.likeCount;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const handleShare = () => {
    setShareSuccess(true);
    navigator.clipboard.writeText(window.location.href);
    showToast(isEn ? 'Share link copied to clipboard!' : 'Paylaşım bağlantısı panoya kopyalandı.', 'success');
    setTimeout(() => setShareSuccess(false), 2000);
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '100px 0 60px' }}>
      <div className="container">
        
        {/* Page Hero */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
            {isEn ? 'Legal Knowledge Center' : 'Hukuki Bilgi Merkezi'}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
            {isEn
              ? 'Discover our digital library with articles, appeal drafts, and landmark rulings to guide your legal processes.'
              : 'Hukuki süreçlerinize ışık tutacak makaleler, dilekçe örnekleri ve güncel yargı kararları ile dijital kütüphanemizi keşfedin.'}
          </p>
        </div>

        {/* General Disclaimer Notice Box */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 24px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid var(--border-color)',
            background: theme === 'dark' ? 'rgba(80, 34, 60, 0.05)' : 'rgba(240, 218, 197, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            animation: 'fadeIn 0.5s ease'
          }}
        >
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            {isEn
              ? 'All contents on this page are prepared for general informational purposes only.'
              : 'Bu sayfada yer alan tüm içerikler genel bilgilendirme amacıyla hazırlanmıştır.'}
          </span>
          <span
            onClick={() => navigateTo('sorumluluk-reddi-beyani')}
            style={{
              fontSize: '12px',
              color: 'var(--color-burgundy)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              whiteSpace: 'nowrap'
            }}
          >
            {isEn ? 'Disclaimer Statement' : 'Sorumluluk Reddi Beyanı'}
          </span>
        </div>

        {/* Toolbar: Search and Filter grid */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '1px solid var(--glass-border)',
            background: 'var(--bg-card)'
          }}
        >
          {/* Row 1: Search and Sort */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                placeholder={isEn ? "Search in articles, tags, or categories..." : "İçeriklerde, etiketlerde veya kategorilerde ara..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '44px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>

            {/* Custom Premium Dropdown Filter */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="glass-input"
                style={{ 
                  width: '200px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 500,
                  height: '44px',
                  padding: '0 16px',
                  borderRadius: '8px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{isEn ? 'Filter' : 'Filtrele'}</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-burgundy)', fontWeight: 600 }}>
                    {sortBy === 'newest' && `(${isEn ? 'New' : 'Yeni'})`}
                    {sortBy === 'views' && `(${isEn ? 'Read' : 'Okunan'})`}
                    {sortBy === 'likes' && `(${isEn ? 'Liked' : 'Beğeni'})`}
                  </span>
                </span>
                <ChevronDown size={16} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition-fast)' }} />
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    onClick={() => setIsDropdownOpen(false)} 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                  />
                  
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      width: '200px',
                      background: theme === 'dark' ? 'rgba(10, 13, 24, 0.98)' : 'rgba(250, 246, 240, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 0',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                      zIndex: 999,
                      animation: 'fadeIn 0.2s ease'
                    }}
                  >
                    {[
                      { value: 'newest', label: isEn ? 'Newest Content' : 'En Yeni İçerikler' },
                      { value: 'views', label: isEn ? 'Most Viewed' : 'En Çok Okunanlar' },
                      { value: 'likes', label: isEn ? 'Most Liked' : 'En Çok Beğenilenler' }
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value as any);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 16px',
                          fontSize: '13px',
                          color: sortBy === opt.value ? '#FFFFFF' : 'var(--text-primary)',
                          background: sortBy === opt.value ? '#50223C' : 'transparent',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          if (sortBy !== opt.value) {
                            e.currentTarget.style.background = '#50223C';
                            e.currentTarget.style.color = '#FFFFFF';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (sortBy !== opt.value) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 2: Hierarchical Categories Selector */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h5 style={{ fontSize: '11px', color: 'var(--color-burgundy)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Outfit', letterSpacing: '0.05em' }}>
              {isEn ? 'Filter by Category' : 'Kategoriye Göre Filtrele'}
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categoriesList.map((item) => {
                const isParentActive = activeCategory === item.key;
                return (
                  <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                      onClick={() => {
                        if (item.route) {
                          navigateTo(item.route as any);
                        } else {
                          setActiveCategory(item.key);
                        }
                      }}
                      style={{
                        alignSelf: 'flex-start',
                        background: isParentActive ? 'var(--color-burgundy)' : 'var(--input-bg)',
                        color: isParentActive ? '#FFFFFF' : 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isParentActive) e.currentTarget.style.background = 'rgba(80, 34, 60, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isParentActive) e.currentTarget.style.background = 'var(--input-bg)';
                      }}
                    >
                      {item.title}
                    </button>
                    
                    {item.subCategories && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingLeft: '20px', marginTop: '2px' }}>
                        {item.subCategories.map((sub) => {
                          const isSubActive = activeCategory === sub.key;
                          return (
                            <button
                              key={sub.key}
                              onClick={() => setActiveCategory(sub.key)}
                              style={{
                                background: isSubActive ? 'var(--color-burgundy)' : 'rgba(80, 34, 60, 0.04)',
                                color: isSubActive ? '#FFFFFF' : 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '20px',
                                padding: '4px 12px',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'var(--transition-fast)'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) e.currentTarget.style.background = 'rgba(80, 34, 60, 0.08)';
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) e.currentTarget.style.background = 'rgba(80, 34, 60, 0.04)';
                              }}
                            >
                              <span>↳</span> {sub.title}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Conditional Category Disclaimer Notice */}
        {activeCategory === 'Dilekçeler' && (
          <div
            className="glass-panel"
            style={{
              padding: '16px 24px',
              borderRadius: '12px',
              marginBottom: '30px',
              border: '1px solid var(--border-color)',
              background: theme === 'dark' ? 'rgba(80, 34, 60, 0.05)' : 'rgba(240, 218, 197, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              animation: 'fadeIn 0.4s ease'
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              {isEn
                ? 'The petition and document templates on this page are for reference only. They must not be used without adaptation to your case.'
                : 'Bu sayfadaki dilekçe ve doküman örnekleri yalnızca örnek niteliğindedir. Somut olayınıza uyarlanmadan kullanılmamalıdır.'}
            </span>
            <span
              onClick={() => navigateTo('sorumluluk-reddi-beyani')}
              style={{
                fontSize: '12px',
                color: 'var(--color-burgundy)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                whiteSpace: 'nowrap'
              }}
            >
              {isEn ? 'Disclaimer Statement' : 'Sorumluluk Reddi Beyanı'}
            </span>
          </div>
        )}

        {/* Content Listing Grid */}
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            {isEn ? 'No matching legal content was found.' : 'Aramanızla eşleşen hukuki içerik bulunamadı.'}
          </div>
        ) : (
          <div className="grid-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="glass-card"
                onClick={() => setSelectedPost(post)}
                style={{
                  border: '1px solid var(--glass-border)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {/* Image */}
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'var(--color-dark-navy)',
                      color: '#F0DAC5',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      border: '1px solid rgba(240, 218, 197, 0.2)'
                    }}
                  >
                    {post.category === 'Makaleler' && isEn ? 'Articles' : 
                     post.category === 'Dilekçeler' && isEn ? 'Petitions' : 
                     post.category === 'Değerlendirmeler' && isEn ? 'Evaluations' : post.category}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {post.publishedAt} • {post.readingTime} {isEn ? 'Read' : 'Okuma'}
                  </div>
                  
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0' }}>
                    {post.tags.map((tag, tIdx) => (
                      <span key={tIdx} style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'rgba(240, 218, 197, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Metrics */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Eye size={12} /> {post.viewCount}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <ThumbsUp size={12} /> {post.likeCount}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-burgundy)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {isEn ? 'Read' : 'Oku'} <ArrowRight size={12} />
                    </span>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* Reader Mode Drawer Overlay */}
      {selectedPost && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(8, 10, 18, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '750px',
              height: '100%',
              background: 'var(--bg-primary)',
              borderLeft: '1px solid var(--border-color)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              animation: 'drawerSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '-20px 0 50px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Tools panel */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '20px',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: 'var(--color-burgundy)', color: '#FFFFFF', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                  {selectedPost.category === 'Makaleler' && isEn ? 'Articles' : 
                   selectedPost.category === 'Dilekçeler' && isEn ? 'Petitions' : 
                   selectedPost.category === 'Değerlendirmeler' && isEn ? 'Evaluations' : selectedPost.category}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {selectedPost.publishedAt}
                </span>
              </div>

              {/* Text tools */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setFontSize(p => Math.max(12, p - 1))} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ZoomOut size={14} />
                </button>
                <button onClick={() => setFontSize(p => Math.min(22, p + 1))} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ZoomIn size={14} />
                </button>
                <button onClick={() => window.print()} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Printer size={14} />
                </button>
                <button onClick={handleShare} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  <Share2 size={14} /> {shareSuccess ? (isEn ? 'Copied!' : 'Kopyalandı!') : (isEn ? 'Share' : 'Paylaş')}
                </button>
                <button onClick={() => setSelectedPost(null)} style={{ background: 'var(--color-burgundy)', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  {isEn ? 'Close' : 'Kapat'}
                </button>
              </div>
            </div>

            {/* Document Body container */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '15px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: '1.3' }}>
                {selectedPost.title}
              </h2>

              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '12px', marginBottom: '24px' }}
              />

              <div
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.8',
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-line'
                }}
              >
                {selectedPost.content}
              </div>

              {/* Template Download module if category is Dilekçeler */}
              {selectedPost.category === 'Dilekçeler' && (
                <div
                  style={{
                    background: 'rgba(80, 34, 60, 0.05)',
                    border: '1px dashed var(--color-burgundy)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-burgundy)' }}>
                      {isEn ? 'Petition Template File' : 'Dilekçe Şablon Dosyası'}
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {isEn ? 'Format: .docx (MS Word) • Size: 24 KB' : 'Format: .docx (MS Word) • Boyut: 24 KB'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      showToast(
                        isEn ? 'Petition template download initiated.' : 'Doküman indirme işlemi başlatıldı.',
                        'success'
                      );
                    }}
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    <Download size={14} /> {isEn ? 'Download Template' : 'Şablonu İndir'}
                  </button>
                </div>
              )}

              {/* Comments block */}
              <div style={{ marginTop: '50px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '20px' }}>
                  {isEn ? 'Evaluations & Comments' : 'Değerlendirmeler ve Yorumlar'}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                  <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <strong>Av. Mehmet Kurt</strong>
                      <span>2026-06-18</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      {isEn 
                        ? 'Very explanatory work Eren Bey, especially the references to recent Supreme Court rulings are on point. I wish you success.'
                        : 'Çok açıklayıcı bir çalışma olmuş Eren Bey, özellikle Yargıtay’ın son kararlarına yapılan atıflar yerinde. Başarılar dilerim.'}
                    </p>
                  </div>
                </div>

                {/* Post comment form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast(
                      isEn ? 'Your comment has been submitted for admin approval.' : 'Yorumunuz denetim için yönetici onayına sunulmuştur.',
                      'success'
                    );
                    e.currentTarget.reset();
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input type="text" placeholder={isEn ? "Your Name Surname" : "Adınız Soyadınız"} className="glass-input" required />
                    <input type="email" placeholder={isEn ? "Your Email Address" : "E-posta Adresiniz"} className="glass-input" required />
                  </div>
                  <textarea rows={3} placeholder={isEn ? "Write your opinions about the article..." : "Yazı hakkındaki görüşlerinizi yazın..."} className="glass-input" style={{ resize: 'none', fontFamily: 'inherit' }} required />
                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', fontSize: '12px', padding: '8px 16px' }}>
                    {isEn ? 'Post Comment' : 'Yorum Yap'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Styled keyframe animation */}
      <style>{`
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
export default KnowledgeHub;
