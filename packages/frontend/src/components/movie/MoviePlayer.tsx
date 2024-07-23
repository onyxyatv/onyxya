import FrontUtilService from "@/utils/frontUtilService";
import { MediaCard } from "@common/validation/media/mediaCard.schema";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { useEffect, useState } from "react";

type MoviePlayerProps = {
  id: string | undefined;
};

const MoviePlayer = (props: MoviePlayerProps) => {
  const [movie, setMovie] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaCard | null>(null);

  useEffect(() => {
    if (!props.id) {
      return;
    }
    getMovie(props.id).then((data) => {
      setMovie(data);
    });

    getMedia(props.id).then((data) => {
      setMedia(data);
    });
  }, [props.id]);

  const getMovie = async (id: string) => {
    const data = FrontUtilService.fetchMusic(Number(id));
    return data;
  };

  const getMedia = async (id: string) => {
    const data = FrontUtilService.getDataFromApi("/mediacard/media/" + id);
    console.log(data);
    return data;
  };

  if (!movie) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>{media?.name}</h1>
      <p>{media?.description}</p>
      <p>{media?.category}</p>
      {movie.length && (
        <MediaPlayer
          src={{
            src: movie,
            type: "video/mp4",
          }}
          viewType="video"
          className="m-2 max-w-screen-lg"
        >
          <MediaProvider />
          <DefaultVideoLayout colorScheme="dark" icons={defaultLayoutIcons} />
        </MediaPlayer>
      )}
    </div>
  );
};

export default MoviePlayer;
