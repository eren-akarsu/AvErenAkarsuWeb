import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const HeroPhotoCarousel: React.FC = () => {
  const { theme } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const imageUrls = [
    '/hero-carousel-1.jpg',
    '/hero-carousel-2.jpg',
    '/hero-carousel-3.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 3);
    }, 4500); // 4.5 seconds for a soft premium cycle
    return () => clearInterval(timer);
  }, []);

  // Setup dynamic card properties based on its offset relative to the active index
  // Shadow is kept extremely soft, light, and floating, avoiding any heavy dark blocks
  const getCardStyle = (index: number) => {
    const offset = (index - activeIndex + 3) % 3;

    if (offset === 0) {
      // Front / Active Card
      return {
        transform: 'translateX(0) translateY(0) scale(1) rotate(0deg)',
        opacity: 1,
        zIndex: 10,
        filter: 'blur(0px)',
        pointerEvents: 'auto' as const,
        boxShadow: theme === 'dark' 
          ? '0 20px 45px rgba(0, 0, 0, 0.4), 0 0 15px rgba(240, 218, 197, 0.05)'
          : '0 15px 35px rgba(80, 34, 60, 0.08), 0 0 15px rgba(240, 218, 197, 0.1)'
      };
    } else if (offset === 1) {
      // Right Back Card
      return {
        transform: 'translateX(35%) translateY(-15px) scale(0.85) rotate(6deg)',
        opacity: 0.65,
        zIndex: 5,
        filter: 'blur(2px)',
        pointerEvents: 'none' as const,
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
      };
    } else {
      // Left Back Card
      return {
        transform: 'translateX(-35%) translateY(-15px) scale(0.85) rotate(-6deg)',
        opacity: 0.65,
        zIndex: 4,
        filter: 'blur(2px)',
        pointerEvents: 'none' as const,
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
      };
    }
  };

  return (
    <div className="hero-carousel-wrapper">
      {/* Outer 3D bounding box */}
      <div className="hero-carousel-container">
        {[0, 1, 2].map((idx) => {
          const cardStyle = getCardStyle(idx);
          return (
            <div
              key={idx}
              className="hero-carousel-card-track"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                maxWidth: '290px',
                height: '370px',
                marginTop: '-185px',
                marginLeft: '-145px',
                transition: 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                ...cardStyle
              }}
            >
              {/* Nested floating container to decouple horizontal layout and vertical float */}
              <div className={`hero-carousel-float-container float-delay-${idx}`}>
                <div
                  className="glass-card"
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '8px',
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    background: theme === 'dark' ? 'rgba(28, 35, 64, 0.45)' : 'rgba(250, 246, 240, 0.5)',
                    backdropFilter: 'blur(16px)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'none' // Remove duplicate nested shadow to keep card looking light and floating
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={imageUrls[idx]}
                      alt={`Advocate Profile ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 12%', // Custom crop focus to center face, body, and head perfectly
                        transition: 'transform 0.8s ease'
                      }}
                    />
                    {/* Premium Ambient Shading Layer */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 60%, rgba(8, 10, 18, 0.45) 100%)',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Styled JSX for Premium Animation & Responsive Layout */}
      <style>{`
        .hero-carousel-wrapper {
          display: flex;
          justifyContent: center;
          alignItems: center;
          position: relative;
          width: 100%;
          max-width: 520px;
          height: 440px;
          overflow: visible;
        }

        .hero-carousel-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* Floating keyframe animations */
        .hero-carousel-float-container {
          width: 100%;
          height: 100%;
        }
        
        .hero-carousel-float-container.float-delay-0 {
          animation: heroCardFloat0 6s ease-in-out infinite;
        }
        .hero-carousel-float-container.float-delay-1 {
          animation: heroCardFloat1 6.5s ease-in-out infinite;
        }
        .hero-carousel-float-container.float-delay-2 {
          animation: heroCardFloat2 5.5s ease-in-out infinite;
        }

        @keyframes heroCardFloat0 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes heroCardFloat1 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes heroCardFloat2 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
          100% { transform: translateY(0px); }
        }

        /* Responsive overrides to prevent screen overflow */
        @media (max-width: 767px) {
          .hero-carousel-wrapper {
            height: 320px;
            margin-top: 20px;
          }
          .hero-carousel-card-track {
            max-width: 190px !important;
            height: 250px !important;
            margin-top: -125px !important;
            margin-left: -95px !important;
          }
        }
      `}</style>
    </div>
  );
};
export default HeroPhotoCarousel;
