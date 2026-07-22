'use server';

import { revalidatePath, updateTag } from 'next/cache';

export async function revalidateNewsCache() {
  updateTag('news');
  revalidatePath('/ban-tin', 'layout');
}
