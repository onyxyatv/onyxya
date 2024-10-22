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
import { ReactNode, useContext, useEffect, useState } from "react";
import { Media } from "../models/media";
import DeleteMediaDialog from "./dialog/deleteMediaDialog";
import NewMediaDialog from "./dialog/newMediaDialog";
import EditMediaDialog from "./dialog/editMediaDialog";
import { SyncMediaButton } from "./syncMediaButton";
import AuthContext from "@/utils/AuthContext";
import { useTranslation } from "react-i18next";

export function MediaTable() {
  const [medias, setMedias] = useState<Array<Media>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const perms = useContext(AuthContext)?.authUser?.permissions;
  const { t } = useTranslation();

  const columns: ColumnDef<Media>[] = [
    {
      accessorKey: "name",
      header: t("media.table.header.name"),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "type",
      header: t("media.table.header.type"),
      cell: (info) => info.row.original.mimeType,
    },
    {
      accessorKey: "size",
      header: t("media.table.header.size"),
      cell: (info) => `${(info.row.original.size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      accessorKey: "createdAt",
      header: t("media.table.header.createdAt"),
      cell: (info) => new Date(info.row.original.createdAt).toLocaleString(),
    },
    {
      id: "actions",
      header: t("media.table.header.action"),
      cell: (info) => (
        <div className="">
          <EditMediaDialog
            mediaId={info.row.original.id}
            onUpdate={fetchData}
            disabled={!perms?.includes("edit_media")}
          />
          <DeleteMediaDialog mediaId={info.row.original.id} disabled={!perms?.includes("delete_media")}/>
        </div>
      ),
    },
  ];

  // TODO: change isLoading gestion and his display
  const fetchData = async () => {
    setIsLoading(true);
    const data = await FrontUtilService.getDataFromApi("/media");
    if (data) setMedias(data);
    setIsLoading(false);
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
          placeholder={t("media.search.placeholder")}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <SyncMediaButton onSyncComplete={fetchData} disabled={!perms?.includes("sync_media")}>{t("media.syncMedia")}</SyncMediaButton>
        <NewMediaDialog onMediaAdded={fetchData} disabled={!perms?.includes("upload_media")}/>
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
    </div>
  );
}

export default MediaTable;
