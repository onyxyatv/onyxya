import Header from "@/components/header/header";
import MoviePlayer from "@/components/movie/MoviePlayer";
import { useParams } from "react-router-dom";

const PlayMovie = () => {
  // Get the movie id from the URL (e.g. /movie/1)
  const { id } = useParams();

  return (
    <div>
      <Header />
      <h1>Play Movie {id}</h1>
      <MoviePlayer />
    </div>
  );
};

export default PlayMovie;
