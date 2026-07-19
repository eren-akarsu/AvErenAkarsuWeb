import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { BlogPost } from '../context/AppContext';
import { ArrowLeft, Eye, ThumbsUp, Calendar, Clock, Tag, Share2, Printer, User, AlertTriangle, BookOpen } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { buildArticleSchema, buildBreadcrumbSchema, combineSchemas } from '../utils/schema';
import { buildSeoTitle, buildMetaDescription, buildContentUrl, buildOgImageUrl, formatDateTurkish } from '../utils/seo';

export const ContentDetailPage: React.FC = () => {
  const { blogPosts, precedentDecisions, contentSlug, navigateTo, setContentSlug, language } = useApp();
  const [content, setContent] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isEn = language === 'en';

  useEffect(() => {
    if (!contentSlug) {
      setIsLoading(false);
      return;
    }

    // Search in blogPosts
    const foundPost = blogPosts.find(p => p.slug === contentSlug);
    if (foundPost) {
      setContent(foundPost);
      setIsLoading(false);
      return;
    }

    // Search in precedentDecisions mapped as blog posts
    const foundDec = precedentDecisions.find(d => d.id === contentSlug);
    if (foundDec) {
      setContent({
        id: foundDec.id,
        title: foundDec.title,
        slug: foundDec.id,
        excerpt: foundDec.summary,
        content: `**${isEn ? 'COURT' : 'MAHKEME'}:** ${foundDec.court}\n**${isEn ? 'MERIT' : 'ESAS'}:** ${foundDec.esas}\n**${isEn ? 'DECISION' : 'KARAR'}:** ${foundDec.karar}\n\n---\n\n${foundDec.fullText}`,
        coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        category: 'Kararlar',
        readingTime: isEn ? 'Precedent' : 'Emsal Karar',
        viewCount: 0,
        likeCount: 0,
        publishedAt: foundDec.decisionDate,
        tags: foundDec.tags,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [contentSlug, blogPosts, precedentDecisions, isEn]);

  const handleGoBack = () => {
    setContentSlug(null);
    navigateTo('knowledge-hub');
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '3px solid rgba(240,218,197,0.1)', borderTopColor: '#F0DAC5',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#A0AEC0', fontSize: '14px' }}>{isEn ? 'Loading...' : 'Yükleniyor...'}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!content) {
    return (
      <>
        <SEOHead
          title={isEn ? 'Content Not Found | Av. Eren Akarsu' : 'İçerik Bulunamadı | Av. Eren Akarsu'}
          description={isEn ? 'The requested content could not be found.' : 'Aradığınız içerik bulunamadı veya kaldırılmış olabilir.'}
          noIndex={true}
        />
        <div style={{
          minHeight: '100vh', background: 'var(--bg-primary)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '40px', textAlign: 'center'
        }}>
          <h2 style={{ color: '#F0DAC5', fontSize: '28px', fontFamily: 'Outfit', marginBottom: '12px' }}>
            404 — {isEn ? 'Content Not Found' : 'İçerik Bulunamadı'}
          </h2>
          <p style={{ color: '#A0AEC0', fontSize: '14px', marginBottom: '24px' }}>
            {isEn ? 'The requested content could not be found.' : 'Aradığınız içerik bulunamadı veya kaldırılmış olabilir.'}
          </p>
          <button onClick={handleGoBack} className="btn-primary" style={{ padding: '12px 28px' }}>
            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
            {isEn ? 'Back to Knowledge Hub' : 'Bilgi Merkezine Dön'}
          </button>
        </div>
      </>
    );
  }

  // ── SEO değerleri ──
  const canonicalPath = `/icerik/${content.slug}`;
  const pageTitle = buildSeoTitle(content.title, '');
  const pageDesc = buildMetaDescription('', content.excerpt, content.content);
  const ogImage = buildOgImageUrl(content.coverImage);
  const contentUrl = buildContentUrl(content.slug);

  // JSON-LD schemas
  const articleSchema = buildArticleSchema({
    title: content.title,
    description: pageDesc,
    url: contentUrl,
    imageUrl: content.coverImage,
    publishedAt: content.publishedAt,
    authorName: 'Av. Eren Akarsu',
  });

  const breadcrumbItems = [
    { label: isEn ? 'Home' : 'Ana Sayfa', href: '/' },
    { label: isEn ? 'Legal Content' : 'Hukuki İçerikler', href: '/hukuki-icerikler' },
    { label: content.category },
    { label: content.title },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const combinedSchema = combineSchemas(articleSchema, breadcrumbSchema);

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        canonical={canonicalPath}
        ogType="article"
        ogTitle={content.title}
        ogDescription={pageDesc}
        ogImage={content.coverImage}
        jsonLd={combinedSchema}
      />

      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Hero Banner */}
        <div style={{
          position: 'relative', height: '340px', overflow: 'hidden',
          background: `linear-gradient(180deg, rgba(28,35,64,0.3) 0%, rgba(12,16,30,0.95) 100%), url(${content.coverImage}) center/cover`
        }}>
          {/* Cover image — SEO için attr */}
          <img
            src={content.coverImage}
            alt={`${content.title} — kapak görseli`}
            width={800}
            height={340}
            loading="eager"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', zIndex: 0, opacity: 0,
            }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '40px' }}>
            <button onClick={handleGoBack} style={{
              position: 'absolute', top: '24px', left: '20px',
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(240,218,197,0.08)', border: '1px solid rgba(240,218,197,0.15)',
              color: '#F0DAC5', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer',
              fontSize: '13px', backdropFilter: 'blur(8px)', transition: 'all 0.2s'
            }}>
              <ArrowLeft size={16} /> {isEn ? 'Back' : 'Geri'}
            </button>

            {/* Breadcrumb — hero'da */}
            <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', display: 'none' }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span style={{
                background: 'rgba(80,34,60,0.6)', color: '#F0DAC5',
                padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500
              }}>
                {content.category}
              </span>
              <span style={{
                background: 'rgba(240,218,197,0.08)', color: '#A0AEC0',
                padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Clock size={12} /> {content.readingTime}
              </span>
            </div>

            <h1 style={{
              color: '#F0DAC5', fontSize: 'clamp(22px, 4vw, 34px)',
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              lineHeight: 1.3, maxWidth: '700px'
            }}>
              {content.title}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="container" style={{ padding: '0 20px 80px' }}>

          {/* Breadcrumb — içerik üstü */}
          <div style={{ paddingTop: '20px', paddingBottom: '4px' }}>
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '16px' }}>
            {/* Main Content */}
            <article style={{ flex: '1 1 600px', minWidth: 0 }}>
              {/* Meta bar */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '32px',
                paddingBottom: '20px', borderBottom: '1px solid rgba(240,218,197,0.08)',
                color: '#A0AEC0', fontSize: '13px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> Av. Eren Akarsu
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> {formatDateTurkish(content.publishedAt)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} /> {content.viewCount.toLocaleString('tr-TR')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ThumbsUp size={14} /> {content.likeCount}
                </span>
                <button onClick={() => window.print()} style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  color: '#A0AEC0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px'
                }}>
                  <Printer size={14} /> {isEn ? 'Print' : 'Yazdır'}
                </button>
              </div>

              {/* Excerpt */}
              {content.excerpt && (
                <p style={{
                  fontSize: '16px', lineHeight: 1.7, color: '#C4CDD5',
                  fontStyle: 'italic', marginBottom: '28px',
                  padding: '20px', borderRadius: '12px',
                  background: 'rgba(240,218,197,0.03)',
                  borderLeft: '3px solid rgba(80,34,60,0.5)'
                }}>
                  {content.excerpt}
                </p>
              )}

              {/* Body */}
              <div style={{
                fontSize: '15px', lineHeight: 1.9, color: '#D1D5DB',
                whiteSpace: 'pre-wrap',
              }}>
                {content.content.split('\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <h2 key={idx} style={{ color: '#F0DAC5', fontSize: '18px', fontFamily: 'Outfit', margin: '32px 0 12px', fontWeight: 600 }}>{paragraph.replace(/\*\*/g, '')}</h2>;
                  }
                  if (paragraph.startsWith('---')) {
                    return <hr key={idx} style={{ border: 'none', borderTop: '1px solid rgba(240,218,197,0.1)', margin: '24px 0' }} />;
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return <p key={idx} style={{ paddingLeft: '16px', marginBottom: '8px' }}>{paragraph}</p>;
                  }
                  if (paragraph.startsWith('- ')) {
                    return <p key={idx} style={{ paddingLeft: '16px', marginBottom: '8px' }}>• {paragraph.substring(2)}</p>;
                  }
                  if (!paragraph.trim()) return <br key={idx} />;
                  return <p key={idx} style={{ marginBottom: '16px' }}>{paragraph}</p>;
                })}
              </div>

              {/* Tags */}
              {content.tags.length > 0 && (
                <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(240,218,197,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#A0AEC0', fontSize: '13px' }}>
                    <Tag size={14} /> {isEn ? 'Tags' : 'Etiketler'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {content.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '6px 14px', borderRadius: '8px',
                        background: 'rgba(240,218,197,0.05)',
                        border: '1px solid rgba(240,218,197,0.1)',
                        color: '#C4CDD5', fontSize: '12px'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Hukuki Uyarı (Disclaimer) ── */}
              <div style={{
                marginTop: '40px', padding: '20px 24px', borderRadius: '12px',
                background: 'rgba(80,34,60,0.08)',
                border: '1px solid rgba(80,34,60,0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertTriangle size={16} style={{ color: '#F0DAC5', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#F0DAC5', marginBottom: '6px', fontFamily: 'Outfit' }}>
                      {isEn ? 'Legal Disclaimer' : 'Hukuki Uyarı'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#A0AEC0', lineHeight: 1.6, margin: 0 }}>
                      {isEn
                        ? 'This content is provided for general informational purposes only. Legal evaluation may vary depending on the specific facts of each situation. It is strongly recommended to seek professional legal advice from a qualified attorney to avoid any loss of rights.'
                        : 'Bu içerik genel bilgilendirme amacı taşır. Somut olayın özelliklerine göre hukuki değerlendirme değişebilir. Hak kaybı yaşamamak için bir avukattan profesyonel destek alınması önerilir.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', borderRadius: '10px',
                    background: 'rgba(240,218,197,0.05)', border: '1px solid rgba(240,218,197,0.15)',
                    color: '#F0DAC5', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s'
                  }}
                >
                  <Share2 size={14} /> {isEn ? 'Copy Link' : 'Bağlantıyı Kopyala'}
                </button>
              </div>
            </article>

            {/* Sidebar */}
            <aside style={{ flex: '0 0 280px', minWidth: '240px' }}>
              <div style={{
                position: 'sticky', top: '24px',
                background: 'rgba(12,16,30,0.5)', borderRadius: '16px',
                border: '1px solid rgba(240,218,197,0.08)', padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <BookOpen size={14} style={{ color: '#F0DAC5' }} />
                  <h4 style={{ color: '#F0DAC5', fontSize: '14px', fontFamily: 'Outfit', fontWeight: 600, margin: 0 }}>
                    {isEn ? 'Related Legal Content' : 'İlgili Hukuki İçerikler'}
                  </h4>
                </div>
                {blogPosts
                  .filter(p => p.id !== content.id && p.category === content.category)
                  .slice(0, 4)
                  .map(related => (
                    <a
                      key={related.id}
                      href={`/icerik/${related.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setContentSlug(related.slug);
                        window.history.pushState(null, '', `/icerik/${related.slug}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        display: 'block',
                        padding: '12px 0', borderBottom: '1px solid rgba(240,218,197,0.06)',
                        textDecoration: 'none', transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      <p style={{ color: '#C4CDD5', fontSize: '13px', lineHeight: 1.4, marginBottom: '4px' }}>
                        {related.title}
                      </p>
                      <span style={{ color: '#718096', fontSize: '11px' }}>{formatDateTurkish(related.publishedAt)}</span>
                    </a>
                  ))
                }
                {blogPosts.filter(p => p.id !== content.id && p.category === content.category).length === 0 && (
                  <p style={{ color: '#718096', fontSize: '12px' }}>
                    {isEn ? 'No related content yet.' : 'Henüz ilgili içerik yok.'}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};
