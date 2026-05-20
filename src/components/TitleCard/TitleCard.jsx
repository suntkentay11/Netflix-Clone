import React from "react";
import "./TitleCard.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const TitleCard = ({ movie, isLargeRow = false, onHover }) => {
  const imagePath = isLargeRow
    ? movie.poster_path
    : movie.backdrop_path || movie.poster_path;

  if (!imagePath) return null;

  return (
    <div
      className={`title-card ${isLargeRow ? "title-card--large" : ""}`}
      onMouseEnter={(event) => onHover(movie, event)}
    >
      <img
        className={`title-card__image ${
          isLargeRow ? "title-card__image--large" : ""
        }`}
        src={`${IMAGE_BASE_URL}${imagePath}`}
        alt={movie.title || movie.name}
      />
    </div>
  );
};

export default TitleCard;