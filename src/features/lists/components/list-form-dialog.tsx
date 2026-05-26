"use client";

import { ListPlus } from "lucide-react";
import { type ReactNode } from "react";

import { ListFormFields } from "@/features/lists/components/list-form-fields";
import { useListForm } from "@/features/lists/hooks/use-list-form";
import type { RankedList } from "@/features/lists/types";
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
  const form = useListForm({ initialList, redirectToList });

  return (
    <>
      {trigger ? (
        <span className="contents" onClick={form.openDialog}>
          {trigger}
        </span>
      ) : (
        <Button onClick={form.openDialog} size="lg">
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
              form.isEditing && onRequestDelete ? (
                <Button
                  className="text-destructive hover:text-destructive"
                  disabled={form.isPending}
                  onClick={() => {
                    form.closeDialog();
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
              disabled={form.isPending}
              onClick={form.closeDialog}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={form.isPending} form={form.formId} type="submit">
              {form.isPending
                ? form.isEditing
                  ? "Saving..."
                  : "Creating..."
                : form.isEditing
                  ? "Save"
                  : "Create list"}
            </Button>
          </FormActions>
        }
        onClose={form.closeDialog}
        open={form.open}
        title={form.isEditing ? "Edit list" : "Start a new top list"}
      >
        <form
          className="flex flex-col gap-4"
          id={form.formId}
          onSubmit={form.submit}
        >
          {form.feedback ? <Alert tone="error">{form.feedback}</Alert> : null}

          <ListFormFields
            description={form.description}
            iconId={form.iconId}
            isPending={form.isPending}
            isPublic={form.isPublic}
            onDescriptionChange={form.setDescription}
            onIconIdChange={form.setIconId}
            onIsPublicChange={form.setIsPublic}
            onRankingModeChange={form.setRankingMode}
            onTitleChange={form.setTitle}
            onTopicChange={form.setTopic}
            rankingMode={form.rankingMode}
            rankingModeLocked={form.rankingModeLocked}
            title={form.title}
            topic={form.topic}
          />
        </form>
      </Modal>
    </>
  );
}
