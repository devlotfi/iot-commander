import { Button, Modal, type UseOverlayStateReturn } from "@heroui/react";
import { Plus } from "lucide-react";

interface AddConnectionModalProps {
  state: UseOverlayStateReturn;
}

export default function AddConnectionModal({ state }: AddConnectionModalProps) {
  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[360px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Plus className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Add connection</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p>
              The <code>useOverlayState</code> hook provides dedicated methods
              for common operations. No need to manually create callbacks—just
              use <code>state.open()</code>, <code>state.close()</code>, or{" "}
              <code>state.toggle()</code>.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="secondary">
              Cancel
            </Button>
            <Button slot="close">Confirm</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
