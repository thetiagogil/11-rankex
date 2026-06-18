"use client";

import { useRouter } from "next/navigation";
import { type ComponentProps, useId, useState, useTransition } from "react";

import { getListIcon } from "@/features/lists/lib/list-icons";
import {
  createListAction,
  updateListAction,
} from "@/features/lists/server/actions";
import type { RankedList, RankingMode } from "@/features/lists/types";

type UseListFormOptions = {
  initialList?: RankedList;
  redirectToList: boolean;
};

export const useListForm = ({
  initialList,
  redirectToList,
}: UseListFormOptions) => {
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

  const closeDialog = () => {
    setOpen(false);
  };

  const submit: NonNullable<ComponentProps<"form">["onSubmit"]> = (event) => {
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

  return {
    closeDialog,
    description,
    feedback,
    formId,
    iconId,
    isEditing,
    isPending,
    isPublic,
    open,
    openDialog,
    rankingMode,
    rankingModeLocked,
    setDescription,
    setIconId,
    setIsPublic,
    setRankingMode,
    setTitle,
    setTopic,
    submit,
    title,
    topic,
  };
};
