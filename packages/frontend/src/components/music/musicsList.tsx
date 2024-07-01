import FrontUtilService from "@/utils/frontUtilService";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface Music {
  id: number;
  mediaCard: {
    name: string;
  };
}

interface MusicsListProps {
  playMusic: (musicId: number) => Promise<void>;
}

type MusicCategories = Record<string, Array<Music>>;

const MusicsLists = (props: MusicsListProps) => {
  const [musicsByCategories, setMusics] = useState<MusicCategories>({});
  const [error, setError] = useState('');

  const fetchAllMusics = async () => {
    try {
      const endpoint: string = FrontUtilService.getMediaByTypeCategories.replace(':mediaType', 'music');
      const data: any | null = await FrontUtilService.getDataFromApi(endpoint);
      if (data !== null) {
        setMusics(data.categories);
        setError('');
      }
    } catch (error) {
      setMusics({});
      setError('Error during fetching musics list');
    }
  }

  useEffect(() => {
    fetchAllMusics();
  }, []);

  return (
    <div id="musicsListContainer" className="w-5/6 p-2">
      {
        musicsByCategories !== null &&
        Object.keys(musicsByCategories).map((musicCategoryName: string) => {
          return (
            <div className={`musics-list-${musicCategoryName}-category border-2 border-gray-300 p-2`}>
              <h3>{musicCategoryName}</h3>
              <p>
                {musicsByCategories[musicCategoryName].length} musiques
              </p>
              <div id={`${musicCategoryName}MusicContainer`} className="flex flex-row align-middle">
                {
                  musicsByCategories[musicCategoryName].map((music: Music) => {
                    return (
                      <Card className="m-2">
                        <CardHeader>
                          <CardTitle className="text-sm">
                            {music.mediaCard.name}
                          </CardTitle>
                          <CardDescription>
                            Pas de description
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button onClick={() => props.playMusic(music.id)}>Play</Button>
                        </CardFooter>
                      </Card>
                    );
                  })
                }
              </div>
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