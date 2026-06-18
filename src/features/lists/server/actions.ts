"use server";

import {
  createItemAction as createItemActionImpl,
  deleteItemAction as deleteItemActionImpl,
  updateItemAction as updateItemActionImpl,
} from "@/features/lists/server/item-actions";
import {
  createListAction as createListActionImpl,
  deleteListAction as deleteListActionImpl,
  updateListAction as updateListActionImpl,
} from "@/features/lists/server/list-actions";
import {
  reorderItemsAction as reorderItemsActionImpl,
  reorderItemsWithTiersAction as reorderItemsWithTiersActionImpl,
} from "@/features/lists/server/reorder-actions";

export const createListAction = async (
  ...args: Parameters<typeof createListActionImpl>
) => createListActionImpl(...args);

export const updateListAction = async (
  ...args: Parameters<typeof updateListActionImpl>
) => updateListActionImpl(...args);

export const deleteListAction = async (
  ...args: Parameters<typeof deleteListActionImpl>
) => deleteListActionImpl(...args);

export const createItemAction = async (
  ...args: Parameters<typeof createItemActionImpl>
) => createItemActionImpl(...args);

export const updateItemAction = async (
  ...args: Parameters<typeof updateItemActionImpl>
) => updateItemActionImpl(...args);

export const deleteItemAction = async (
  ...args: Parameters<typeof deleteItemActionImpl>
) => deleteItemActionImpl(...args);

export const reorderItemsAction = async (
  ...args: Parameters<typeof reorderItemsActionImpl>
) => reorderItemsActionImpl(...args);

export const reorderItemsWithTiersAction = async (
  ...args: Parameters<typeof reorderItemsWithTiersActionImpl>
) => reorderItemsWithTiersActionImpl(...args);
