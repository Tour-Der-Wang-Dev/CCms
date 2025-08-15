import { supabase } from '../lib/supabase';

export const ayrshareService = {
  async getConnectedAccounts() {
    const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
      body: { action: 'getConnectedAccounts' },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async generateAuthUrl(platform: string) {
    const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
      body: { action: 'generateAuthUrl', platform },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async createPost(postData: any) {
    const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
      body: { action: 'createPost', postData },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async getPostHistory(params: { limit?: number }) {
    const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
      body: { action: 'getPostHistory', params },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async deletePost(postId: string) {
    const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
      body: { action: 'deletePost', postId },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async getAnalytics(params: { startDate: string; endDate: string }) {
    const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
      body: { action: 'getAnalytics', params },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async uploadMedia(file: File) {
    const reader = new FileReader();
    const base64File = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const { data, error } = await supabase.functions.invoke('ayrshare-proxy', {
      body: { action: 'uploadMedia', file: base64File, fileName: file.name, fileType: file.type },
    });

    if (error) throw new Error(error.message);
    return data;
  },
};