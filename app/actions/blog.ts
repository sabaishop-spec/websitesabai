'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/src/lib/supabase';

export async function saveBlogPost(updateData: any, isCreating: boolean, oldId?: string) {
  try {
    let finalId = updateData.id;
    let finalSlug = updateData.slug || finalId;
    
    // Auto-generate unique slug if it exists (for both creation and when changing slug)
    if (isCreating || (oldId && finalId !== oldId)) {
      let counter = 1;
      let existing = true;
      let currentIdToCheck = finalId;
      
      while (existing) {
        const { data } = await supabase.from('blogPosts').select('id').eq('id', currentIdToCheck).single();
        if (data) {
          counter++;
          currentIdToCheck = `${finalId}-${counter}`;
        } else {
          existing = false;
        }
      }
      finalId = currentIdToCheck;
      finalSlug = finalId;
      updateData.id = finalId;
      updateData.slug = finalSlug;
    }

    const { error } = await supabase.from('blogPosts').upsert(updateData);
    if (error) {
      console.error('Supabase upsert error:', error);
      return { success: false, error: 'Lỗi khi lưu vào Supabase: ' + error.message };
    }

    if (!isCreating && oldId && updateData.id !== oldId) {
      // If we changed the ID, we should permanently delete the old one so it doesn't leave duplicates in trash
      // unless that's intended, but deleting is cleaner when just renaming slug.
      const { error: deleteError } = await supabase.from('blogPosts').delete().eq('id', oldId);
      if (deleteError) {
        console.error('Supabase delete old post error:', deleteError);
      }
    }

    // Revalidate paths so the frontend gets fresh data!
    revalidatePath('/blog');
    revalidatePath(`/blog/${finalSlug}`);

    return { success: true, newId: finalId };
  } catch (err: any) {
    console.error('Server Action saveBlogPost error:', err);
    return { success: false, error: err.message || 'Lỗi không xác định.' };
  }
}

export async function deleteBlogPost(postId: string) {
  try {
    const { error } = await supabase.from('blogPosts').update({ status: 'trash', deletedAt: Date.now() }).eq('id', postId);
    if (error) {
      return { success: false, error: 'Lỗi khi xóa bài viết: ' + error.message };
    }
    revalidatePath('/blog');
    revalidatePath(`/blog/${postId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi không xác định.' };
  }
}

export async function permanentlyDeleteBlogPost(postId: string) {
  try {
    const { error } = await supabase.from('blogPosts').delete().eq('id', postId);
    if (error) {
      return { success: false, error: 'Lỗi khi xóa vĩnh viễn: ' + error.message };
    }
    revalidatePath('/blog');
    revalidatePath(`/blog/${postId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi không xác định.' };
  }
}

export async function bulkDeleteBlogPosts(postIds: string[]) {
  try {
    const { error } = await supabase.from('blogPosts').delete().in('id', postIds);
    if (error) {
      return { success: false, error: 'Lỗi khi xóa vĩnh viễn: ' + error.message };
    }
    revalidatePath('/blog');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi không xác định.' };
  }
}

export async function bulkTrashBlogPosts(postIds: string[]) {
  try {
    const { error } = await supabase.from('blogPosts').update({ status: 'trash', deletedAt: Date.now() }).in('id', postIds);
    if (error) {
      return { success: false, error: 'Lỗi khi chuyển vào thùng rác: ' + error.message };
    }
    revalidatePath('/blog');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi không xác định.' };
  }
}

