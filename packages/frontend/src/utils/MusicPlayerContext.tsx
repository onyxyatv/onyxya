import { FC, ReactNode, createContext, useState } from "react";
import FrontUtilService from "./frontUtilService";

interface MusicPlayed {
  mediaId: number;
  src: string;
}

interface MusicPlayerContextT {
  music: MusicPlayed | null;
  fetchMusic: (musicId: number) => void;
  isLoading: boolean;
  isPlaylist: boolean;
  setPlaylistMode: () => void;
  setMusicMode: () => void;
  playlist: Array<string>;
  setPlaylistsMusics: (list: Array<string>) => void;
}

interface MusicPlayerProps {
  children: ReactNode;
}

const MusicPlayerContext = createContext<MusicPlayerContextT | undefined>(undefined);

export const MusicPlayerProvider: FC<MusicPlayerProps> = ({ children }) => {
  const [music, setMusic] = useState<MusicPlayed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState<Array<string>>([]);

  const fetchMusic = async (musicId: number): Promise<void> => {
    console.log('called fetch music :', musicId);
    setIsLoading(true);
    const endpoint: string = '/media/getFile/' + musicId;
    const res: Blob = await FrontUtilService.getBlobFromApi(endpoint);
    if (res.size > 0) {
      const url = URL.createObjectURL(res);
      setMusic({
        mediaId: musicId,
        src: url
      });
    }
    setIsLoading(false);
  };

  const setPlaylistMode = (): void => setIsPlaylist(true);

  const setMusicMode = (): void => setIsPlaylist(false);

  const setPlaylistsMusics = (list: Array<string>): void => setPlaylist(list);

  return (
    <MusicPlayerContext.Provider 
    value={{ music, fetchMusic, isLoading, isPlaylist, 
             setPlaylistMode, setMusicMode, playlist, setPlaylistsMusics }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export default MusicPlayerContext;
