import { CirclePlus } from "lucide-react";
import { Button } from "../ui/button";

const GlobalSettings: React.FC = () => {
  return (
    <section className="mt-2 p-2 bg-gray-100 border-2 rounded-md border-gray-200">
      <div id="foldersSelectionContainer">
        <div className="flex flex-row">
          <p>If you change a folder, you'll need to restart the container so that the files can be mapped again.</p>
          <Button className="ml-auto bg-green-400 hover:bg-green-700">
            <CirclePlus className="mr-1" /> Add a folder
          </Button>
        </div>

        <div className="p-2 border-2 mt-1 border-blue-600">
          <h4>Movies Folder</h4>
          <div className="flex flex-row justify-around">
            <div>
              <h5>Selected folder</h5>
              <p className="border-2 border-gray-400 p-2 bg-gray-700 rounded-md">
                /home/john/Documents/movies
              </p>
            </div>
            <div>
              <h5>Container folder</h5>
              <p className="border-2 border-gray-400 p-2 bg-gray-700 rounded-md">
                /home/node/media/movies
              </p>
            </div>
          </div>
        </div>

        <div className="p-2 border-2 mt-1 border-blue-600">
          <h4>Music Folder</h4>
          <div className="flex flex-row justify-around">
            <div>
              <h5>Selected folder</h5>
              <p className="border-2 border-gray-400 p-2 bg-gray-700 rounded-md">
                /home/john/Documents/musics
              </p>
            </div>
            <div>
              <h5>Container folder</h5>
              <p className="border-2 border-gray-400 p-2 bg-gray-700 rounded-md">
                /home/node/media/music
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GlobalSettings;