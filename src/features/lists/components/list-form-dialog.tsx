"use client";

import {
  Globe2,
  ListPlus,
  Loader2,
  LockKeyhole,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState, useTransition } from "react";

import {
  createListAction,
  updateListAction,
} from "@/features/lists/server/actions";
import { getListEmoji } from "@/features/lists/lib/list-emoji";
import type { RankedList } from "@/features/lists/types";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Modal } from "@/shared/components/ui/modal";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/cn";

type ListFormDialogProps = {
  initialList?: RankedList;
  redirectToList?: boolean;
  trigger?: ReactNode;
};

const emojiOptions = [
  "🏆",
  "🎬",
  "🎮",
  "🎵",
  "🍜",
  "📚",
  "⚽",
  "✈️",
  "☕",
  "💻",
];

export function ListFormDialog({
  initialList,
  redirectToList = false,
  trigger,
}: ListFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialList?.title ?? "");
  const [topic, setTopic] = useState(initialList?.topic ?? "");
  const [description, setDescription] = useState(initialList?.description ?? "");
  const [emoji, setEmoji] = useState(
    getListEmoji(initialList?.emoji ?? null, initialList?.topic ?? null),
  );
  const [isPublic, setIsPublic] = useState(initialList?.isPublic ?? false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(initialList);

  const openDialog = () => {
    setTitle(initialList?.title ?? "");
    setTopic(initialList?.topic ?? "");
    setDescription(initialList?.description ?? "");
    setEmoji(getListEmoji(initialList?.emoji ?? null, initialList?.topic ?? null));
    setIsPublic(initialList?.isPublic ?? false);
    setFeedback(null);
    setOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const input = { description, emoji, isPublic, title, topic };
      const result = initialList
        ? await updateListAction(initialList.id, input)
        : await createListAction(input);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      setOpen(false);

      if (redirectToList) {
        router.push(`/lists/${result.data.id}`);
      } else {
        router.refresh();
      }
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
          <ListPlus data-icon="inline-start" />
          New list
        </Button>
      )}

      <Modal
        description="Create or edit a ranked list."
        onClose={() => setOpen(false)}
        open={open}
        title={isEditing ? "Edit list" : "Start a new top list"}
      >
        <form className="flex flex-col gap-4 pt-5" onSubmit={submit}>
          {feedback ? <Alert tone="error">{feedback}</Alert> : null}

          <div className="grid gap-1.5">
            <Label htmlFor="list-title" required>
              List title
            </Label>
            <Input
              autoFocus
              disabled={isPending}
              id="list-title"
              maxLength={120}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="My top films of all time"
              required
              value={title}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="list-topic">Topic</Label>
            <Input
              disabled={isPending}
              id="list-topic"
              maxLength={80}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Movies, albums, restaurants..."
              value={topic}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="list-description">Description</Label>
            <Textarea
              disabled={isPending}
              id="list-description"
              maxLength={500}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A short note about the ranking criteria."
              rows={3}
              value={description}
            />
          </div>

          <div className="grid gap-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((option) => (
                <button
                  aria-label={`Use ${option} as list icon`}
                  className={cn(
                    "grid size-10 place-items-center rounded-lg border border-border bg-secondary/55 text-xl transition hover:bg-secondary",
                    emoji === option &&
                      "scale-105 border-primary bg-primary/10 shadow-glow",
                  )}
                  disabled={isPending}
                  key={option}
                  onClick={() => setEmoji(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Visibility</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              <VisibilityOption
                active={isPublic}
                description="Shown in Explore."
                icon={<Globe2 />}
                label="Public"
                onClick={() => setIsPublic(true)}
              />
              <VisibilityOption
                active={!isPublic}
                description="Only visible to you."
                icon={<LockKeyhole />}
                label="Private"
                onClick={() => setIsPublic(false)}
              />
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
              {isEditing ? "Save list" : "Create list"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function VisibilityOption({
  active,
  description,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  description: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-xl border border-border bg-secondary/45 p-3 text-left transition hover:bg-secondary [&_svg]:size-4",
        active && "border-primary bg-primary/10 text-primary",
      )}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {label}
      </span>
      <span className="mt-1 block text-xs text-muted-foreground">
        {description}
      </span>
    </button>
  );
}
