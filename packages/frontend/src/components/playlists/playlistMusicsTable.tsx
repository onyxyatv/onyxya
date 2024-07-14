import {
  flexRender,
  getCoreRowModel, useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  ColumnDef
} from "@tanstack/react-table";
import {
  Table, TableBody,
  TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import MusicItemDraggableRow from "./musicItemDraggableRow";
import FrontUtilService from "@/utils/frontUtilService";
import { ChangeMediaPosition } from '@common/validation/playlist/changeMediaPosition.schema';
import { MediasPlaylist } from "../models/playlist";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  //reloadPlaylist: (v: boolean) => void;
}

export function PlaylistMusicsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Item's id cannot be 0, otherwise item 0 cannot be dragged
  const [items, setItems] = useState(data.map((_item, index: number) => index.toString()));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  interface ChangedItem {
    mediaPlaylist: MediasPlaylist,
    newPosition: number;
  }

  async function setNewPositions(items: Array<ChangedItem>): Promise<void> {
    try {
      const endpoint: string = '/playlists/changeMediaPosition';
      for (const item of items) {
        console.log(item.mediaPlaylist);
        const data: ChangeMediaPosition = { 
          mediaPlaylistId: item.mediaPlaylist.id, 
          newPosition: item.newPosition + 1,
        };
        await FrontUtilService.patchApi(endpoint, data);
      }
    } catch (error) {
      // TODO: error handling and alert
      alert('error');
    }
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        /*
          selectedChangeItem represents the item that has been dragged and dropped, 
          so the second is the one that has been moved accordingly.
        */
        const selectedChangeItem: any = table.getRowModel().rows[active.id]._valuesCache;
        const notSelected: any = table.getRowModel().rows[over.id]._valuesCache;

        setNewPositions([
          { mediaPlaylist: selectedChangeItem, newPosition: newIndex },
          { mediaPlaylist: notSelected, newPosition: oldIndex },
        ]);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="rounded-md border p-2 mt-2">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name"
          value={(table.getColumn("mediaName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("mediaName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      { /* Playlist table / Area */}
      <ScrollArea className="h-[350px] pr-3">
        <Table className="border-2 border-gray-200">
          { /* Columns header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          { /* Musics list  */}
          <TableBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {table.getRowModel().rows?.length ? (
                  // Browse the list of draggable items rather than the rows of the table itself
                  // table.getRowModel().rows.map((row, index) => {})
                  items.map((id) => {
                    const row = table.getRowModel().rows[Number.parseInt(id)];
                    if (row !== undefined) {
                      return <MusicItemDraggableRow row={row} id={id} />;
                    }
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </DndContext>
          </TableBody>
        </Table>
      </ScrollArea>
    </div >
  )
}