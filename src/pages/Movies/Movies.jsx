import Hero from '../../components/Hero/Hero'
import Row from '../../components/Row/Row'
import '../Section.css'
import { useNavigate } from 'react-router-dom'
import { useLists } from '../../context/ListContext';
import TopTenRow from '../../components/TopTenRow/TopTenRow';

const movieGenres = [
    { id: 18, name: 'Drama' },
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 10749, name: 'Romance' },
    { id: 37, name: 'Western' },
    { id: 27, name: 'Horror' },
    { id: 878, name: 'Sci-Fi' },
    { id: 99, name: 'Documentary' },
    { id: 10751, name: 'Kids' },
];

const Movies = () => {
    const { myList, favorites, addToMyList, addToFavorites } = useLists();

    const navigate = useNavigate();

    const handleGenreChange = (e) => {
        const selectedId = e.target.value;
        const selectedGenre = movieGenres.find((genre) => genre.id.toString() === selectedId);

        if (!selectedGenre) return;

        const slug = selectedGenre.name.toLowerCase().replaceAll(" ", "-");
        navigate(`/genre/movie/${selectedGenre.id}/${slug}`);
    };
  return (
    <div>
        <div className="section__header">
            <h1 className="section__title">Movies</h1>
            <select defaultValue="" className="genre__select" onChange={handleGenreChange}>
                <option value="" disabled>Genres</option>

                {movieGenres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
        <Hero fetchUrl="/movie/popular?language=en-US&page=1" />
        <div className="page_rows">
            {myList.length > 0 && (
            <Row
                title="My List"
                customMovies={myList}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            )}

            {favorites.length > 0 && (
            <Row
                title="Favorites"
                customMovies={favorites}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            )}
            <Row title="Trending Movies" fetchUrl="/trending/movie/week?language=en-US&page=1" previewOffsetY={0} 
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Top Rated Movies" fetchUrl="/movie/top_rated?language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <TopTenRow title="Top 10 Movies in the US Today" fetchUrl="/trending/movie/day?language=en-US&page=1" previewOffsetY={0} myList={myList} favorites={favorites} addToMyList={addToMyList} addToFavorites={addToFavorites} />
            <Row title="Drama Movies" fetchUrl="/discover/movie?with_genres=18&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Action Movies" fetchUrl="/discover/movie?with_genres=28&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Comedy Movies" fetchUrl="/discover/movie?with_genres=35&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Romance Movies" fetchUrl="/discover/movie?with_genres=10749&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Western Movies" fetchUrl="/discover/movie?with_genres=37&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Horror Movies" fetchUrl="/discover/movie?with_genres=27&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Sci-Fi Movies" fetchUrl="/discover/movie?with_genres=878&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Documentaries" fetchUrl="/discover/movie?with_genres=99&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
            <Row title="Kids Movies" fetchUrl="/discover/movie?with_genres=10751&language=en-US&page=1" previewOffsetY={0}
            myList={myList}
            favorites={favorites}
            addToMyList={addToMyList}
            addToFavorites={addToFavorites}
            />
        </div>
    </div>
  )
}

export default Movies