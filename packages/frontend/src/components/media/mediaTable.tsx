import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useState } from "react";

interface Media {
  id: number;
  name: string;
  path: string;
  status: string;
  type: string;
}

const medias: Media[] = [
  {
    id: 1,
    name: "Gangnam Style",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 2,
    name: "Gangnam Style 2",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 3,
    name: "Gangnam Style 3",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 1,
    name: "Gangnam Style",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 2,
    name: "Gangnam Style 2",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 3,
    name: "Gangnam Style 3",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 1,
    name: "Gangnam Style",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 2,
    name: "Gangnam Style 2",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 3,
    name: "Gangnam Style 3",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 1,
    name: "Gangnam Style",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 2,
    name: "Gangnam Style 2",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
  {
    id: 3,
    name: "Gangnam Style 3",
    path: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    status: "active",
    type: "video",
  },
];

const columns: ColumnDef<Media>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "path",
    header: "Path",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];

export function MediaTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Récupère en db les média
  function getMedia() {
    return medias;
  }

  const table = useReactTable({
    data: medias,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="rounded-md border p-2">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="h-[250px] pr-3">
        <Table className="border-2 border-gray-200">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : (flexRender(
                            header.column.columnDef.header as ReactNode,
                            header.getContext()
                          ) as ReactNode)}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex items-center justify-end mr-3 space-x-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default MediaTable;
