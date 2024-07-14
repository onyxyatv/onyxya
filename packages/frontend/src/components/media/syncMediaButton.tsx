import { Button } from "@/components/ui/button";
import FrontUtilService from "@/utils/frontUtilService";

type SyncMediaButtonProps = {
  onSyncComplete: () => void;
  children?: React.ReactNode;
};

export const SyncMediaButton = ({ onSyncComplete, children }: SyncMediaButtonProps): JSX.Element => {

  function syncMedia() {
    FrontUtilService.getDataFromApi("/media/sync");
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
      {children || "Sync Media"}
    </Button>
  );
};
