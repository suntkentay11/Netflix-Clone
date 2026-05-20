import React from 'react'
import { useEffect, useState } from 'react'
import './Hero.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLists } from '../../context/ListContext';

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const Hero = ({ fetchUrl = "/movie/popular" }) => {
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);

    const { myList, addToMyList } = useLists();
    const [selectedTrailer, setSelectedTrailer] = useState(null);

    const isInMyList = myList.some((item) => item.id === movie?.id);

    useEffect(() => {
        const fetchHeroMovie = async () => {
            try {
                const movieRes = await fetch(`${BASE_URL}${fetchUrl}`, {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                        accept: 'application/json',
                    },
                }
                );

                const movieData = await movieRes.json();

                const randomMovie = movieData.results[Math.floor(Math.random() * movieData.results.length)];

                setMovie(randomMovie);

                const mediaType = randomMovie.first_air_date ? 'tv' : 'movie';

                const videoRes = await fetch(
                    `${BASE_URL}/${mediaType}/${randomMovie.id}/videos?language=en-US`,
                    {
                        headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                        accept: "application/json",
                        },
                    }
                );

                const videoData = await videoRes.json();

                const officialTrailer = videoData.results.find(
                    (video) =>
                        video.type === 'Trailer' &&
                        video.site === 'YouTube' &&
                        video.official === true
                );

                setTrailer(officialTrailer);
            } catch (error) {
                console.error('Error fetching hero movie:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroMovie();
    }, []);

    if (loading) {
        return ( 
        <section className="hero hero--loading">
            <div className="spinner"></div>
        </section>
        );
    }

    if (!movie)  return null;

  return (
    <section 
        className="hero" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <img
            className='hero__image'
            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title} />

        {isHovered && trailer && (
            <iframe
                className="hero__video"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}`}
                title={movie.title}
                allow="autoplay; encrypted-media"
            ></iframe>
        )}

        <div className="hero__overlay"></div>

        <div className="hero__content">
            <h1 className="hero__title">{movie.title || movie.name}</h1>
            <p className="hero__overview">{movie.overview}</p>
            <div className="hero__buttons">
                <button
                    className="hero__button"
                    onClick={() => trailer && setSelectedTrailer(trailer.key)}
                >
                    ▶ Play
                </button>

                <button className="hero__button" onClick={() => addToMyList(movie)}>
                    <FontAwesomeIcon icon={isInMyList ? "circle-check" : "circle-plus"} />
                    {isInMyList ? "In My List" : "Add to List"}
                </button>

                <button className="hero__button">
                    <FontAwesomeIcon icon="circle-info" />
                    More Info
                </button>
            </div>
        </div>
        {selectedTrailer && (
            <div className="trailer__modal">
                <button
                className="trailer__close"
                onClick={() => setSelectedTrailer(null)}
                >
                ✕
                </button>

                <iframe
                className="trailer__video"
                src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1`}
                title="Movie Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
                ></iframe>
            </div>
        )}
    </section>
  )
}

export default Hero