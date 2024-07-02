import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext, useEffect, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MusicPlayer = () => {
  const music = useContext(MusicPlayerContext)?.music;
  const isPlaylist: boolean | undefined = useContext(MusicPlayerContext)?.isPlaylist;
  const [visibility, setVisibility] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(0);
  const playlist = useContext(MusicPlayerContext)?.playlist;

  const handleClickNext = () => {
    if (playlist) {
      setCurrentMusic((currentMusic) =>
        currentMusic < playlist.length - 1 ? currentMusic + 1 : 0
      );
    }
  };

  const handleEnd = () => {
    if (playlist) {
      setCurrentMusic((currentMusic) =>
        currentMusic < playlist.length - 1 ? currentMusic + 1 : 0
      );
    }
  }

  useEffect(() => {
    if (music && music.length > 0) setVisibility(true);
    if (playlist && playlist.length > 0) setVisibility(true);
  }, [music, playlist, isPlaylist]);

  return (
    (visibility && (music !== null || (playlist && isPlaylist))) &&
    <section className="bg-blue-400 p-2 flex flex-row fixed bottom-0 w-full justify-center" >
      <div className="w-10/12">
        <AudioPlayer
          autoPlay={true}
          src={(isPlaylist && playlist) ? playlist[currentMusic] : (music) ? music : undefined}
          volume={0.5}
          onEnded={isPlaylist ? handleEnd : undefined}
          showSkipControls={isPlaylist ? true : false}
          onClickNext={isPlaylist ? handleClickNext : undefined}
          onPlay={(e) => console.log("onPlay", e)}
        />
      </div>
    </section>
  );
};

export default MusicPlayer;