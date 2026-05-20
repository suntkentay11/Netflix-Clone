import React from "react";
import { useState, useRef } from "react";
import { useLists } from "../../context/ListContext";
import TitleCard from "../../components/TitleCard/TitleCard";
import "./MyList.css";
import HoverPreview from "../../components/Row/HoverPreview";

const MyList = () => {
  const { myList, favorites, addToMyList, addToFavorites } = useLists();
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [hoverTrailer, setHoverTrailer] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const closeTimeoutRef = useRef(null);
  const previewOffsetY = -35;

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

  return (
    <div className="mylist">
      <div className="mylist__header">
        <h1>My List</h1>
      </div>

      {myList.length === 0 ? (
        <p className="mylist__empty">Your list is empty.</p>
      ) : (
        <div className="mylist__grid" onMouseLeave={scheduleClosePreview}>
          {myList.map((movie) => (
            <TitleCard
              key={movie.id}
              movie={movie}
              myList={myList}
              favorites={favorites}
              addToMyList={addToMyList}
              addToFavorites={addToFavorites}
              previewOffsetY={-35}
              onHover={handleCardHover}
            />
          ))}
        </div>
      )}
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
    </div>
  );
};

export default MyList;