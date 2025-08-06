import apiClient from '@/services/apiClient';

export interface CvData {
  id: string;
  title: string;
  template: string;
  content: Record<string, any>;
  lastModified: Date;
  createdAt: Date;
  userId: string;
}

export class CvService {
  static async getCvs(): Promise<CvData[]> {
    const token = localStorage.getItem('token');
    const response = await apiClient.get('/cvs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }

  static async getCv(id: string): Promise<CvData> {
    const token = localStorage.getItem('token');
    const response = await apiClient.get(`/cvs/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }

  static async createCv(cvData: Partial<CvData>): Promise<CvData> {
    const token = localStorage.getItem('token');
    const response = await apiClient.post('/cvs', cvData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }

  static async updateCv(id: string, cvData: Partial<CvData>): Promise<CvData> {
    const token = localStorage.getItem('token');
    const response = await apiClient.put(`/cvs/${id}`, cvData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }

  static async deleteCv(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    await apiClient.delete(`/cvs/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async enhanceWithAi(text: string): Promise<string> {
    const token = localStorage.getItem('token');
    const response = await apiClient.post('/ai/enhance', { text }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data.enhancedText;
  }
}