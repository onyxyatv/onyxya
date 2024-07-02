import Header from "@/components/header/header";
import MusicsLists from "@/components/music/musicsList";
import MusicsPlaylistMenu from "@/components/music/musicsPlaylistMenu";
import 'react-h5-audio-player/lib/styles.css';

const Music = () => {
  return (
    <div>
      <Header />
      <section className="flex justify-start p-2">
        <MusicsPlaylistMenu />
        <MusicsLists />
      </section>
    </div>
  );
};

export default Music;