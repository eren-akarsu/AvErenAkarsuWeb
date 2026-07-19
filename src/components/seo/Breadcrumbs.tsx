import React from 'react';
import { getSiteUrl } from '../../utils/seo';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Görsel Breadcrumb bileşeni.
 * Premium LegalTech tasarımına uygun, krem/bordo/lacivert palette.
 * JSON-LD için buildBreadcrumbSchema kullanın.
 *
 * Örnek:
 * <Breadcrumbs items={[
 *   { label: 'Ana Sayfa', href: '/' },
 *   { label: 'Hukuki İçerikler', href: '/hukuki-icerikler' },
 *   { label: 'Makaleler', href: '/hukuki-icerikler/makaleler' },
 *   { label: 'İçerik Başlığı' }
 * ]} />
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const siteUrl = getSiteUrl();

  const handleNavigate = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    // AppContext navigateTo yerine pushState kullanıyoruz,
    // çünkü Breadcrumbs herhangi bir sayfada kullanılabilir.
    window.history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px',
        fontSize: '12px',
        color: 'var(--text-muted, #718096)',
        padding: '10px 0',
      }}
    >
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '4px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const fullUrl = item.href
            ? item.href.startsWith('http')
              ? item.href
              : `${siteUrl}${item.href}`
            : undefined;

          return (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {!isLast && item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => handleNavigate(item.href!, e)}
                  itemProp="item"
                  itemScope
                  itemType="https://schema.org/WebPage"
                  style={{
                    color: 'rgba(240, 218, 197, 0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(240, 218, 197, 0.9)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(240, 218, 197, 0.55)';
                  }}
                >
                  {fullUrl && <meta itemProp="id" content={fullUrl} />}
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span
                  itemProp="name"
                  aria-current={isLast ? 'page' : undefined}
                  style={{
                    color: isLast ? 'rgba(240, 218, 197, 0.85)' : 'rgba(240, 218, 197, 0.55)',
                    fontWeight: isLast ? 600 : 400,
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              )}

              <meta itemProp="position" content={String(index + 1)} />

              {/* Separator */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  style={{
                    color: 'rgba(240, 218, 197, 0.2)',
                    fontSize: '10px',
                    marginLeft: '2px',
                    userSelect: 'none',
                  }}
                >
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
