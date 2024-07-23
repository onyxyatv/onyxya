import Header from "@/components/header/header";
import MoviePlayer from "@/components/movie/MoviePlayer";
import { useParams } from "react-router-dom";

const PlayMovie = () => {
  const { id } = useParams();

  return (
    <div>
      <Header />
      <MoviePlayer id={id} />
    </div>
  );
};

export default PlayMovie;
