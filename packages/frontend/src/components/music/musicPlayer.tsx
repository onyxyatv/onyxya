import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext, useEffect, useRef, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MusicPlayer = () => {
  const music = useContext(MusicPlayerContext)?.music;
  const isPlaylist: boolean | undefined = useContext(MusicPlayerContext)?.isPlaylist;
  const [visibility, setVisibility] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(0);
  const playlist = useContext(MusicPlayerContext)?.playlist;
  const refPlayer = useRef<AudioPlayer>(null);

  const handleClickNext = () => {
    if (playlist) {
      setCurrentMusic((currentMusic) =>
        currentMusic < playlist.length - 1 ? currentMusic + 1 : 0
      );
    }
  };

  const handleClickPrevious = () => {
    if (playlist) {
      const previous = currentMusic > 0 ? currentMusic - 1 : 0;
      setCurrentMusic(previous);
      const audio = refPlayer.current?.audio.current;
      if (!previous && audio) {
        console.log('ee');
        audio.currentTime = 0;
        audio.play();
      }
    }
  };

  const handleEnd = () => {
    if (playlist) {
      setCurrentMusic((currentMusic) =>
        currentMusic < playlist.length - 1 ? currentMusic + 1 : 0
      );
    }
  }

  const handleOnPlay = (e: object) => {
    console.log(e);
    console.log(refPlayer.current);
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
          onClickPrevious={isPlaylist ? handleClickPrevious : undefined}
          onClickNext={isPlaylist ? handleClickNext : undefined}
          onPlay={(e) => handleOnPlay(e)}
          showFilledProgress={true}
          autoPlayAfterSrcChange={true}
          ref={refPlayer}
        />
      </div>
    </section>
  );
};

export default MusicPlayer;