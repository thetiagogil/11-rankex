"use client";

import { Globe, ListPlus, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  type SubmitEvent,
  useId,
  useState,
  useTransition,
} from "react";

import {
  getListIcon,
  listIconOptions,
  resolveListIconId,
} from "@/features/lists/lib/list-icons";
import {
  createListAction,
  updateListAction,
} from "@/features/lists/server/actions";
import type { RankedList } from "@/features/lists/types";
import { Modal } from "@/shared/components/modal";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";

type ListFormDialogProps = {
  initialList?: RankedList;
  onRequestDelete?: () => void;
  redirectToList?: boolean;
  trigger?: ReactNode;
};

export function ListFormDialog({
  initialList,
  onRequestDelete,
  redirectToList = false,
  trigger,
}: ListFormDialogProps) {
  const router = useRouter();
  const generatedFormId = useId();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialList?.title ?? "");
  const [topic, setTopic] = useState(initialList?.topic ?? "");
  const [description, setDescription] = useState(
    initialList?.description ?? "",
  );
  const [iconId, setIconId] = useState(
    getListIcon(initialList?.emoji ?? null, initialList?.topic ?? null).id,
  );
  const [isPublic, setIsPublic] = useState(initialList?.isPublic ?? true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(initialList);
  const formId = `rankex-list-form-${generatedFormId}`;

  const openDialog = () => {
    setTitle(initialList?.title ?? "");
    setTopic(initialList?.topic ?? "");
    setDescription(initialList?.description ?? "");
    setIconId(
      getListIcon(initialList?.emoji ?? null, initialList?.topic ?? null).id,
    );
    setIsPublic(initialList?.isPublic ?? true);
    setFeedback(null);
    setOpen(true);
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const input = { description, emoji: iconId, isPublic, title, topic };
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
        footer={
          <>
            {isEditing && onRequestDelete ? (
              <Button
                className="text-destructive hover:text-destructive"
                disabled={isPending}
                onClick={() => {
                  setOpen(false);
                  onRequestDelete();
                }}
                type="button"
                variant="ghost"
              >
                Delete
              </Button>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                disabled={isPending}
                onClick={() => setOpen(false)}
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button disabled={isPending} form={formId} type="submit">
                {isPending
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                    ? "Save"
                    : "Create list"}
              </Button>
            </div>
          </>
        }
        footerClassName={
          isEditing && onRequestDelete ? "sm:justify-between" : undefined
        }
        onClose={() => setOpen(false)}
        open={open}
        title={isEditing ? "Edit list" : "Start a new top list"}
      >
        <form className="flex flex-col gap-4" id={formId} onSubmit={submit}>
          {feedback ? <Alert tone="error">{feedback}</Alert> : null}

          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-2">
            <Label>Icon</Label>
            <ToggleGroup
              aria-label="Choose list icon"
              className="flex flex-wrap gap-2"
              onValueChange={(value) => {
                if (value) setIconId(resolveListIconId(value, null));
              }}
              type="single"
              value={iconId}
            >
              {listIconOptions.map((option) => {
                const Icon = option.Icon;

                return (
                  <ToggleGroupItem
                    aria-label={`Use ${option.label} icon`}
                    className="border-border bg-secondary/55 text-foreground hover:bg-secondary data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary grid size-10 place-items-center rounded-lg border p-0 data-[state=on]:scale-105"
                    disabled={isPending}
                    key={option.id}
                    title={option.label}
                    value={option.id}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Visibility</Label>
            <ToggleGroup
              aria-label="Choose list visibility"
              className="grid w-full gap-2 sm:grid-cols-2"
              disabled={isPending}
              onValueChange={(value) => {
                if (value) setIsPublic(value === "public");
              }}
              type="single"
              value={isPublic ? "public" : "private"}
            >
              <VisibilityOption
                description="Shown in Explore."
                icon={<Globe />}
                label="Public"
                value="public"
              />
              <VisibilityOption
                description="Only visible to you."
                icon={<LockKeyhole />}
                label="Private"
                value="private"
              />
            </ToggleGroup>
          </div>
        </form>
      </Modal>
    </>
  );
}

function VisibilityOption({
  description,
  icon,
  label,
  value,
}: {
  description: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <ToggleGroupItem
      className="border-border bg-secondary/45 hover:bg-secondary data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary h-auto flex-col items-start rounded-xl border p-3 text-left [&_svg]:size-4"
      value={value}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {label}
      </span>
      <span className="text-muted-foreground mt-1 block text-xs">
        {description}
      </span>
    </ToggleGroupItem>
  );
}
