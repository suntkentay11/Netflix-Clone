import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const HoverPreview = ({
  movie,
  position,
  trailerKey,
  onClose,
  onPlay,
  myList = [],
  favorites = [],
  addToMyList,
  addToFavorites,
}) => {
  if (!movie || !position) return null;

  const isInMyList = myList.some((item) => item.id === movie.id);
  const isFavorite = favorites.some((item) => item.id === movie.id);

  return (
    <div
      className="hover-preview"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseLeave={onClose}
    >
      {trailerKey ? (
        <iframe
          className="hover-preview__video"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0`}
          title={movie.title || movie.name}
          allow="autoplay; encrypted-media"
        ></iframe>
      ) : (
        <img
          className="hover-preview__image"
          src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title || movie.name}
        />
      )}

      <div className="hover-preview__info">
        <div className="hover-preview__buttons">
          <button onClick={() => onPlay(movie)}>▶</button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              addToMyList(movie);
            }}
          >
            {isInMyList ? "✓" : "+"}
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              addToFavorites(movie);
            }}
          >
            {isFavorite ? "♥" : "♡"}
          </button>

          <button><FontAwesomeIcon icon="angle-down" /></button>
        </div>

        <div className="hover-preview__meta">
          <span>HD</span>
          <span>
            {movie.release_date?.slice(0, 4) ||
              movie.first_air_date?.slice(0, 4)}
          </span>
        </div>

        <h3>{movie.title || movie.name}</h3>
        <p>{movie.overview?.slice(0, 100)}...</p>
      </div>
    </div>
  );
};

export default HoverPreview;