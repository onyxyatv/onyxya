import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const GlobalSettings: React.FC = () => {

  const handleChange = (value: string) => {
    console.log(value);
  };

  return (
    <section className="mt-2 p-2 bg-gray-100 border-2 rounded-md border-gray-200">
      <div className="flex flex-row items-center gap-4">
        <h2 className="text-lg font-semibold">Language selection</h2>
        <Select onValueChange={handleChange}>
          <SelectTrigger className="p-2 rounded-md w-1/3">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>
        <Button>Save</Button>
      </div>
    </section>
  );
};

export default GlobalSettings;
