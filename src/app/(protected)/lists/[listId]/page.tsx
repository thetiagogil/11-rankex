import { notFound } from "next/navigation";

import { ListDetailView } from "@/app/(protected)/lists/[listId]/_components/list-detail-view";
import { normalizeListId } from "@/features/lists/lib/validation";
import { getListById } from "@/features/lists/server/queries";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/shared/server/auth";

type ListDetailPageProps = {
  params: Promise<{
    listId: string;
  }>;
};

export default async function ListDetailPage({ params }: ListDetailPageProps) {
  const { listId } = await params;
  const parsedListId = normalizeListId(listId);

  if (!parsedListId) notFound();

  const currentUser = await requireUser();
  const client = await createClient();
  const list = await getListById(client, parsedListId, currentUser.id);

  if (!list) notFound();

  return <ListDetailView currentUserId={currentUser.id} list={list} />;
}
