"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ComponentProps,
  type ReactNode,
  useId,
  useState,
  useTransition,
} from "react";

import { ItemFormFields } from "@/features/lists/components/item-form-fields";
import {
  createItemAction,
  updateItemAction,
} from "@/features/lists/server/actions";
import type { RankedItem, RankingMode, Tier } from "@/features/lists/types";
import { FormActions } from "@/shared/components/form-actions";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/modal";

type ItemFormDialogProps = {
  item?: RankedItem;
  listId: number;
  rankingMode: RankingMode;
  trigger?: ReactNode;
};

export const ItemFormDialog = ({
  item,
  listId,
  rankingMode,
  trigger,
}: ItemFormDialogProps) => {
  const router = useRouter();
  const generatedFormId = useId();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(item?.title ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [score, setScore] = useState(
    rankingMode === "scored" ? (item?.score?.toString() ?? "") : "",
  );
  const [tier, setTier] = useState(
    rankingMode === "tiered" ? (item?.tier ?? "S") : "none",
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(item);
  const formId = `rankex-item-form-${generatedFormId}`;

  const openDialog = () => {
    setTitle(item?.title ?? "");
    setNote(item?.note ?? "");
    setScore(rankingMode === "scored" ? (item?.score?.toString() ?? "") : "");
    setTier(rankingMode === "tiered" ? (item?.tier ?? "S") : "none");
    setFeedback(null);
    setOpen(true);
  };

  const submit: NonNullable<ComponentProps<"form">["onSubmit"]> = (event) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const input = {
        note,
        score: rankingMode === "scored" ? score : null,
        tier: rankingMode === "tiered" ? (tier as Tier) : null,
        title,
      };
      const result = item
        ? await updateItemAction(listId, item.id, input)
        : await createItemAction(listId, input);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      {trigger ? (
        <span className="contents" onClick={openDialog}>
          {trigger}
        </span>
      ) : (
        <Button onClick={openDialog} size="lg">
          <Plus data-icon="inline-start" />
          Add item
        </Button>
      )}

      <Modal
        description="Add or edit an item in this list."
        footer={
          <FormActions border={false}>
            <Button
              disabled={isPending}
              onClick={() => setOpen(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={isPending} form={formId} type="submit">
              {isPending ? "Saving..." : "Save item"}
            </Button>
          </FormActions>
        }
        onClose={() => setOpen(false)}
        open={open}
        title={isEditing ? "Edit item" : "Add item"}
      >
        <form className="flex flex-col gap-4" id={formId} onSubmit={submit}>
          {feedback ? <Alert tone="error">{feedback}</Alert> : null}

          <ItemFormFields
            isPending={isPending}
            note={note}
            onNoteChange={setNote}
            onScoreChange={setScore}
            onTierChange={setTier}
            onTitleChange={setTitle}
            rankingMode={rankingMode}
            score={score}
            tier={tier}
            title={title}
          />
        </form>
      </Modal>
    </>
  );
};
