import { ColumnDef } from "@tanstack/react-table";
import { User } from "../models/user";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          User Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: "isActive", header: "Status",
    cell: ({ getValue }) => {
      return ((getValue() === true) ? "Active" : "Inactive")
    }
  },
];