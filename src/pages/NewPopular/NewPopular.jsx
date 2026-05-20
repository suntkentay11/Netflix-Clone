import React from 'react'
import Row from '../../components/Row/Row'
import './NewPopular.css'
import TopTenRow from '../../components/TopTenRow/TopTenRow'
import { useLists } from '../../context/ListContext';

const NewPopular = () => {
  const { myList, favorites, addToMyList, addToFavorites } = useLists();
  return (
    <div>
        <div className="page__rows">
            <Row title="New on Netflix" fetchUrl="/movie/now_playing?language=en-US&page=1" previewOffsetY={0} />
            <TopTenRow title="Top 10 Movies in the US Today" fetchUrl="/trending/movie/day?language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites} />
            <TopTenRow title="Top 10 TV Shows in the US Today" fetchUrl="/trending/tv/day?language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites} />
        </div>
    </div>
  )
}

export default NewPopular