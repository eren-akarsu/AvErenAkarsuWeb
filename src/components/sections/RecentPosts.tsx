import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Eye, ThumbsUp, MessageSquare, ArrowRight } from 'lucide-react';
import { ContentSkeleton } from '../ui/ContentSkeleton';
import { EmptyState } from '../ui/EmptyState';

export const RecentPosts: React.FC = () => {
  const { blogPosts, navigateTo, language, isLoadingContents, setContentSlug, siteSettings } = useApp();
  const isEn = language === 'en';

  // Show dynamic count of published posts from settings
  const limit = siteSettings?.homepage_settings?.blogCount !== undefined ? siteSettings.homepage_settings.blogCount : 3;
  const displayPosts = blogPosts.slice(0, limit);


  return (
    <section
      id="recent-posts"
      style={{
        padding: '100px 0',
        background: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              {isEn ? 'Knowledge Center' : 'Bilgi Merkezi'}
            </h4>
            <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
              {isEn ? 'Recent Legal Articles' : 'Güncel Hukuki Yazılar'}
            </h2>
          </div>
          <button
            onClick={() => navigateTo('knowledge-hub')}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            {isEn ? 'View All' : 'Tümünü Gör'} <ArrowRight size={14} />
          </button>
        </div>

        {/* Posts Grid */}
        {isLoadingContents ? (
          <ContentSkeleton variant="card" count={limit} />
        ) : displayPosts.length === 0 ? (
          <EmptyState
            title={isEn ? 'No content yet' : 'Henüz içerik yok'}
            description={isEn ? 'Published articles will appear here.' : 'Yayınlanan yazılar burada görünecektir.'}
          />
        ) : (
        <div className="grid-3">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="glass-card"
              onClick={() => {
                setContentSlug(post.slug);
                window.history.pushState(null, '', `/icerik/${post.slug}`);
                navigateTo('content-detail');
              }}
              style={{
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* Cover Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                  className="post-cover"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'var(--color-dark-navy)',
                    color: '#F0DAC5',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid rgba(240, 218, 197, 0.2)'
                  }}
                >
                  {/* Category names inside data are translated dynamically via context state, but fallback check */}
                  {post.category === 'Makaleler' && isEn ? 'Articles' : 
                   post.category === 'Dilekçeler' && isEn ? 'Petitions' : 
                   post.category === 'Değerlendirmeler' && isEn ? 'Evaluations' : post.category}
                </span>
              </div>

              {/* Content Body */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span>{post.readingTime} {isEn ? 'Read' : 'Okuma'}</span>
                </div>
                
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  {post.title}
                </h3>
                
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
                  {post.excerpt}
                </p>

                {/* Footer Metrics */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)',
                    marginTop: '10px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} /> {post.viewCount}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ThumbsUp size={12} /> {post.likeCount}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-burgundy)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isEn ? 'Read' : 'Oku'} <ArrowRight size={12} />
                  </span>
                </div>

              </div>

            </article>
          ))}
        </div>
        )}

      </div>
      <style>{`
        .glass-card:hover .post-cover {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};
export default RecentPosts;
