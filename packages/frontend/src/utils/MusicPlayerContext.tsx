import { FC, ReactNode, createContext, useState } from "react";
import FrontUtilService from "./frontUtilService";
import { MediaCard } from "@/components/models/media";

interface MusicPlayed {
  mediaCard: MediaCard;
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
  isMusicPlayling: boolean;
  setIsMusicPlayling: (v: boolean) => void;
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
  const [isMusicPlayling, setIsMusicPlayling] = useState<boolean>(false);

  const fetchMusic = async (musicId: number): Promise<void> => {
    setIsLoading(true);
    const endpoint: string = '/media/getFile/' + musicId;
    const res: Blob = await FrontUtilService.getBlobFromApi(endpoint);
    const resMedia: any = await FrontUtilService.getDataFromApi(`/mediacard/media/${musicId}?withMedia=true`);
    if (res.size > 0) {
      const url = URL.createObjectURL(res);
      setMusic({
        mediaCard: resMedia,
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
             setPlaylistMode, setMusicMode, playlist, setPlaylistsMusics, 
             isMusicPlayling, setIsMusicPlayling }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export default MusicPlayerContext;
