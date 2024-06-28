import Header from "@/components/header/header";
import MusicsLists from "@/components/music/musicsList";
import FrontUtilService from "@/utils/frontUtilService";
import { useEffect, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const Music = () => {
  const [music, setMusic] = useState('');

  const fetchMusic = (async (musicId: number) => {
    const endpoint: string = '/media/getFile/' + musicId;
    const res: Blob = await FrontUtilService.getBlobFromApi(endpoint);
    if (res.size > 0) {
      const url = URL.createObjectURL(res);
      setMusic(url);
    }
  });

  useEffect(() => {
  }, []);

  return (
    <div>
      <Header />

      <section>
        <MusicsLists playMusic={(musicId: number) => fetchMusic(musicId)} />
      </section>

      <section className="bg-blue-400 p-2 flex flex-row fixed bottom-0 w-full justify-center">
        <div className="w-10/12">
          {
            music !== null &&
            <AudioPlayer
              autoPlay={false}
              src={music}
              volume={0.5}
              onPlay={(e) => console.log("onPlay", e)}
            />
          }
        </div>
      </section>
    </div>
  );
};

export default Music;