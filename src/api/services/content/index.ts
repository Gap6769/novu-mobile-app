import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../config/config';
import { api } from '../../config/axios';
import { Novel, Chapter } from '../../../types/api';

// Hooks para novelas
export const useNovels = () => {
  return useQuery({
    queryKey: ['novels'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.NOVELS);
      return response.data;
    },
  });
};

export const useNovel = (id: string) => {
  return useQuery({
    queryKey: ['novel', id],
    queryFn: async () => {
      const response = await api.get(`${API_ENDPOINTS.NOVELS}/${id}`);
      return response.data;
    },
  });
};

export const useCreateNovel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (novelData: {
      title: string;
      source_url: string;
      source_name: string;
      source_language: string;
      type: 'novel' | 'manhwa';
    }) => {
      const response = await api.post(API_ENDPOINTS.NOVELS, novelData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['novels'] });
    }
  });
};

export const useUpdateNovel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...novelData }: {
      id: string;
      title?: string;
      author?: string;
      cover_image_url?: string;
      status?: string;
      type?: 'novel' | 'manhwa';
      source_language?: string;
      source_name?: string;
      source_url?: string;
      description?: string;
      tags?: string[];
    }) => {
      const response = await api.patch(`${API_ENDPOINTS.NOVELS}/${id}`, novelData);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['novel', id] });
      queryClient.invalidateQueries({ queryKey: ['novels'] });
    }
  });
};

export const useDeleteNovel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_ENDPOINTS.NOVELS}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['novels'] });
    }
  });
};

// Hooks para capítulos
export const useChapters = (novelId: string, page: number = 1, sortOrder: 'asc' | 'desc' = 'desc') => {
  return useQuery({
    queryKey: ['chapters', novelId, page, sortOrder],
    queryFn: async () => {
      const response = await api.get(`${API_ENDPOINTS.NOVELS}/${novelId}/chapters?page=${page}&sort_order=${sortOrder}`);
      return {
        chapters: response.data.chapters,
        total_pages: response.data.total_pages || 0,
        page: response.data.page,
        page_size: response.data.page_size
      };
    },
  });
};

interface ChapterContent {
  title: string;
  content?: string;
  chapter_number: number;
  novel_id: string;
  type?: 'novel' | 'manhwa';
  images?: Array<{
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
  }>;
}

export const useChapter = (novelId: string, chapterNumber: number) => {
  return useQuery({
    queryKey: ['chapter', novelId, chapterNumber],
    queryFn: async () => {
      try {
        const response = await api.get(
          `${API_ENDPOINTS.CHAPTERS.replace(':novelId', novelId)}/${chapterNumber}?format=raw&language=es`
        );
        return response.data as ChapterContent;
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw error;
      }
    },
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

export const useReadingProgress = (novelId: string, chapterNumber: number) => {
  return useQuery({
    queryKey: ['readingProgress', novelId, chapterNumber],
    queryFn: async () => {
      const response = await api.get(
        `${API_ENDPOINTS.NOVELS}/${novelId}/chapters/${chapterNumber}/progress`
      );
      return response.data as ReadingProgress;
    },
    enabled: !!novelId && !!chapterNumber,
    gcTime: 0,
  });
};

export const useUpdateReadingProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ novelId, chapterNumber, progress }: { novelId: string; chapterNumber: number; progress: number }) => {
      console.log('Updating reading progress:', { novelId, chapterNumber, progress });
      const response = await api.post(
        `${API_ENDPOINTS.NOVELS}/${novelId}/chapters/${chapterNumber}/progress?progress=${progress}`,
        {}
      );
      console.log('Progress update response:', response.data);
      return response.data as ReadingProgress;
    },
    onSuccess: (_, { novelId, chapterNumber }) => {
      console.log('Progress update successful');
      queryClient.invalidateQueries({
        queryKey: ['readingProgress', novelId, chapterNumber]
      });
    },
    onError: (error) => {
      console.error('Error updating progress:', error);
    }
  });
};

export const useFetchChapters = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (novelId: string) => {
      const response = await api.post(`${API_ENDPOINTS.NOVELS}/${novelId}/chapters/fetch`);
      return response.data;
    },
    onSuccess: (_, novelId) => {
      queryClient.invalidateQueries({ queryKey: ['chapters', novelId] });
      queryClient.invalidateQueries({ queryKey: ['novel', novelId] });
    }
  });
};

export const useSources = () => {
  return useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.SOURCES);
      return response.data;
    },
  });
};

interface ReadingProgress {
  _id: string;
  user_id: string;
  chapter_id: string;
  progress: number;
  last_updated: string;
} 