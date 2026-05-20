import Hero from '../../components/Hero/Hero'
import Row from '../../components/Row/Row'
import MyList from '../MyList/MyList';
import '../Section.css'
import { useNavigate } from 'react-router-dom'
import { useLists } from '../../context/ListContext';
import TopTenRow from '../../components/TopTenRow/TopTenRow';

const tvGenres = [
    { id: 18, name: 'Drama' },
    { id: 10764, name: 'Reality' },
    { id: 10759, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 9648, name: 'Thriller' },
    { id: 10765, name: 'Sci-Fi' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 10762, name: 'Kids' },
];

const TVShows = () => {
    const { myList, favorites, addToMyList, addToFavorites } = useLists();

    const navigate = useNavigate();

    const handleGenreChange = (e) => {
        const selectedId = e.target.value;
        const selectedGenre = tvGenres.find((genre) => genre.id.toString() === selectedId);

        if (!selectedGenre) return;

        const slug = selectedGenre.name.toLowerCase().replaceAll(" ", "-");
        navigate(`/genre/tv/${selectedGenre.id}/${slug}`);
    };
  return (
    <div>
        <div className="section__header">
            <h1 className="section__title">TV Shows</h1>
            <select defaultValue="" className="genre__select" onChange={handleGenreChange}>
                <option value="" disabled>Genres</option>

                {tvGenres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
        <Hero fetchUrl="/tv/popular?language=en-US&page=1" />
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
            <Row 
                title="Trending TV Shows" 
                fetchUrl="/trending/tv/week?language=en-US&page=1" previewOffsetY={0} 
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
                />
            <Row title="Top Rated TV Shows" fetchUrl="/tv/top_rated?language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <TopTenRow title="Top 10 TV Shows in the US Today" fetchUrl="/trending/tv/day?language=en-US&page=1" previewOffsetY={0} myList={myList} favorites={favorites} addToMyList={addToMyList} addToFavorites={addToFavorites} />
            <Row title="Drama TV Shows" fetchUrl="/discover/tv?with_genres=18&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <Row title="Reality TV Shows" fetchUrl="/discover/tv?with_genres=10764&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <Row title="Action TV Shows" fetchUrl="/discover/tv?with_genres=10759&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <Row title="Comedy TV Shows" fetchUrl="/discover/tv?with_genres=35&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <Row title="Crime" fetchUrl="/discover/tv?with_genres=80&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <Row title="Thriller TV Shows" fetchUrl="/discover/tv?with_genres=9648&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <Row title="Sci-Fi TV Shows" fetchUrl="/discover/tv?with_genres=10765&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <Row title="Documentaries" fetchUrl="/discover/tv?with_genres=99&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
            <Row title="Kids TV Shows" fetchUrl="/discover/tv?with_genres=10762&language=en-US&page=1" previewOffsetY={0}
                myList={myList}
                favorites={favorites}
                addToMyList={addToMyList}
                addToFavorites={addToFavorites}
            />
        </div>
    </div>
  )
}

export default TVShows