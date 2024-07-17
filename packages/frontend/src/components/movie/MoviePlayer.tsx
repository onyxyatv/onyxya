import { MediaPlayer, MediaProvider } from "@vidstack/react";

const MoviePlayer = () => {
  return (
    <MediaPlayer src="" viewType="video" autoPlay={true}>
      <MediaProvider />
    </MediaPlayer>
  );
}

export default MoviePlayer;