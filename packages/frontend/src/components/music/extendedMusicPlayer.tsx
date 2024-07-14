import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext, useEffect, useState } from "react";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, MediaSrc } from '@vidstack/react';
import { Music } from "lucide-react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  //DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

interface ExtendedMplayerProps {
  currentMusicTime: number | undefined;
  isPaused: boolean | undefined;
}

const ExtendedMusicPlayer = (props: ExtendedMplayerProps) => {
  const music = useContext(MusicPlayerContext)?.music;
  const musicSrc = (music) ? music.src : '';
  const musicVideo: MediaSrc = { src: musicSrc, type: "video/mp4" };
  const [paused, setPause] = useState<boolean | undefined>(props.isPaused);

  useEffect(() => {
    setPause(props.isPaused);
  }, [props.isPaused]);

  return (
    <section>
      {
        music &&
        <div className="bg-red-300">
          <MediaPlayer 
            paused={paused}
            viewType="video" 
            currentTime={props.currentMusicTime} 
            volume={0} title="Titre"
            autoPlay={true} 
            className="m-2 max-w-screen-lg" src={musicVideo}
          >
            <MediaProvider />
            <DefaultAudioLayout colorScheme="dark" icons={defaultLayoutIcons} smallLayoutWhen={true} />
            { /* <DefaultVideoLayout colorScheme="dark" icons={defaultLayoutIcons} smallLayoutWhen={false} /> */}
          </MediaPlayer>
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