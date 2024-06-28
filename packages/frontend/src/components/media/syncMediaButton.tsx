import { Button } from "@/components/ui/button";
import FrontUtilService from "@/utils/frontUtilService";

type SyncMediaButtonProps = {
  onSyncComplete: () => void;
};

export const SyncMediaButton = ({ onSyncComplete }: SyncMediaButtonProps): JSX.Element => {

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
        onSyncComplete();
      }}
    >
      Sync Media
    </Button>
  );
};
