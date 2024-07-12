import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ListOrdered, Play, Trash } from "lucide-react";
import { MediasPlaylist } from "../models/playlist";

interface colsProps {
  playMusic: (musicId: number) => void;
}

const playlistMusicsCols = (props: colsProps): ColumnDef<MediasPlaylist>[] => [
  {
    accessorKey: "media.name",
    id: 'mediaName',
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "media.id", header: "Actions",
    cell: ({ getValue }) => {
      const musicId: any = getValue();
      return (
        <div className="space-x-4">
          <Button variant="outline" onClick={() => props.playMusic(musicId)}>
            <Play className="w-5" />
          </Button>
          <Button variant="destructive" onClick={() => props.playMusic(musicId)}>
            <Trash className="w-5" />
          </Button>
        </div>
      );
    }
  },
  {
    accessorKey: "position",
    header: "Drag Position",
    cell: ({ getValue }) => {
      const musicId: any = getValue();
      return (
        <div className="flex flex-row justify-center">
          <Button variant="outline" id={"changeOrder-" + musicId} >
            <ListOrdered className="w-5" />
          </Button>
        </div>
      );
    }
  },
];

export default playlistMusicsCols;