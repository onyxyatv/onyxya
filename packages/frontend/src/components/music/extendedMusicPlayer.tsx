import MusicPlayerContext from "@/utils/MusicPlayerContext";
import { useContext } from "react";
import 'react-h5-audio-player/lib/styles.css';
import '@vidstack/react/player/styles/base.css';
import { MediaPlayer, MediaProvider, MediaSrc } from '@vidstack/react';
import { Music } from "lucide-react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

interface ExtendedMplayerProps {
  currentMusicTime: number | undefined;
}

const ExtendedMusicPlayer = (props: ExtendedMplayerProps) => {
  const music = useContext(MusicPlayerContext)?.music;
  const musicSrc = (music) ? music.src : '';
  const test: MediaSrc = { src: musicSrc, type: "video/mp4" };

  return (
    <section>
      {
        music &&
        <div className="bg-red-300">
          <MediaPlayer viewType="video" currentTime={props.currentMusicTime} volume={0} title="Titre" autoPlay={true} 
          className="m-2" src={[test]}>
            <MediaProvider />
            <DefaultAudioLayout icons={defaultLayoutIcons} />
            <DefaultVideoLayout icons={defaultLayoutIcons} />
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