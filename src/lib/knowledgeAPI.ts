import { supabase } from './supabase';

export interface KnowledgeItem {
  id: string;
  title: string;
  type: string;
  link?: string;
  content?: string;
  blocks?: any[]; // Keep old blocks data if any
  image?: string;
  category?: string;
  excerpt?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string;
  showTOC?: boolean;
}

export const knowledgeAPI = {
  async fetchItems(): Promise<KnowledgeItem[]> {
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async fetchActiveItems(): Promise<KnowledgeItem[]> {
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getItem(id: string): Promise<KnowledgeItem | null> {
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('knowledge_items')
      .insert([newItem])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateItem(id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const { data, error } = await supabase
      .from('knowledge_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('knowledge_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
  
  async syncLocalData(localData: any[]): Promise<void> {
    if (!localData || localData.length === 0) return;
    
    // First figure out what's currently in the DB to avoid duplicates
    const { data: existingIds, error } = await supabase
      .from('knowledge_items')
      .select('id');
      
    if (error) throw error;
    const idsSet = new Set(existingIds.map((item: any) => item.id));
    
    const recordsToInsert = localData.filter(item => !idsSet.has(item.id)).map((item, idx) => {
       return {
         id: item.id || crypto.randomUUID(),
         title: item.title || '',
         type: item.type || 'article',
         content: item.content || '',
         blocks: item.blocks || [],
         image: item.image || '',
         category: item.category || '',
         excerpt: item.excerpt || '',
         order_index: item.order_index ?? idx,
         is_active: item.is_active ?? (item.status === 'published' ? true : false),
         created_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
         updated_at: new Date().toISOString(),
       }
    });

    if (recordsToInsert.length > 0) {
       const { error: insertError } = await supabase.from('knowledge_items').insert(recordsToInsert);
       if (insertError) throw insertError;
    }
  }
};
