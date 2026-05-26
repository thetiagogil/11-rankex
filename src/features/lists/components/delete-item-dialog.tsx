import { FormActions } from "@/shared/components/form-actions";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/components/ui/button";

type DeleteItemDialogProps = {
  isPending: boolean;
  itemTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

export function DeleteItemDialog({
  isPending,
  itemTitle,
  onCancel,
  onConfirm,
  open,
}: DeleteItemDialogProps) {
  return (
    <Modal
      description={
        itemTitle ? `Delete ${itemTitle} from this ranked list.` : undefined
      }
      footer={
        <FormActions border={false}>
          <Button disabled={isPending} onClick={onCancel} variant="ghost">
            Cancel
          </Button>
          <Button disabled={isPending} onClick={onConfirm} variant="danger">
            {isPending ? "Deleting..." : "Delete item"}
          </Button>
        </FormActions>
      }
      onClose={onCancel}
      open={open}
      title="Delete this item?"
    >
      <div className="flex flex-col gap-5">
        <p className="text-muted-foreground text-sm leading-6">
          {itemTitle
            ? `This permanently removes "${itemTitle}" from the ranking.`
            : "This item will be removed from the ranking."}
        </p>
      </div>
    </Modal>
  );
}
