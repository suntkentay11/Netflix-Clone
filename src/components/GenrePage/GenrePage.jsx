import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Hero from '../Hero/Hero'
import Row from '../Row/Row'
import '../../pages/Section.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './GenrePage.css'
import { useLists } from '../../context/ListContext';

const genreNames = {
    18: 'Drama',
    10764: 'Reality',
    10759: 'Action',
    28: 'Action',
    10749: 'Romance',
    37: 'Western',
    27: 'Horror',
    35: 'Comedy',
    9648: 'Thriller',
    10765: 'Sci-Fi',
    878: 'Sci-Fi',
    80: 'Crime',
    99: 'Documentary',
    10762: 'Kids',
    10751: 'Kids',
};

const GenrePage = () => {
    const { myList, favorites, addToMyList, addToFavorites } = useLists();

    const { mediaType, genreId } = useParams();

    const genreTitle = genreNames[genreId] || 'Genre';

    const dateField = mediaType === 'tv' ? 'first_air_date' : 'release_date';

  return (
    <>
        <div className="section__header">
            <h2><Link to="/tv-shows" className='section__title--genres'>{mediaType} <FontAwesomeIcon icon="arrow-right" /></Link></h2>
            <h1>{genreTitle}</h1>
        </div>
        <Hero fetchUrl={`/discover/${mediaType}?with_genres=${genreId}&sort_by=popularity.desc`} />
        <div className="page_rows">
            <Row
            title={`Popular ${genreTitle}`}
            fetchUrl={`/discover/${mediaType}?with_genres=${genreId}&sort_by=popularity.desc`}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />

            <Row
            title={`Top Rated ${genreTitle}`}
            fetchUrl={`/discover/${mediaType}?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=100`}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />

            <Row
            title={`New ${genreTitle}`}
            fetchUrl={`/discover/${mediaType}?with_genres=${genreId}&sort_by=${dateField}.desc&${dateField}.lte=2026-05-06`}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
        </div>
    </>
  )
}

export default GenrePage