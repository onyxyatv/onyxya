import { Button } from "@/components/ui/button";
import FrontUtilService from "@/utils/frontUtilService";

type SyncMediaButtonProps = {
  onSyncComplete: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SyncMediaButton = ({ onSyncComplete, children, disabled }: SyncMediaButtonProps): JSX.Element => {

  function syncMedia() {
    FrontUtilService.getDataFromApi("/media/sync");
  }

  return (
    <>
      {
        !disabled ? (
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
        ) : (
          <Button
            variant="default"
            size="sm"
            className="m-2"
            disabled
          >
            {children || "Sync Media"}
          </Button>
        )
      }
    </>
  );
};
