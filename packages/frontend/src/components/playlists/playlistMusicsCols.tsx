import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Play, Trash } from "lucide-react";
import { MediasPlaylist } from "../models/playlist";
import { Media } from "../models/media";

export const playlistMusicsCols: ColumnDef<MediasPlaylist>[] = [
  {
    accessorKey: "media",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, column }) => {
      const media: Media = row.getValue(column.id);
      return <p>{media.name}</p>;
    },
  },
  {
    accessorKey: "position",
  },
  {
    accessorKey: "access", header: "Actions",
    cell: ({ row }) => {
      const musicId = row._valuesCache.id;
      return (
        <div className="space-x-4">
          <Button variant="outline" onClick={() => playMusic(musicId)}>
            <Play className="w-5" />
          </Button>
          <Button variant="destructive" onClick={() => playMusic(musicId)}>
            <Trash className="w-5" />
          </Button>
        </div>
      );
    }
  },
];