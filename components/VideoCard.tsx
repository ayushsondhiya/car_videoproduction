'use client';

import React, { useRef, useState } from 'react';
import { VideoItem } from '../types';
import styles from './VideoCard.module.css';

interface VideoCardProps {
  video: VideoItem;
  onSelect: (video: VideoItem) => void;
}

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.debug('Autoplay preview was interrupted:', err);
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch (err) {
        // ignore seek errors
      }
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(video)}
      id={`video-card-${video.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(video);
        }
      }}
      aria-label="Play video"
    >
      <div className={styles.mediaContainer}>
        {/* Instant high-res poster image */}
        <img
          src={video.posterUrl}
          alt="Video thumbnail"
          className={styles.posterImage}
          loading="lazy"
          style={{ opacity: isPlaying ? 0 : 1 }}
        />

        {/* Hover Autoplay Video */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.posterUrl}
          className={styles.previewVideo}
          loop
          muted
          playsInline
          preload="none"
          style={{ opacity: isPlaying ? 1 : 0 }}
        />
      </div>

      {/* Play Icon Overlay */}
      <div className={styles.playOverlay}>
        <div className={styles.playIcon} />
      </div>
    </div>
  );
}
