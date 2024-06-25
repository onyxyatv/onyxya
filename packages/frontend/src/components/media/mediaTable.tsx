import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

const medias = [
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

// We want to create a shadcn component that will be used to display a table of media items.
const MediaTable = () => {
  return (
    <div>
      <Table />
      <TableCaption>Media Items</TableCaption>
      <TableHeader>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Path</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Type</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medias.map((media) => (
          <TableRow key={media.id}>
            <TableCell>{media.id}</TableCell>
            <TableCell>{media.name}</TableCell>
            <TableCell>{media.path}</TableCell>
            <TableCell>{media.status}</TableCell>
            <TableCell>{media.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </div>
  );
};

export default MediaTable;
