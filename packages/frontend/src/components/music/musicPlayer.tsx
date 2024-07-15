import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext, useEffect, useRef, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ExtendedMusicPlayer from "./extendedMusicPlayer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const MusicPlayer = () => {
  const music = useContext(MusicPlayerContext)?.music;
  const isPlaylist: boolean | undefined = useContext(MusicPlayerContext)?.isPlaylist;
  const [visibility, setVisibility] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(0);
  const playlist = useContext(MusicPlayerContext)?.playlist;
  const refPlayer = useRef<AudioPlayer>(null);
  const [isPaused, setPaused] = useState(false);
  const [currentVolume, setCurrentVolume] = useState<number>(0.5);
  const audio = refPlayer.current?.audio.current;

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

  const handleOnPause = (e: object): void => {
    console.log(e);
    setPaused(true);
  }

  const handleOpenedState = (event: string) => {
    const isOpened: boolean = event.length > 0;
    const audio = refPlayer.current?.audio.current;
    if (refPlayer.current) {
      if (isOpened) {
        audio?.pause();
        setPaused(true);
      } else {
        audio?.play();
        setPaused(false);
      }
    }
  }

  useEffect(() => {
    if (music && music.src.length > 0) setVisibility(true);
    if (playlist && playlist.length > 0) setVisibility(true);
    
    if (audio && currentVolume !== audio?.volume) {
      audio?.volume = currentVolume;
    }
  }, [music, playlist, isPlaylist, currentVolume, audio]);

  return (
    (visibility && (music !== null || (playlist && isPlaylist))) &&
    <section className="bg-blue-400 p-2 flex flex-row fixed bottom-0 w-full justify-between">
      <Accordion className="w-full" onValueChange={handleOpenedState} type="single" collapsible>
        <AccordionItem value="item-1" className="border-0">
          <AccordionContent>
            <ExtendedMusicPlayer
              currentMusicTime={refPlayer.current?.audio.current?.currentTime}
              playStatus={isPaused}
              setCurrentVolume={setCurrentVolume}
            />
          </AccordionContent>
          <div className="w-full flex justify-between">
            <AudioPlayer
              autoPlay={true}
              src={(isPlaylist && playlist) ? playlist[currentMusic] : (music?.src) ? music.src : undefined}
              volume={currentVolume}
              onEnded={isPlaylist ? handleEnd : undefined}
              showSkipControls={isPlaylist ? true : false}
              onClickPrevious={isPlaylist ? handleClickPrevious : undefined}
              onClickNext={isPlaylist ? handleClickNext : undefined}
              onPlay={(e) => handleOnPlay(e)}
              onPause={handleOnPause}
              showFilledProgress={true}
              autoPlayAfterSrcChange={true}
              ref={refPlayer}
            />
            <AccordionTrigger className="bg-transparent">
            </AccordionTrigger>
          </div>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default MusicPlayer;