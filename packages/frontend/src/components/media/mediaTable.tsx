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
import FrontUtilService from "@/utils/frontUtilService";
import { EditMediaCard } from "@common/validation/media/editMediaCart.schema";
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
import { ReactNode, useEffect, useState } from "react";
import { Media } from "../models/media";
import EditMediaPopop from "./editMedia";
import { SyncMediaButton } from "./syncMediaButton";

export function MediaTable() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpened, setPopupOpened] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<EditMediaCard | null>(
    null
  );

  const columns: ColumnDef<Media>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => info.row.original.mimeType,
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: (info) => `${info.getValue()} bytes`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex justify-center space-x-2">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              FrontUtilService.deleteApi(`/media/${info.row.original.id}`);
            }}
          >
            Delete
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(info.row.original)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const openEditDialog = (media: EditMediaCard) => {
    setSelectedMedia(media);
    setPopupOpened(true);
  };

  // TODO: change isLoading gestion and his display
  const fetchData = async () => {
    setIsLoading(true);
    const data = await FrontUtilService.getDataFromApi("/media");
    setTimeout(() => {
      if (data) {
        setMedias(data);
      }
      setIsLoading(false);
    }, 2000);
  };

  const reloadMediaCarts = () => {
    // Logique pour recharger les données des médias
    fetchData(); // Exemple d'une fonction fetchData qui récupère les données des médias
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

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
        <SyncMediaButton onSyncComplete={fetchData} />
      </div>
      <ScrollArea className="h-[250px] pr-3">
        <Table className="border-2 border-gray-200">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header as ReactNode,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
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
          )}
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
      {selectedMedia && (
        <EditMediaPopop
          mediaCart={selectedMedia}
          reloadMediaCarts={reloadMediaCarts}
          isOpen={popupOpened}
          onClose={() => setPopupOpened(false)}
        />
      )}
    </div>
  );
}

export default MediaTable;
