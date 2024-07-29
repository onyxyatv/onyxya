import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext, useEffect, useRef, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { CircleX } from "lucide-react";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, MediaSrc } from '@vidstack/react';
import { Music } from "lucide-react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import FrontUtilService from "@/utils/frontUtilService";

interface volumeChangedProps {
  volume: number;
  muted: boolean;
}

const MusicPlayer = () => {
  const music = useContext(MusicPlayerContext)?.music;
  const isPlaylist: boolean | undefined = useContext(MusicPlayerContext)?.isPlaylist;
  const [visibility, setVisibility] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(0);  // if it's a playlist
  const playlist = useContext(MusicPlayerContext)?.playlist;
  const audioRefPlayer = useRef<AudioPlayer>(null);
  const isMusicPlayling = useContext(MusicPlayerContext)?.isMusicPlayling;
  const setIsMusicPlayling = useContext(MusicPlayerContext)?.setIsMusicPlayling;
  const randomMode: boolean | undefined = useContext(MusicPlayerContext)?.random;

  // Current volume on both sides, updated according to extended player or audio player.
  const [currentVolume, setCurrentVolume] = useState<number>(0.5);

  // Current song times, both on the extended side and here
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);

  // Indicates whether the extended is opened or not
  const [isExtendedOpen, setIsExtendedOpen] = useState(false);

  const playNextRandom = (): void => {
    if (playlist) {
      setCurrentMusic((currentMusic) => {
        let next: number = currentMusic;
        // To make sure you don't get the current one
        while (next === currentMusic) {
          next = Math.floor(Math.random() * playlist.length);
        }
        return next;
      });
    }
  }

  const handleClickNext = () => {
    if (playlist) {
      if (randomMode) {
        playNextRandom();
      } else {
        setCurrentMusic((currentMusic) =>
          currentMusic < playlist.length - 1 ? currentMusic + 1 : 0
        );
      }
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
      if (randomMode) {
        playNextRandom();
      } else {
        setCurrentMusic((currentMusic) =>
          currentMusic < playlist.length - 1 ? currentMusic + 1 : 0
        );
      }
    }
  }

  const handleOpenedState = (itemName: string) => {
    const isOpened: boolean = itemName.length > 0;
    const audio = audioRefPlayer.current?.audio.current;
    if (audioRefPlayer.current) {
      if (isOpened) {
        if (mediaPlayerRef.current && audio?.currentTime)
          mediaPlayerRef.current.currentTime = audio?.currentTime;
        setIsExtendedOpen(true);
        audio?.pause();
      } else {
        setIsExtendedOpen(false);
        if (isMusicPlayling && audio?.paused) {
          if (currentTime) audio.currentTime = currentTime;
          audio.play();
          if (setIsMusicPlayling) setIsMusicPlayling(true);
        }
      }
    }
  }

  //const music = useContext(MusicPlayerContext)?.music;
  const musicSrc = (music) ? music.src : '';
  const musicVideo: MediaSrc = { src: musicSrc, type: "video/mp4" };
  const mediaPlayerRef = useRef<MediaPlayerInstance>(null);
  //const isMusicPlayling = useContext(MusicPlayerContext)?.isMusicPlayling;
  //const setIsMusicPlayling = useContext(MusicPlayerContext)?.setIsMusicPlayling;

  const handleVolumeChanged = (infos: volumeChangedProps): void => {
    //props.setCurrentVolume(infos.volume);
    //if (infos.muted) props.setCurrentVolume(0);
  }

  const handleOnPause = (): void => {
    if (setIsMusicPlayling) setIsMusicPlayling(false);
  }

  const handleOnPlay = (e: any): void => {
    console.log(e);
    if (setIsMusicPlayling) setIsMusicPlayling(true);
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
            {/*<ExtendedMusicPlayer
              currentMusicTime={audioRefPlayer.current?.audio.current?.currentTime}
              setCurrentTime={setCurrentTime}
              setCurrentVolume={setCurrentVolume}
            />*/}
            <section className="z-40 flex h-[77vh] overflow-y-auto flex-row justify-between">
              <div className="flex h-full w-full flex-col">
                <div className="text-white p-2">
                  <h3 className="font-bold text-2xl">{music?.mediaCard.name}</h3>
                  <div className="text-base">
                    <p>
                      Description: {music?.mediaCard.description}
                    </p>
                    <p>
                      Release Date:
                      {
                        music?.mediaCard.releaseDate &&
                        ' ' + FrontUtilService.formatEuDate(music?.mediaCard.releaseDate)
                      }
                      {
                        !music?.mediaCard.releaseDate && ' No informations'
                      }
                    </p>
                  </div>
                </div>
                {
                  <MediaPlayer
                    ref={mediaPlayerRef}
                    //viewType="video"
                    //onTimeUpdate={handleOnTimeUpdate}
                    //onTimeChange={setCurrentTime}
                    //currentTime={currentTime}
                    title={music?.mediaCard.name}
                    //onPlay={handleOnPlay}
                    onPause={() => handleOnPause}
                    autoPlay={true}
                    //onVolumeChange={handleVolumeChanged}
                    className="m-2 max-w-screen-lg" src={musicVideo}
                  >
                    <MediaProvider />
                    <DefaultAudioLayout colorScheme="dark" icons={defaultLayoutIcons} smallLayoutWhen={true} />
                    <DefaultVideoLayout colorScheme="dark" icons={defaultLayoutIcons} smallLayoutWhen={false} />
                  </MediaPlayer>
                }
                {
                  !music &&
                  <Music />
                }
              </div>
              <div className="flex flex-col text-white">
                <h4 className="text-xl">Lyrics</h4>
              </div>
            </section>
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
              onPlay={handleOnPlay}
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