import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "../ui/table";
import { useSortable } from "@dnd-kit/sortable";
import { Grip } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

interface MusicItemProps {
  row: any;
  id: any;
}

const MusicItemDraggableRow = (props: MusicItemProps) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: props.row.original.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <TableRow ref={setNodeRef} key={props.row.id} style={style} data-state={props.row.getIsSelected() && "selected"}>
      {
        isDragging ? (
          <TableCell className="bg-red-500" colSpan={props.row.getAllCells().length}>
            &nbsp;
          </TableCell>
        ) : (
          props.row.getVisibleCells().map((cell: any, index: number) => {
            if (index === 0) {
              return (
                <TableCell key={cell.id}>
                  <Grip {...attributes} {...listeners} />
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            }

            return (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })
        )
      }
    </TableRow>
  );
}

export default MusicItemDraggableRow;