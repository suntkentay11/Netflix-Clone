import React, { useEffect, useRef, useState } from "react";
import "./Row.css";
import TitleCard from "../TitleCard/TitleCard";
import HoverPreview from "./HoverPreview";

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

const Row = ({
  title,
  fetchUrl,
  isLargeRow = false,
  customMovies,
  myList = [],
  favorites = [],
  addToMyList,
  addToFavorites,
  previewOffsetY = -70,
}) => {
  const [movies, setMovies] = useState([]);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [hoverTrailer, setHoverTrailer] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const rowRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    if (customMovies) {
      setMovies(customMovies);
      return;
    }

    const fetchMovies = async () => {
      try {
        const res = await fetch(`${BASE_URL}${fetchUrl}`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            accept: "application/json",
          },
        });

        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching row movies:", err);
      }
    };

    fetchMovies();
  }, [fetchUrl, customMovies]);

  const getMediaType = (movie) => {
    return movie.media_type || (movie.first_air_date ? "tv" : "movie");
  };

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

  const handleCardHover = (movie, event) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

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

  const scheduleClosePreview = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredMovie(null);
      setHoverPosition(null);
      setHoverTrailer(null);
    }, 180);
  };

  const cancelClosePreview = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    rowRef.current.scrollBy({ left: 500, behavior: "smooth" });
  };

  return (
    <>
      <div className="row">
        <h2>{title}</h2>

        <div className="row__wrapper" onMouseLeave={scheduleClosePreview}>
          <button className="row__arrow row__arrow--left" onClick={scrollLeft}>
            ❮
          </button>

          <div className="row__posters" ref={rowRef}>
            {movies.map((movie) => (
              <TitleCard
                key={movie.id}
                movie={movie}
                isLargeRow={isLargeRow}
                onHover={handleCardHover}
              />
            ))}
          </div>

          <button className="row__arrow row__arrow--right" onClick={scrollRight}>
            ❯
          </button>
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
      </div>

      <div onMouseEnter={cancelClosePreview} onMouseLeave={scheduleClosePreview}>
        <HoverPreview
          movie={hoveredMovie}
          position={hoverPosition}
          trailerKey={hoverTrailer}
          onClose={scheduleClosePreview}
          onPlay={fetchTrailer}
          myList={myList}
          favorites={favorites}
          addToMyList={addToMyList}
          addToFavorites={addToFavorites}
        />
      </div>
    </>
  );
};

export default Row;