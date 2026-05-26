import { revalidatePath } from "next/cache";

export function revalidateRankexListSurface(listId?: number) {
  revalidatePath("/dashboard");
  revalidatePath("/explore");

  if (listId) {
    revalidatePath(`/lists/${listId}`);
  }
}

export function revalidateRankexProfileSurface() {
  revalidatePath("/dashboard");
  revalidatePath("/explore");
  revalidatePath("/profile");
  revalidatePath("/settings");
}

export function revalidateRankexAuthSurface() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/explore");
  revalidatePath("/settings");
}
