import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/components/models/user";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  {
    accessorKey: "access", header: "Action",
    cell: ({ row }) => {
      const userId = row._valuesCache.id;
      return (
        <Link to={`/settings/user/${userId}`}>
          <Button variant="outline">
            Edit <ChevronRight className="h-4" />
          </Button>
        </Link>
      );
    }
  },
];