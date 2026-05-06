import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AudioPlayer from '../components/AudioPlayer'

export default function Episodes() {
  const [episodes, setEpisodes] = useState([])
  const [currentEpisode, setCurrentEpisode] = useState(null)

  useEffect(() => {
    fetch('/data/episodes.json')
      .then(res => res.json())
      .then(data => setEpisodes(data))
  }, [])

  const handlePlay = (episode) => {
    setCurrentEpisode(episode)
  }

  return (
    <div className="container">
      <Head>
        <title>All Episodes - Podsite1</title>
        <meta name="description" content="Browse all podcast episodes" />
      </Head>

      <header>
        <h1>Podsite1</h1>
        <nav>
          <Link href="/">Home</Link>
        </nav>
      </header>

      <main>
        <h2>All Episodes</h2>
        <div className="episodes-grid">
          {episodes.map(episode => (
            <div key={episode.id} className="episode-card">
              <img src={episode.imageUrl} alt={episode.title} loading="lazy" />
              <div className="episode-info">
                <h3>{episode.title}</h3>
                <p>{episode.description}</p>
                <div className="episode-meta">
                  <span>{episode.duration}</span>
                  <span>{new Date(episode.date).toLocaleDateString()}</span>
                </div>
                <button onClick={() => handlePlay(episode)}>Play Episode</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {currentEpisode && (
        <AudioPlayer
          episode={currentEpisode}
          onClose={() => setCurrentEpisode(null)}
        />
      )}
    </div>
  )
}