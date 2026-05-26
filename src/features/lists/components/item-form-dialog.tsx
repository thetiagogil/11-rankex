"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  type SubmitEvent,
  useId,
  useState,
  useTransition,
} from "react";

import {
  createItemAction,
  updateItemAction,
} from "@/features/lists/server/actions";
import { itemTierOptions } from "@/features/lists/lib/item-form-options";
import type { RankedItem, Tier } from "@/features/lists/types";
import { FormField } from "@/shared/components/form-field";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

type ItemFormDialogProps = {
  item?: RankedItem;
  listId: number;
  trigger?: ReactNode;
};

export function ItemFormDialog({ item, listId, trigger }: ItemFormDialogProps) {
  const router = useRouter();
  const generatedFormId = useId();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(item?.title ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [score, setScore] = useState(item?.score?.toString() ?? "");
  const [tier, setTier] = useState(item?.tier ?? "none");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(item);
  const formId = `rankex-item-form-${generatedFormId}`;

  const openDialog = () => {
    setTitle(item?.title ?? "");
    setNote(item?.note ?? "");
    setScore(item?.score?.toString() ?? "");
    setTier(item?.tier ?? "none");
    setFeedback(null);
    setOpen(true);
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const input = {
        note,
        score,
        tier: tier === "none" ? null : (tier as Tier),
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
        description="Add or edit a ranked list item."
        footer={
          <>
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
          </>
        }
        onClose={() => setOpen(false)}
        open={open}
        title={isEditing ? "Edit item" : "Add item"}
      >
        <form className="flex flex-col gap-4" id={formId} onSubmit={submit}>
          {feedback ? <Alert tone="error">{feedback}</Alert> : null}

          <FormField htmlFor="item-title" label="Title" required>
            <Input
              autoFocus
              disabled={isPending}
              id="item-title"
              maxLength={120}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Inception"
              required
              value={title}
            />
          </FormField>

          <FormField htmlFor="item-note" label="Note">
            <Textarea
              disabled={isPending}
              id="item-note"
              maxLength={800}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Why this item belongs here."
              rows={4}
              value={note}
            />
          </FormField>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField htmlFor="item-score" label="Score">
              <Input
                disabled={isPending}
                id="item-score"
                inputMode="numeric"
                max={100}
                min={0}
                onChange={(event) => setScore(event.target.value)}
                placeholder="0-100"
                type="number"
                value={score}
              />
            </FormField>

            <FormField htmlFor="item-tier" label="Tier">
              <Select
                disabled={isPending}
                onValueChange={(value) => setTier(value || "none")}
                value={tier}
              >
                <SelectTrigger className="w-full" id="item-tier">
                  <SelectValue placeholder="No tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemTierOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </form>
      </Modal>
    </>
  );
}
