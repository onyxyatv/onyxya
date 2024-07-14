import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "../ui/table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface MusicItemProps {
  row: any;
  id: any;
}

const MusicItemDraggableRow = (props: MusicItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      key={props.row.id}
      data-state={props.row.getIsSelected() && "selected"}
      style={style}
      ref={setNodeRef}
    >
      {
        props.row.getVisibleCells().map((cell: any) => {
          if (cell.id.includes('dragPosition')) {
            return (
              <TableCell key={cell.id} {...attributes} {...listeners}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            )
          } else {
            return (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          }
        })
      }
    </TableRow>
  );
}

export default MusicItemDraggableRow;