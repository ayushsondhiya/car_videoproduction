'use client';

import React, { useRef } from 'react';
import { VideoItem } from '../types';
import styles from './VideoCard.module.css';

interface VideoCardProps {
  video: VideoItem;
  onSelect: (video: VideoItem) => void;
}

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = true;
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
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
        {/* Dynamic Video Element - preload="metadata" renders the first frame as cover */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          className={styles.previewVideo}
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>

      {/* Play Icon Overlay */}
      <div className={styles.playOverlay}>
        <div className={styles.playIcon} />
      </div>
    </div>
  );
}
