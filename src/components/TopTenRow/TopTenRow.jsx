import React, { useEffect, useState, useRef } from 'react'
import './TopTenRow.css'
import RankNumber from './RankNumber';
import HoverPreview from '../Row/HoverPreview';

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const TopTenRow = ({ 
    title, 
    fetchUrl,
    myList = [],
    favorites = [],
    addToMyList,
    addToFavorites,
    previewOffsetY = -35,
 }) => {
    const [items, setItems] = useState([]);
    const rowRef = useRef(null);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [hoverPosition, setHoverPosition] = useState(null);
    const [hoverTrailer, setHoverTrailer] = useState(null);

    useEffect(() => {
        const fetchTopTen = async () => {
            try {
                const res = await fetch(`${BASE_URL}${fetchUrl}`, {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                        accept : "application/json",
                    },
                });
                const data = await res.json();
                setItems((data.results || []).slice(0, 10));
            } catch (error) {
                console.error("Error fetching top ten:", error);
            }
        };
        fetchTopTen();
    }, [fetchUrl]);

    const fetchHoverTrailer = async (movie) => {
        try {
        const mediaType = getMediaType(movie);

        const res = await fetch(
            `${BASE_URL}/${mediaType}/${movie.id}/videos?language=en-US`,
            {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                accept: "application/json",
            },
            }
        );

        const data = await res.json();

        const trailer = data.results?.find(
            (video) => video.site === "YouTube" && video.type === "Trailer"
        );

        setHoverTrailer(trailer ? trailer.key : null);
        } catch (err) {
        console.error("Failed to fetch hover trailer:", err);
        setHoverTrailer(null);
        }
    };

    const getMediaType = (movie) => {
        return movie.media_type || (movie.first_air_date ? "tv" : "movie");
        };

    const fetchTrailer = async (movie) => {
        try {
        const mediaType = getMediaType(movie);

        const res = await fetch(
            `${BASE_URL}/${mediaType}/${movie.id}/videos?language=en-US`,
            {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                accept: "application/json",
            },
            }
        );

        const data = await res.json();

        const trailer = data.results?.find(
            (video) => video.site === "YouTube" && video.type === "Trailer"
        );

        if (trailer) {
            setSelectedTrailer(trailer.key);
        }
        } catch (err) {
        console.error("Failed to fetch trailer:", err);
        }
    };

    const handleMouseEnter = (movie, event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const previewWidth = 360;
        const sidePadding = 16;

        let left = rect.left + window.scrollX - 45;
        let top = rect.top + window.scrollY + previewOffsetY;

        const minLeft = sidePadding;
        const maxLeft = window.innerWidth - previewWidth - sidePadding;

        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        setHoveredMovie(movie);
        setHoverPosition({ top, left });

        fetchHoverTrailer(movie);
    };

    const closeHoverPreview = () => {
        setHoveredMovie(null);
        setHoverPosition(null);
        setHoverTrailer(null);
    };

    const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -600, behavior: "smooth" });
    };

    const scrollRight = () => {
        rowRef.current.scrollBy({ left: 600, behavior: "smooth" });
    };

  return (
    <section className="top-ten">
        <div className="top-ten__wrapper">
            <button className="row__arrow row__arrow--left" onClick={scrollLeft}>
            ❮
            </button>
            <h2 className="top-ten__title">{title}</h2>
            <div className="top-ten__items" ref={rowRef}>
                {items.map((item, index) => (
                    <div className={`top-ten__item ${index + 1 === 10 ? "top-ten__item--ten" : ""}`}
                    key={item.id}
                    onMouseEnter={(event) => handleMouseEnter(item, event)}
                    >
                        <RankNumber number={index + 1} />
                        <img className="top-ten__poster" src={`${IMAGE_BASE_URL}${item.poster_path}`} alt={item.title || item.name} />
                    </div>
                ))}
            </div>
            <button className="row__arrow row__arrow--right" onClick={scrollRight}>
                ❯
            </button>
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
        </div>
        <HoverPreview
            movie={hoveredMovie}
            position={hoverPosition}
            trailerKey={hoverTrailer}
            onClose={closeHoverPreview}
            onPlay={fetchTrailer}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
        />
    </section>
  )
}

export default TopTenRow