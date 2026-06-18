import { itemTierOptions } from "@/features/lists/lib/item-form-options";
import type { RankingMode } from "@/features/lists/types";
import { FormField } from "@/shared/components/form-field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

type ItemFormFieldsProps = {
  isPending: boolean;
  note: string;
  onNoteChange: (note: string) => void;
  onScoreChange: (score: string) => void;
  onTierChange: (tier: string) => void;
  onTitleChange: (title: string) => void;
  rankingMode: RankingMode;
  score: string;
  tier: string;
  title: string;
};

export const ItemFormFields = ({
  isPending,
  note,
  onNoteChange,
  onScoreChange,
  onTierChange,
  onTitleChange,
  rankingMode,
  score,
  tier,
  title,
}: ItemFormFieldsProps) => {
  return (
    <>
      <FormField htmlFor="item-title" label="Title" required>
        <Input
          autoFocus
          disabled={isPending}
          id="item-title"
          maxLength={120}
          onChange={(event) => onTitleChange(event.target.value)}
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
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Why this item belongs here."
          rows={4}
          value={note}
        />
      </FormField>

      {rankingMode === "scored" ? (
        <FormField htmlFor="item-score" label="Score" required>
          <Input
            disabled={isPending}
            id="item-score"
            inputMode="numeric"
            max={100}
            min={0}
            onChange={(event) => onScoreChange(event.target.value)}
            placeholder="0-100"
            required
            type="number"
            value={score}
          />
        </FormField>
      ) : null}

      {rankingMode === "tiered" ? (
        <FormField htmlFor="item-tier" label="Tier" required>
          <Select
            disabled={isPending}
            onValueChange={(value) => onTierChange(value || "S")}
            required
            value={tier}
          >
            <SelectTrigger className="w-full" id="item-tier">
              <SelectValue placeholder="Choose tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {itemTierOptions
                  .filter((option) => option.value !== "none")
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormField>
      ) : null}
    </>
  );
};
