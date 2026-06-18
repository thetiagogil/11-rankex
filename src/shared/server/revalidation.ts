import { revalidatePath } from "next/cache";

export const revalidateRankexListSurface = (listId?: number) => {
  revalidatePath("/dashboard");
  revalidatePath("/explore");

  if (listId) {
    revalidatePath(`/lists/${listId}`);
  }
};

export const revalidateRankexProfileSurface = () => {
  revalidatePath("/dashboard");
  revalidatePath("/explore");
  revalidatePath("/profile");
  revalidatePath("/settings");
};

export const revalidateRankexAuthSurface = () => {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/explore");
  revalidatePath("/settings");
};
