import Header from "@/components/header/header";
import NewPlaylistPopup from "@/components/playlists/newPlaylist";
import SeriesList from "@/components/series/seriesList";
import { useState } from "react";

const Series = () => {
  const [reloadSeries, setReloadSeries] = useState(false);

  return (
    <div>
      <Header />
      <section className="p-2">
        <NewPlaylistPopup 
          reloadPlaylists={setReloadSeries}
          playlistType='serie'
        />
        <SeriesList 
          setPlaylistsReload={setReloadSeries} 
          needPlaylistsReload={reloadSeries}
        />
      </section>
    </div>
  );
};

export default Series;