import { FormActions } from "@/shared/components/form-actions";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/components/ui/button";

type DeleteListDialogProps = {
  isPending: boolean;
  listTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

export function DeleteListDialog({
  isPending,
  listTitle,
  onCancel,
  onConfirm,
  open,
}: DeleteListDialogProps) {
  return (
    <Modal
      description={`Delete ${listTitle} and all ranked items.`}
      footer={
        <FormActions border={false}>
          <Button disabled={isPending} onClick={onCancel} variant="ghost">
            Cancel
          </Button>
          <Button disabled={isPending} onClick={onConfirm} variant="danger">
            {isPending ? "Deleting..." : "Delete list"}
          </Button>
        </FormActions>
      }
      onClose={onCancel}
      open={open}
      title="Delete this list?"
    >
      <div className="flex flex-col gap-5">
        <p className="text-muted-foreground text-sm leading-6">
          This permanently deletes &quot;{listTitle}&quot; and all ranked items
          in it.
        </p>
      </div>
    </Modal>
  );
}
