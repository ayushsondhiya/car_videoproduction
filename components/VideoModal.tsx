'use client';

import React, { useRef, useEffect, useState } from 'react';
import { VideoItem } from '../types';
import styles from './VideoModal.module.css';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Controls overlay auto-hide visibility state
  const [controlsVisible, setControlsVisible] = useState(true);

  // Custom visual play/pause feedback overlay state
  const [pulsePlayIcon, setPulsePlayIcon] = useState(false);

  // Auto-hide controls timer functions
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

  const showControlsTemporarily = () => {
    setControlsVisible(true);
    resetControlsTimeout();
  };

  // Sync dialog visibility, scroll lock, and initial preview player actions
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (video) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setControlsVisible(true);
      resetControlsTimeout();

      // Scroll lock the background document body on mobile
      document.body.style.overflow = 'hidden';

      // Open native modal dialog
      if (!dialog.open) {
        dialog.showModal();
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.muted = false;
          videoRef.current.volume = 1;
          setIsMuted(false);
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch((err) => {
                console.warn('Unmuted autoplay restricted, attempting muted play:', err);
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  setIsMuted(true);
                  videoRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
                }
              });
          }
        }
      }
    } else {
      document.body.style.overflow = '';
      if (dialog.open) {
        dialog.close();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [video]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Handle ESC key or alternative close triggers that fire the native "close" event
  const handleNativeClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    onClose();
  };

  // Fallback for click outside content bounds
  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    if (event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInsideContent = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );

    if (!isInsideContent) {
      dialog.close();
    }
  };

  // Video Control Handlers
  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isPlaying) {
      videoEl.pause();
      setIsPlaying(false);
    } else {
      videoEl.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    
    // Trigger visual center pulse
    setPulsePlayIcon(true);
    setTimeout(() => setPulsePlayIcon(false), 600);
  };

  const handleVideoSectionClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.videoControls}`)) {
      return;
    }
    
    setControlsVisible((prev) => {
      const next = !prev;
      if (next) {
        resetControlsTimeout();
      } else {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }
      return next;
    });
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlay();
    showControlsTemporarily();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    showControlsTemporarily();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
    showControlsTemporarily();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = nextMuted ? 0 : volume;
    }
    showControlsTemporarily();
  };

  const toggleFullscreen = () => {
    const videoSection = videoRef.current?.parentElement;
    if (!videoSection) return;

    if (!document.fullscreenElement) {
      videoSection.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
    showControlsTemporarily();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!video) return null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={handleNativeClose}
      onClick={handleDialogClick}
      {...({ closedby: 'any' } as any)}
      aria-label="Video Player"
    >
      <div className={styles.content}>
        {/* Global Floating Close Button */}
        <button 
          onClick={handleNativeClose} 
          className={styles.globalCloseBtn} 
          aria-label="Close dialog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video Player Area */}
        <div className={styles.videoSection} onClick={handleVideoSectionClick}>
          <video
            ref={videoRef}
            src={video.videoUrl}
            className={styles.videoElement}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={handleVideoClick}
            loop
            playsInline
          />

          {/* Large visual feedback overlay for play/pause pulse */}
          <div className={`${styles.centerPlayOverlay} ${pulsePlayIcon ? styles.animatePlayIcon : ''}`}>
            {isPlaying ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <rect x="14" y="4" width="4" height="16" rx="1" />
                <rect x="6" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>

          {/* Custom controls overlay */}
          <div className={`${styles.videoControls} ${controlsVisible ? styles.videoControlsVisible : ''}`}>
            <div className={styles.timelineRow}>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className={styles.seekBar}
                aria-label="Video timeline slider"
              />
            </div>
            <div className={styles.controlRow}>
              <div className={styles.leftControls}>
                <button onClick={handleVideoClick} className={styles.iconBtn} aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>

                <span className={styles.timeDisplay}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className={styles.rightControls}>
                <div className={styles.volumeContainer}>
                  <button onClick={toggleMute} className={styles.iconBtn} aria-label={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="22" y1="9" x2="16" y2="15" />
                        <line x1="16" y1="9" x2="22" y2="15" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className={styles.volumeBar}
                    aria-label="Volume slider"
                  />
                </div>

                <button onClick={toggleFullscreen} className={styles.iconBtn} aria-label="Fullscreen">
                  {isFullscreen ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
