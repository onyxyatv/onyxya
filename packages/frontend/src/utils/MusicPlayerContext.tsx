import { FC, ReactNode, createContext, useState } from "react";
import FrontUtilService from "./frontUtilService";
import { MediaCard } from "@/components/models/media";
import { HttpStatusCode } from "axios";

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
  playlist: Array<number>;
  setPlaylistsMusics: (list: Array<number>) => void;
  isMusicPlayling: boolean;
  setIsMusicPlayling: (v: boolean) => void;
  random: boolean;
  setRandomMode: (v: boolean) => void;
  finishMediaStream: () => void;
}

interface MusicPlayerProps {
  children: ReactNode;
}

const MusicPlayerContext = createContext<MusicPlayerContextT | undefined>(undefined);

export const MusicPlayerProvider: FC<MusicPlayerProps> = ({ children }) => {
  const [music, setMusic] = useState<MusicPlayed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState<Array<number>>([]);
  const [isMusicPlayling, setIsMusicPlayling] = useState<boolean>(false);
  const [random, setRandomMode] = useState<boolean>(false);
  const [musicId, setMusicId] = useState<number>(0);

  const fetchMusic = async (localMusicId: number): Promise<void> => {
    setIsLoading(true);
    setMusicId(localMusicId);
    const endpoint: string = '/media/getFile/' + localMusicId;
    //const res: Blob = await FrontUtilService.getBlobFromApi(endpoint);
    const res: any = await FrontUtilService.getDataFromApi(endpoint);
    console.log(res);
    const resMedia: any = await FrontUtilService.getDataFromApi(`/mediacard/media/${localMusicId}?withMedia=true`);
    //if (res.size > 0) {
      //const url = URL.createObjectURL(res); 
      setMusic({
        mediaCard: resMedia,
        src: FrontUtilService.apiUrl+res.file,
      });
    //}
    setIsLoading(false);
  };

  const finishMediaStream = async (): Promise<void> => {
    try {
      const endpoint: string = '/media/stream/delete/' + musicId;
      const resApi: any = await FrontUtilService.deleteApi(endpoint);
      if (resApi.status === HttpStatusCode.Ok) return;
      //TODO: Does we put error toast?
    } catch (_e) { return; }
  }

  const setPlaylistMode = (): void => setIsPlaylist(true);

  const setMusicMode = (): void => setIsPlaylist(false);

  const setPlaylistsMusics = (list: Array<number>): void => setPlaylist(list);

  return (
    <MusicPlayerContext.Provider 
    value={{ music, fetchMusic, isLoading, isPlaylist, 
             setPlaylistMode, setMusicMode, playlist, setPlaylistsMusics, 
             isMusicPlayling, setIsMusicPlayling, random, setRandomMode, finishMediaStream }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export default MusicPlayerContext;
