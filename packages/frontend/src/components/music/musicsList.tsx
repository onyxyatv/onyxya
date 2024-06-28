import FrontUtilService from "@/utils/frontUtilService";
import { AxiosResponse, HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

interface MusicListCategory {
  category: string;
  musics: Array<object>;
}

const MusicsLists: React.FC = (props: { playMusic: any }) => {
  const [musics, setMusics] = useState([]);
  const [error, setError] = useState('');

  const fetchAllMusics = async () => {
    try {
      const endpoint: string = '';
      const res: AxiosResponse = await FrontUtilService.getDataFromApi(endpoint);
      if (res.status === HttpStatusCode.Ok) {
        setMusics(res.data.categories);
        setError('');
      }
    } catch (error) {
      setMusics([]);
      setError('Error during fetching musics list');
    }
  }

  useEffect(() => {
    fetchAllMusics();
  }, []);

  return (
    <div id="musicsListContainer">
      {
        musics.map((musicList: MusicListCategory) => {
          return (
            <div className={`musics-list-${musicList.category}-category`}>
              <h3>{musicList.category}</h3>
              <p>{musicList.musics.length}</p>
            </div>
          );
        })
      }
      {
        error.length > 0 &&
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      }
    </div>
  );
}

export default MusicsLists;