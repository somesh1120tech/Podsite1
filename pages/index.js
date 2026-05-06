import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AudioPlayer from '../components/AudioPlayer'

export default function Home() {
  const [featuredEpisode, setFeaturedEpisode] = useState(null)
  const [currentEpisode, setCurrentEpisode] = useState(null)

  useEffect(() => {
    fetch('/data/episodes.json')
      .then(res => res.json())
      .then(episodes => {
        setFeaturedEpisode(episodes[0]) // First episode as featured
      })
  }, [])

  const handlePlay = (episode) => {
    setCurrentEpisode(episode)
  }

  return (
    <div className="container">
      <Head>
        <title>Podsite1 - Sleek Podcast Website</title>
        <meta name="description" content="A modern, responsive podcast website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>Podsite1</h1>
        <nav>
          <Link href="/episodes">All Episodes</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Welcome to Podsite1</h2>
          <p>Discover amazing podcast content with our sleek, modern interface.</p>
        </section>

        {featuredEpisode && (
          <section className="featured-episode">
            <h3>Featured Episode</h3>
            <div className="episode-card">
              <img src={featuredEpisode.imageUrl} alt={featuredEpisode.title} loading="lazy" />
              <div className="episode-info">
                <h4>{featuredEpisode.title}</h4>
                <p>{featuredEpisode.description}</p>
                <div className="episode-meta">
                  <span>{featuredEpisode.duration}</span>
                  <span>{new Date(featuredEpisode.date).toLocaleDateString()}</span>
                </div>
                <button onClick={() => handlePlay(featuredEpisode)}>Play Episode</button>
              </div>
            </div>
          </section>
        )}
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