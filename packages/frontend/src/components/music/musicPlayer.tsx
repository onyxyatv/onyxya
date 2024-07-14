import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext, useEffect, useRef, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ExtendedMusicPlayer from "./extendedMusicPlayer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MusicPlayer = () => {
  const music = useContext(MusicPlayerContext)?.music;
  const isPlaylist: boolean | undefined = useContext(MusicPlayerContext)?.isPlaylist;
  const [visibility, setVisibility] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(0);
  const playlist = useContext(MusicPlayerContext)?.playlist;
  const refPlayer = useRef<AudioPlayer>(null);
  const [isPaused, setPaused] = useState(false);

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
    setPaused(false);
  }

  useEffect(() => {
    if (music && music.src.length > 0) setVisibility(true);
    if (playlist && playlist.length > 0) setVisibility(true);
  }, [music, playlist, isPlaylist]);

  return (
    (visibility && (music !== null || (playlist && isPlaylist))) &&
    <section className="bg-blue-400 p-2 flex flex-row fixed bottom-0 w-full justify-between">
      <div className="w-10/12">
        <AudioPlayer
          autoPlay={true}
          src={(isPlaylist && playlist) ? playlist[currentMusic] : (music?.src) ? music.src : undefined}
          volume={0.5}
          onEnded={isPlaylist ? handleEnd : undefined}
          showSkipControls={isPlaylist ? true : false}
          onClickPrevious={isPlaylist ? handleClickPrevious : undefined}
          onClickNext={isPlaylist ? handleClickNext : undefined}
          onPlay={(e) => handleOnPlay(e)}
          onPause={() => setPaused(true)}
          showFilledProgress={true}
          autoPlayAfterSrcChange={true}
          ref={refPlayer}
        />
      </div>
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Titre de la musique</SheetTitle>
            <SheetDescription>
              Description de la musique
            </SheetDescription>
          </SheetHeader>
          <ExtendedMusicPlayer 
            currentMusicTime={refPlayer.current?.audio.current?.currentTime} 
            isPaused={isPaused}
          />
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MusicPlayer;