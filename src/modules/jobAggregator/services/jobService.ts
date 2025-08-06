// Job Aggregator service for handling job-related operations
import { tokenStorage } from '@/lib/security';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  source: string;
  url: string;
  isSaved: boolean;
}

export interface JobSearchFilters {
  query?: string;
  location?: string;
  type?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
}

export interface JobAlert {
  id: string;
  title: string;
  filters: JobSearchFilters;
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  createdAt: Date;
}

export class JobService {
  static async searchJobs(filters: JobSearchFilters): Promise<Job[]> {
    try {
      // API call to Node.js backend
      const queryParams = new URLSearchParams();
      if (filters.query) queryParams.append('query', filters.query);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.remote) queryParams.append('remote', 'true');
      
      const response = await fetch(`/api/jobs/search?${queryParams}`, {
        headers: { 
          'Authorization': `Bearer ${tokenStorage.getToken()}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search jobs: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mark saved jobs
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      return data.map((job: Job) => ({
        ...job,
        isSaved: savedJobs.includes(job.id)
      }));
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      // Fallback mock data for development
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          type: 'full-time',
          salary: '$120,000 - $150,000',
          description: 'We are looking for a Senior Frontend Developer to join our team...',
          requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
          postedDate: new Date('2024-01-15'),
          source: 'Company Website',
          url: 'https://techcorp.com/jobs/senior-frontend',
          isSaved: false
        },
        {
          id: '2',
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          type: 'remote',
          salary: '$100,000 - $130,000',
          description: 'Join our growing startup as a Full Stack Engineer...',
          requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          postedDate: new Date('2024-01-12'),
          source: 'LinkedIn',
          url: 'https://startupxyz.com/careers',
          isSaved: false
        }
      ];
      
      // Apply filters to mock data
      return mockJobs.filter(job => {
        if (filters.query && !job.title.toLowerCase().includes(filters.query.toLowerCase()) && 
            !job.company.toLowerCase().includes(filters.query.toLowerCase())) {
          return false;
        }
        if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
        if (filters.type && job.type !== filters.type) {
          return false;
        }
        if (filters.remote && job.type !== 'remote') {
          return false;
        }
        return true;
      });
    }
  }

  static async getJob(id: string): Promise<Job> {
    const jobs = await this.searchJobs({});
    const job = jobs.find(j => j.id === id);
    if (!job) throw new Error('Job not found');
    return job;
  }

  static async getSavedJobs(): Promise<Job[]> {
    // Return jobs marked as saved
    const allJobs = await this.searchJobs({});
    return allJobs.filter(job => job.isSaved);
  }

  static async saveJob(jobId: string): Promise<void> {
    try {
      // API call to Node.js backend
      const response = await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${tokenStorage.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save job');
      }
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      // Fallback to local storage
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      if (!savedJobs.includes(jobId)) {
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      }
    }
  }

  static async unsaveJob(jobId: string): Promise<void> {
    try {
      // API call to Node.js backend
      const response = await fetch('/api/jobs/unsave', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${tokenStorage.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to unsave job');
      }
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      // Fallback to local storage
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const updatedSavedJobs = savedJobs.filter((id: string) => id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    }
  }

  static async applyToJob(jobId: string, cvId: string, coverLetter?: string): Promise<void> {
    try {
      // API call to Node.js backend
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${tokenStorage.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId, cvId, coverLetter })
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply to job');
      }
    } catch (error) {
      console.warn('API not available, simulating application:', error);
      // Simulate job application
      console.log(`Applied to job ${jobId} with CV ${cvId}`, { coverLetter });
    }
  }

  static async getJobAlerts(): Promise<JobAlert[]> {
    const alerts = localStorage.getItem('jobAlerts');
    return alerts ? JSON.parse(alerts) : [];
  }

  static async createJobAlert(alert: Partial<JobAlert>): Promise<JobAlert> {
    const newAlert: JobAlert = {
      id: Date.now().toString(),
      title: alert.title || 'New Job Alert',
      filters: alert.filters || {},
      frequency: alert.frequency || 'daily',
      isActive: alert.isActive ?? true,
      createdAt: new Date()
    };

    const alerts = await this.getJobAlerts();
    alerts.push(newAlert);
    localStorage.setItem('jobAlerts', JSON.stringify(alerts));
    return newAlert;
  }

  static async updateJobAlert(id: string, alert: Partial<JobAlert>): Promise<JobAlert> {
    const alerts = await this.getJobAlerts();
    const index = alerts.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Job alert not found');

    alerts[index] = { ...alerts[index], ...alert };
    localStorage.setItem('jobAlerts', JSON.stringify(alerts));
    return alerts[index];
  }

  static async deleteJobAlert(id: string): Promise<void> {
    const alerts = await this.getJobAlerts();
    const filteredAlerts = alerts.filter(a => a.id !== id);
    localStorage.setItem('jobAlerts', JSON.stringify(filteredAlerts));
  }
}