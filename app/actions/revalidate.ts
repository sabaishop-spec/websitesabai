'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateAll() {
  try {
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
