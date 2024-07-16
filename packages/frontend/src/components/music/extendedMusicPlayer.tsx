import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext, useEffect, useRef, useState } from "react";
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

interface ExtendedMplayerProps {
  currentMusicTime: number | undefined;
  playStatus: boolean | undefined;
  setCurrentVolume: (volume: number) => void;
  setCurrentTime: (time: number | undefined) => void;
  setPause: (v: boolean) => void;
}

interface volumeChangedProps {
  volume: number;
  muted: boolean;
}

const ExtendedMusicPlayer = (props: ExtendedMplayerProps) => {
  const music = useContext(MusicPlayerContext)?.music;
  const musicSrc = (music) ? music.src : '';
  const musicVideo: MediaSrc = { src: musicSrc, type: "video/mp4" };
  const [playStatus, setPlayStatus] = useState(false);
  const mediaPlayerRef = useRef<MediaPlayerInstance>(null);

  const handleVolumeChanged = (infos: volumeChangedProps): void => {
    props.setCurrentVolume(infos.volume);
    if (infos.muted) props.setCurrentVolume(0);
  }

  /*const handleOnTimeUpdate = (e: any): void => {
    console.log(e);
  }*/

  useEffect(() => {
    if (props.playStatus) setPlayStatus(true);
    if (mediaPlayerRef.current) props.setCurrentTime(mediaPlayerRef.current?.currentTime);
  }, [props.playStatus, mediaPlayerRef.current?.currentTime, props]);

  return (
    <section className="z-40 flex flex-row justify-between">
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
          music &&
          <div>
            {
              playStatus &&
              <MediaPlayer
                ref={mediaPlayerRef}
                viewType="video"
                //onTimeUpdate={handleOnTimeUpdate}
                onTimeChange={props.setCurrentTime}
                currentTime={props.currentMusicTime}
                title={music.mediaCard.name}
                onPause={() => props.setPause(true)}
                autoPlay={false}
                onVolumeChange={handleVolumeChanged}
                className="m-2 max-w-screen-lg" src={musicVideo}
              >
                <MediaProvider />
                <DefaultAudioLayout colorScheme="dark" icons={defaultLayoutIcons} smallLayoutWhen={true} />
                <DefaultVideoLayout colorScheme="dark" icons={defaultLayoutIcons} smallLayoutWhen={false} />
              </MediaPlayer>
            }
          </div>
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
  );
};

export default ExtendedMusicPlayer;