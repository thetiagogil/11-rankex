import Link from "next/link";

import { ListOwnerMetadata } from "@/app/(protected)/lists/[listId]/_components/list-owner-metadata";
import { VisibilityBadge } from "@/features/lists/components/visibility-badge";
import { getListIcon } from "@/features/lists/lib/list-icons";
import type { RankedList } from "@/features/lists/types";
import { MetadataDot } from "@/shared/components/metadata-dot";

type ListDetailHeaderProps = {
  canEdit: boolean;
  list: RankedList;
};

export function ListDetailHeader({ canEdit, list }: ListDetailHeaderProps) {
  const listIcon = getListIcon(list.emoji, list.topic);
  const Icon = listIcon.Icon;

  return (
    <section className="mt-6">
      <div className="min-w-0">
        <div className="flex items-start gap-4">
          <div className="border-foreground/45 bg-gradient-gold shadow-elevated text-foreground grid size-16 shrink-0 place-items-center rounded-3xl border">
            <Icon aria-hidden="true" className="size-8" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-5xl leading-none font-black sm:text-6xl">
              {list.title}
            </h1>
          </div>
        </div>

        {list.description ? (
          <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-7">
            {list.description}
          </p>
        ) : null}

        <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
          {list.owner ? (
            <>
              <ListOwnerMetadata profile={list.owner} />
              <MetadataDot />
            </>
          ) : null}
          <span>{list.topic ?? "General"}</span>
          <MetadataDot />
          <span>
            {list.items.length} {list.items.length === 1 ? "entry" : "entries"}
          </span>
          {list.remixSource ? (
            <>
              <MetadataDot />
              <span>
                remixed from{" "}
                <Link
                  className="text-foreground hover:text-primary transition"
                  href={`/lists/${list.remixSource.id}`}
                >
                  {list.remixSource.title}
                </Link>
              </span>
            </>
          ) : null}
          {canEdit ? (
            <>
              <MetadataDot />
              <VisibilityBadge isPublic={list.isPublic} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
