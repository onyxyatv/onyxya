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

  const handleVolumeChanged = (infos: volumeChangedProps):void => {
    props.setCurrentVolume(infos.volume);
    if (infos.muted) props.setCurrentVolume(0);
  }

  useEffect(() => {
    if (props.playStatus) setPlayStatus(true);
  }, [props.playStatus]);

  return (
    <section className="z-50 bg-gray-400">
      <div>
        <h3>{music?.mediaCard.name}</h3>
        <div>
          Description: {music?.mediaCard.description}
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
              currentTime={props.currentMusicTime}
              title={music.mediaCard.name}
              autoPlay={true}
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
    </section>
  );
};

export default ExtendedMusicPlayer;