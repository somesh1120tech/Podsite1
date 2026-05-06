import { useState, useRef, useEffect } from 'react'

export default function AudioPlayer({ episode, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setAudioError(false)
    }
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => setAudioError(true)

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || audioError) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => setAudioError(true))
      setIsPlaying(true)
    }
  }

  const handleProgressChange = (e) => {
    const audio = audioRef.current
    if (!audio || audioError) return

    const newTime = (e.target.value / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e) => {
    const audio = audioRef.current
    const newVolume = e.target.value / 100
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="audio-player" role="region" aria-label="Audio player">
      <div className="player-header">
        <h4>Now Playing: {episode.title}</h4>
        <button onClick={onClose} className="close-btn" aria-label="Close audio player">×</button>
      </div>
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        preload="metadata"
        onError={() => setAudioError(true)}
        aria-hidden="true"
      />
      {audioError && (
        <div className="audio-error" role="alert">
          Unable to load audio for this episode. Please try again later.
        </div>
      )}
      <div className="player-controls">
        <button onClick={togglePlay} className="play-btn" aria-label={isPlaying ? 'Pause episode' : 'Play episode'} disabled={audioError}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <div className="progress-container">
          <span aria-live="polite">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleProgressChange}
            className="progress-bar"
            aria-label="Seek through episode"
            disabled={audioError}
          />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="volume-container">
          <span aria-hidden="true">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="volume-bar"
            aria-label="Adjust volume"
            disabled={audioError}
          />
        </div>
      </div>
    </div>
  )
}