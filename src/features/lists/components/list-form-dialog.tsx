"use client";

import { ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  type SubmitEvent,
  useId,
  useState,
  useTransition,
} from "react";

import { ListFormFields } from "@/features/lists/components/list-form-fields";
import { getListIcon } from "@/features/lists/lib/list-icons";
import {
  createListAction,
  updateListAction,
} from "@/features/lists/server/actions";
import type { RankedList, RankingMode } from "@/features/lists/types";
import { FormActions } from "@/shared/components/form-actions";
import { Modal } from "@/shared/components/modal";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";

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
  const [rankingMode, setRankingMode] = useState<RankingMode>(
    initialList?.rankingMode ?? "ranked",
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(initialList);
  const rankingModeLocked = Boolean(initialList?.items.length);
  const formId = `rankex-list-form-${generatedFormId}`;

  const openDialog = () => {
    setTitle(initialList?.title ?? "");
    setTopic(initialList?.topic ?? "");
    setDescription(initialList?.description ?? "");
    setIconId(
      getListIcon(initialList?.emoji ?? null, initialList?.topic ?? null).id,
    );
    setIsPublic(initialList?.isPublic ?? true);
    setRankingMode(initialList?.rankingMode ?? "ranked");
    setFeedback(null);
    setOpen(true);
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const input = {
        description,
        emoji: iconId,
        isPublic,
        rankingMode,
        title,
        topic,
      };
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
          <FormActions
            border={false}
            leading={
              isEditing && onRequestDelete ? (
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
              ) : null
            }
          >
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
          </FormActions>
        }
        onClose={() => setOpen(false)}
        open={open}
        title={isEditing ? "Edit list" : "Start a new top list"}
      >
        <form className="flex flex-col gap-4" id={formId} onSubmit={submit}>
          {feedback ? <Alert tone="error">{feedback}</Alert> : null}

          <ListFormFields
            description={description}
            iconId={iconId}
            isPending={isPending}
            isPublic={isPublic}
            onRankingModeChange={setRankingMode}
            onDescriptionChange={setDescription}
            onIconIdChange={setIconId}
            onIsPublicChange={setIsPublic}
            onTitleChange={setTitle}
            onTopicChange={setTopic}
            rankingModeLocked={rankingModeLocked}
            rankingMode={rankingMode}
            title={title}
            topic={topic}
          />
        </form>
      </Modal>
    </>
  );
}
