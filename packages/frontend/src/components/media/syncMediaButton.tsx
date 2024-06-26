import { Button } from "@/components/ui/button";
import FrontUtilService from "@/utils/frontUtilService";

export const SyncMediaButton = () => {
  function syncMedia() {
    FrontUtilService.getDataFromApi("/media/sync/music");
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="m-2"
      onClick={() => {
        syncMedia();
      }}
    >
      Sync Media
    </Button>
  );
};
