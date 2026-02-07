import { useState, useRef, useEffect } from 'react';

const VideoBanner = ({ videoSrc, imageSrc, imageDuration = 10000 }) => {
  const [showImage, setShowImage] = useState(false);
  const videoRef = useRef(null);
  const imageTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, []);

  const handleVideoEnd = () => {
    setShowImage(true);
    
    imageTimerRef.current = setTimeout(() => {
      setShowImage(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, imageDuration);
  };

  return (
    <div className="video-banner">
      <video
        ref={videoRef}
        className={`video-banner__video ${showImage ? 'video-banner__video--hidden' : ''}`}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <img
        src={imageSrc}
        alt="Banner"
        className={`video-banner__image ${showImage ? 'video-banner__image--visible' : ''}`}
      />
    </div>
  );
};

export default VideoBanner;
