"use client";

import { Loader2, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState, useTransition } from "react";

import {
  createItemAction,
  updateItemAction,
} from "@/features/lists/server/actions";
import type { RankedItem, Tier } from "@/features/lists/types";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Modal } from "@/shared/components/ui/modal";
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

const tierOptions = [
  { label: "No tier", value: "none" },
  { label: "S - Essential", value: "S" },
  { label: "A - Excellent", value: "A" },
  { label: "B - Strong", value: "B" },
  { label: "C - Mixed", value: "C" },
  { label: "D - Low priority", value: "D" },
];

export function ItemFormDialog({ item, listId, trigger }: ItemFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(item?.title ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [score, setScore] = useState(item?.score?.toString() ?? "");
  const [tier, setTier] = useState(item?.tier ?? "none");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(item);

  const openDialog = () => {
    setTitle(item?.title ?? "");
    setNote(item?.note ?? "");
    setScore(item?.score?.toString() ?? "");
    setTier(item?.tier ?? "none");
    setFeedback(null);
    setOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
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
        onClose={() => setOpen(false)}
        open={open}
        title={isEditing ? "Edit item" : "Add item"}
      >
        <form className="flex flex-col gap-4 pt-5" onSubmit={submit}>
          {feedback ? <Alert tone="error">{feedback}</Alert> : null}

          <div className="grid gap-1.5">
            <Label htmlFor="item-title" required>
              Title
            </Label>
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
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="item-note">Note</Label>
            <Textarea
              disabled={isPending}
              id="item-note"
              maxLength={800}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Why this item belongs here."
              rows={4}
              value={note}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="item-score">Score</Label>
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
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="item-tier">Tier</Label>
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
                    {tierOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              disabled={isPending}
              onClick={() => setOpen(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <Save data-icon="inline-start" />
              )}
              Save item
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
