import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';

const studyVideos = [
  { name: 'Lofi Girl Radio', videoId: 'jfKfPfyJRdk' },
  { name: 'Coffee Shop Sounds', videoId: '6uddGul0oAc' },
   { name: 'Relaxing Rain Sounds', videoId: 'n5EdGbfF5ZM' }, 
];

const FocusMusic = () => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const opts = {
    height: '200',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const handlePlay = (video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
    setIsPlaying(false);
  };

  const handleResume = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
    setIsPlaying(true);
  };

  const handleClose = () => {
    setCurrentVideo(null);
    setIsPlaying(false);
  };

  return (
    <div className="focus-music-container">
      <h3>Focus Music</h3>
      <div className="track-list">
        {studyVideos.map((video) => (
          <button 
            key={video.name} 
            onClick={() => handlePlay(video)}
            className={`track-button ${currentVideo?.name === video.name ? 'playing' : ''}`}
          >
            ▶ Play {video.name}
          </button>
        ))}
      </div>

      {currentVideo && (
        <div className="youtube-player-container">
          <YouTube videoId={currentVideo.videoId} opts={opts} onReady={onPlayerReady} />
          <div className="player-controls">
            {isPlaying ? (
              <button onClick={handlePause} className="control-button">Pause</button>
            ) : (
              <button onClick={handleResume} className="control-button">Play</button>
            )}
            <button onClick={handleClose} className="control-button close">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusMusic;