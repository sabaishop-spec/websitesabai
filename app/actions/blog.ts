'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/src/lib/supabase';

export async function saveBlogPost(updateData: any, isCreating: boolean, oldId?: string) {
  try {
    if (isCreating) {
      const { data: existing } = await supabase.from('blogPosts').select('id').eq('id', updateData.id).single();
      if (existing) {
        return { success: false, error: 'Đường dẫn này đã tồn tại, vui lòng chọn đường dẫn khác.' };
      }
    }

    const { error } = await supabase.from('blogPosts').upsert(updateData);
    if (error) {
      console.error('Supabase upsert error:', error);
      return { success: false, error: 'Lỗi khi lưu vào Supabase: ' + error.message };
    }

    if (!isCreating && oldId && updateData.id !== oldId) {
      const { error: trashError } = await supabase.from('blogPosts').update({ status: 'trash' }).eq('id', oldId);
      if (trashError) {
        console.error('Supabase trash error:', trashError);
        return { success: false, error: 'Lỗi khi xóa bài cũ: ' + trashError.message };
      }
    }

    // Revalidate paths so the frontend gets fresh data!
    revalidatePath('/blog');
    revalidatePath(`/blog/${updateData.slug || updateData.id}`);

    return { success: true };
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

