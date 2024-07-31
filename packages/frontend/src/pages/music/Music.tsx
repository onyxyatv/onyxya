import Header from "@/components/header/header";
import MusicsLists from "@/components/music/musicsList";
import MusicsPlaylistMenu from "@/components/music/musicsPlaylistMenu";
import { useState } from "react";
import 'react-h5-audio-player/lib/styles.css';

const Music = () => {
  const [needPlaylistsReload, setPlaylistsReload] = useState<boolean>(false);

  return (
    <div>
      <Header />
      <section className="flex justify-start p-2">
        <MusicsPlaylistMenu 
          setPlaylistsReload={setPlaylistsReload} 
          needPlaylistsReload={needPlaylistsReload}
        />
        <MusicsLists 
          setPlaylistsReload={setPlaylistsReload} 
          needPlaylistsReload={needPlaylistsReload}
        />
      </section>
    </div>
  );
};

export default Music;