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
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import MusicItemDraggableRow from "./musicItemDraggableRow";
import { defaultDropAnimationConfiguration } from "@dnd-kit/core/dist/components/DragOverlay/hooks/useDropAnimation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function PlaylistMusicsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [items, setItems] = useState(data.map((_item, index) => index));
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

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
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
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    return <MusicItemDraggableRow row={row} id={row.id} />;
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </ScrollArea>
      </DndContext>
    </div >
  )
}