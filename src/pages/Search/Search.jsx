import React, { useEffect, useRef, useState } from "react";
import { useLists } from "../../context/ListContext";
import TitleCard from "../../components/TitleCard/TitleCard";
import HoverPreview from "../../components/Row/HoverPreview";
import "./Search.css";

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

const Search = () => {
  const { myList, favorites, addToMyList, addToFavorites } = useLists();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [hoverTrailer, setHoverTrailer] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`${BASE_URL}/trending/all/week?language=en-US`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            accept: "application/json",
          },
        });

        const data = await res.json();

        const filtered = (data.results || []).filter(
          (item) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            (item.backdrop_path || item.poster_path)
        );

        setTrending(filtered);
      } catch (error) {
        console.error("Trending search failed:", error);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const fetchSearchResults = async () => {
        setLoading(true);

        try {
          const movieRes = await fetch(
            `${BASE_URL}/search/movie?language=en-US&query=${encodeURIComponent(
              query.trim()
            )}&page=1&include_adult=false`,
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                accept: "application/json",
              },
            }
          );

          const tvRes = await fetch(
            `${BASE_URL}/search/tv?language=en-US&query=${encodeURIComponent(
              query.trim()
            )}&page=1&include_adult=false`,
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                accept: "application/json",
              },
            }
          );

          const movieData = await movieRes.json();
          const tvData = await tvRes.json();

          const movies = (movieData.results || []).map((item) => ({
            ...item,
            media_type: "movie",
          }));

          const tvShows = (tvData.results || []).map((item) => ({
            ...item,
            media_type: "tv",
          }));

          const combined = [...movies, ...tvShows]
            .filter(
              (item) =>
                (item.title || item.name) &&
                (item.backdrop_path || item.poster_path)
            )
            .sort((a, b) => b.popularity - a.popularity);

          setResults(combined);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }, 350);

    return () => clearTimeout(delaySearch);
  }, [query]);

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
    } catch (error) {
      console.error("Failed to fetch hover trailer:", error);
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
      } else {
        alert("No trailer found for this title.");
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
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
    let top = rect.top + window.scrollY - 45;

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

  const displayedItems = query.trim() ? results : trending;

  return (
    <main className="search-page">
      <section className="search-hero">
        <h1>Search titles</h1>

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search for movies, shows, genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {query && <button onClick={() => setQuery("")}>✕</button>}
        </div>
      </section>

      <section className="search-results">
        <h2>{query.trim() ? `Results for "${query}"` : "Trending Searches"}</h2>

        {loading ? (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        ) : displayedItems.length === 0 ? (
          <p className="search-empty">
            No results found. Try a different title.
          </p>
        ) : (
          <div className="search-grid" onMouseLeave={scheduleClosePreview}>
            {displayedItems.map((movie) => (
              <TitleCard
                key={`${movie.media_type}-${movie.id}`}
                movie={movie}
                onHover={handleCardHover}
              />
            ))}
          </div>
        )}
      </section>

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
    </main>
  );
};

export default Search;