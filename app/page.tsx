'use client';

import React, { useState } from 'react';
import { videos } from '../data/videos';
import { VideoItem } from '../types';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import styles from './page.module.css';

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <div className={styles.page}>
      {/* Decorative Neon Mesh Background Glows */}
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      {/* Navigation Header */}
      <header className={styles.navHeader}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div className={styles.logoSlot}>
            <img src="/logo.png" alt="Apisomi Logo" className={styles.logoImage} />
          </div>
          <div className={styles.socialNav}>
            <a
              href="mailto:hello@apisomi.com"
              className={styles.socialLink}
              aria-label="Email Apisomi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/apisomi_global/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Apisomi Instagram profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4.000 4.000 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="tel:9977994060"
              className={styles.socialLink}
              aria-label="Call Apisomi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container">
        
        {/* Hero & About Overview Presentation */}
        <section className={styles.hero}>
          <div className={styles.heroLogoSlot}>
            <img src="/logo.png" alt="Apisomi Logo" className={styles.heroLogoImage} />
          </div>

          <p className={styles.heroTagline}>
            Specialized short-form vertical video production crafting high-retention 9:16 reels, commercials, and brand sales campaigns.
          </p>

          {/* What We Offer Grid */}
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>9:16 Commercial Ads</h3>
              <p className={styles.serviceDesc}>High-converting vertical commercials designed for maximum first-3-second retention.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Brand Sales Campaigns</h3>
              <p className={styles.serviceDesc}>Promotional video assets tailored to accelerate customer acquisition and product sales.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Editing & Sound Design</h3>
              <p className={styles.serviceDesc}>Precision color grading, dynamic pacing, keyframe transitions, and custom audio layers.</p>
            </div>
          </div>
        </section>

        {/* Video Portfolio Grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid} role="region" aria-label="Portfolio grid">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onSelect={(vid) => setSelectedVideo(vid)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Video Detail Modal Dialog */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      {/* Premium Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoSlot}>
                <img src="/logo.png" alt="Apisomi Logo" className={styles.footerLogoImage} />
              </div>
              <p className={styles.copyright}>
                &copy; 2026 Apisomi. All rights reserved.
              </p>
            </div>

            <div className={styles.footerContact}>
              <a href="mailto:hello@apisomi.com" className={styles.contactTextLink}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                hello@apisomi.com
              </a>
              <span className={styles.contactDivider}>•</span>
              <a href="tel:9977994060" className={styles.contactTextLink}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +91 9977994060
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
