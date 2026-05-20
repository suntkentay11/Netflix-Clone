import React, { useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import Row from "../../components/Row/Row";
import Navbar from "../../components/NavBar/Navbar";
import { useLists } from "../../context/ListContext";
import "./Home.css";
import TopTenRow from "../../components/TopTenRow/TopTenRow";

const Home = () => {
  const { myList, favorites, addToMyList, addToFavorites } = useLists();

  const listProps = {
    myList,
    favorites,
    addToMyList,
    addToFavorites,
  };

  return (
    <>
      <Navbar />
      <Hero />

      <div className="home__rows">
        {myList.length > 0 && (
          <Row
            title="My List"
            customMovies={myList}
            {...listProps}
            previewOffsetY={-675}
          />
        )}

        {favorites.length > 0 && (
          <Row
            title="Favorites"
            customMovies={favorites}
            {...listProps}
            previewOffsetY={-675}
          />
        )}

        <Row
          title="Netflix Originals"
          fetchUrl="/discover/tv?with_networks=213"
          isLargeRow
          {...listProps}
          previewOffsetY={-675}
        />

        <Row
          title="Trending Now"
          fetchUrl="/trending/movie/week"
          {...listProps}
          previewOffsetY={-675}
        />

        <Row
          title="Top Rated"
          fetchUrl="/movie/top_rated"
          {...listProps}
          previewOffsetY={-675}
        />

        <TopTenRow 
          title="Top 10 Movies in the US Today" 
          fetchUrl="/trending/movie/day?language=en-US&page=1" 
          previewOffsetY={-675}
          {...listProps}
        />

        <TopTenRow 
          title="Top 10 TV Shows in the US Today" 
          fetchUrl="/trending/tv/day?language=en-US&page=1" 
          previewOffsetY={-675}
          {...listProps}
        />

        <Row
          title="Action Movies"
          fetchUrl="/discover/movie?with_genres=28"
          {...listProps}
          previewOffsetY={-675}
        />

        <Row
          title="Comedy Movies"
          fetchUrl="/discover/movie?with_genres=35"
          {...listProps}
          previewOffsetY={-675}
        />

        <Row
          title="Horror Movies"
          fetchUrl="/discover/movie?with_genres=27"
          {...listProps}
          previewOffsetY={-675}
        />

        <Row
          title="Romance Movies"
          fetchUrl="/discover/movie?with_genres=10749"
          {...listProps}
          previewOffsetY={-675}
        />

        <Row
          title="Documentaries"
          fetchUrl="/discover/movie?with_genres=99"
          {...listProps}
          previewOffsetY={-675}
        />
      </div>
    </>
  );
};

export default Home;