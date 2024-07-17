import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext, useEffect, useRef, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ExtendedMusicPlayer from "./extendedMusicPlayer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { CircleX } from "lucide-react";

const MusicPlayer = () => {
  const music = useContext(MusicPlayerContext)?.music;
  const isPlaylist: boolean | undefined = useContext(MusicPlayerContext)?.isPlaylist;
  const [visibility, setVisibility] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(0);  // if it's a playlist
  const playlist = useContext(MusicPlayerContext)?.playlist;
  const audioRefPlayer = useRef<AudioPlayer>(null);
  const isMusicPlayling = useContext(MusicPlayerContext)?.isMusicPlayling;
  const setIsMusicPlayling = useContext(MusicPlayerContext)?.setIsMusicPlayling;

  // Current volume on both sides, updated according to extended player or audio player.
  const [currentVolume, setCurrentVolume] = useState<number>(0.5);

  // Current song times, both on the extended side and here
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);

  // Indicates whether the extended is opened or not
  const [isExtendedOpen, setIsExtendedOpen] = useState(false);

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
      const audio = audioRefPlayer.current?.audio.current;
      if (!previous && audio) {
        audio.currentTime = 0;
        audio.play();
      }
    }
  };

  // Goes to the next music or restarts the playlist if it is finished
  const handleEnd = (): void => {
    if (playlist) {
      setCurrentMusic((currentMusic) =>
        currentMusic < playlist.length - 1 ? currentMusic + 1 : 0
      );
    }
  }

  const handleOnPlay = (): void => {
    if (setIsMusicPlayling) setIsMusicPlayling(true);
  };

  const handleOnPause = (): void => {
    if (setIsMusicPlayling) setIsMusicPlayling(false);
  };

  const handleOpenedState = (itemName: string) => {
    const isOpened: boolean = itemName.length > 0;
    const audio = audioRefPlayer.current?.audio.current;
    if (audioRefPlayer.current) {
      if (isOpened) {
        setIsExtendedOpen(true);
        audio?.pause();
      } else {
        setIsExtendedOpen(false);
        if (isMusicPlayling && audio?.paused) {
          audio.play();
          if (setIsMusicPlayling) setIsMusicPlayling(true);
        }
      }
    }
  }

  useEffect(() => {
    // Checks to see if a song or playlist is playing
    if (music && music.src.length > 0) setVisibility(true);
    if (playlist && playlist.length > 0) setVisibility(true);

    const audio = audioRefPlayer.current?.audio.current;
    if (audio) {
      if (currentVolume !== audio.volume) audio.volume = currentVolume;
      if (currentTime !== audio.currentTime) audio.currentTime = currentTime ? currentTime : 0;
    }
  }, [music, playlist, isPlaylist, currentVolume, currentTime]);

  return (
    (visibility && (music !== null || (playlist && isPlaylist))) &&
    <section className="bg-gray-800 p-2 z-40 flex flex-row fixed bottom-0 w-full justify-between">
      <Accordion className="w-full" onValueChange={handleOpenedState} type="single" collapsible>
        <AccordionItem value="item-1" className="border-0">
          <div className="mb-2 flex w-full text-white justify-end">
            <CircleX 
              className="hover:cursor-pointer h-6 hover:text-red-500" 
              onClick={() => setVisibility(false)}
            />
          </div>
          <AccordionContent>
            <ExtendedMusicPlayer
              currentMusicTime={audioRefPlayer.current?.audio.current?.currentTime}
              setCurrentTime={setCurrentTime}
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
              onPlay={() => handleOnPlay()}
              onPause={handleOnPause}
              showFilledProgress={true}
              autoPlayAfterSrcChange={true}
              ref={audioRefPlayer}
              {...isExtendedOpen ? { customVolumeControls: [] } : {}}
            />
            <AccordionTrigger className="bg-white ml-2 w-8 flex justify-center">
            </AccordionTrigger>
          </div>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default MusicPlayer;