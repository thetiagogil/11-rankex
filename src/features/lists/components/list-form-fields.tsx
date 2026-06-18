import {
  Globe,
  LayoutGrid,
  ListOrdered,
  LockKeyhole,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";

import { ListVisibilityOption } from "@/features/lists/components/list-visibility-option";
import type { ListIconId } from "@/features/lists/lib/list-icon-data";
import {
  listIconOptions,
  resolveListIconId,
} from "@/features/lists/lib/list-icons";
import {
  rankingModeDescriptions,
  rankingModeLabels,
  rankingModes,
} from "@/features/lists/lib/ranking-mode";
import type { RankingMode } from "@/features/lists/types";
import { FormField } from "@/shared/components/form-field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";

type ListFormFieldsProps = {
  description: string;
  iconId: ListIconId;
  isPending: boolean;
  isPublic: boolean;
  onDescriptionChange: (description: string) => void;
  onIconIdChange: (iconId: ListIconId) => void;
  onIsPublicChange: (isPublic: boolean) => void;
  onRankingModeChange: (rankingMode: RankingMode) => void;
  onTitleChange: (title: string) => void;
  onTopicChange: (topic: string) => void;
  rankingMode: RankingMode;
  rankingModeLocked: boolean;
  title: string;
  topic: string;
};

const rankingModeIcons: Record<RankingMode, ReactNode> = {
  ranked: <ListOrdered />,
  scored: <Star />,
  tiered: <LayoutGrid />,
};

export const ListFormFields = ({
  description,
  iconId,
  isPending,
  isPublic,
  onDescriptionChange,
  onIconIdChange,
  onIsPublicChange,
  onRankingModeChange,
  onTitleChange,
  onTopicChange,
  rankingMode,
  rankingModeLocked,
  title,
  topic,
}: ListFormFieldsProps) => {
  return (
    <>
      <FormField htmlFor="list-title" label="List title" required>
        <Input
          autoFocus
          disabled={isPending}
          id="list-title"
          maxLength={120}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="My top films of all time"
          required
          value={title}
        />
      </FormField>

      <FormField htmlFor="list-topic" label="Topic">
        <Input
          disabled={isPending}
          id="list-topic"
          maxLength={80}
          onChange={(event) => onTopicChange(event.target.value)}
          placeholder="Movies, albums, restaurants..."
          value={topic}
        />
      </FormField>

      <FormField htmlFor="list-description" label="Description">
        <Textarea
          disabled={isPending}
          id="list-description"
          maxLength={500}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="A short note about the ranking criteria."
          rows={3}
          value={description}
        />
      </FormField>

      <FormField
        className="gap-2"
        description={
          rankingModeLocked
            ? "Ranking style is locked after items are added."
            : undefined
        }
        label="Ranking style"
      >
        <ToggleGroup
          aria-label="Choose ranking style"
          className="grid w-full min-w-0 items-stretch gap-2 sm:grid-cols-3"
          disabled={isPending || rankingModeLocked}
          onValueChange={(value) => {
            if (value) onRankingModeChange(value as RankingMode);
          }}
          type="single"
          value={rankingMode}
        >
          {rankingModes.map((mode) => (
            <ListVisibilityOption
              description={rankingModeDescriptions[mode]}
              icon={rankingModeIcons[mode]}
              key={mode}
              label={rankingModeLabels[mode]}
              value={mode}
            />
          ))}
        </ToggleGroup>
      </FormField>

      <FormField className="gap-2" label="Icon">
        <ToggleGroup
          aria-label="Choose list icon"
          className="flex flex-wrap gap-2"
          onValueChange={(value) => {
            if (value) onIconIdChange(resolveListIconId(value, null));
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
      </FormField>

      <FormField className="gap-2" label="Visibility">
        <ToggleGroup
          aria-label="Choose list visibility"
          className="grid w-full min-w-0 items-stretch gap-2 sm:grid-cols-2"
          disabled={isPending}
          onValueChange={(value) => {
            if (value) onIsPublicChange(value === "public");
          }}
          type="single"
          value={isPublic ? "public" : "private"}
        >
          <ListVisibilityOption
            description="Shown in Explore."
            icon={<Globe />}
            label="Public"
            value="public"
          />
          <ListVisibilityOption
            description="Only visible to you."
            icon={<LockKeyhole />}
            label="Private"
            value="private"
          />
        </ToggleGroup>
      </FormField>
    </>
  );
};
