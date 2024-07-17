import FrontUtilService from "@/utils/frontUtilService";
import { MediaPlayer, MediaProvider, MediaSrc } from "@vidstack/react";
import { useState } from "react";

type MoviePlayerProps = {
  id: string;
};

const MoviePlayer = ({ id }): MoviePlayerProps => {

  // State
  const [movie, setMovie] = useState<MediaSrc | undefined>(undefined);

  // Get the media from the mediaCard id
  const getMovie = async (id) => {
    try {
      const data = FrontUtilService.getDataFromApi(`/media/${id}`);
    }
  };



  return (
    <MediaPlayer src="" viewType="video" autoPlay={true}>
      <MediaProvider />
    </MediaPlayer>
  );
}

export default MoviePlayer;

function getDataFromApi(arg0: string) {
  throw new Error("Function not implemented.");
}
