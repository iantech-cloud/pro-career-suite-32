import { BlogPost, CreateBlogPostRequest, UpdateBlogPostRequest, BlogCategory } from '@/types/blog';

// Mock data for demonstration
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to CV Writing in 2024',
    slug: 'ultimate-guide-cv-writing-2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    excerpt: 'Learn how to create a compelling CV that stands out to employers.',
    author: 'Career Expert',
    authorId: 'user1',
    status: 'published',
    category: 'CV Tips',
    tags: ['cv', 'career', 'tips'],
    views: 1250,
    featured: true,
    featuredImage: '/blog/cv-guide.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'How to Leverage Social Media for Job Search',
    slug: 'leverage-social-media-job-search',
    content: 'Social media has become an essential tool for modern job seekers...',
    excerpt: 'Discover strategies to use social media effectively in your job search.',
    author: 'Social Media Specialist',
    authorId: 'user2',
    status: 'draft',
    category: 'Job Search',
    tags: ['social media', 'job search', 'networking'],
    views: 0,
    featured: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Remote Work: Best Practices for Productivity',
    slug: 'remote-work-productivity-tips',
    content: 'Working remotely presents unique challenges and opportunities...',
    excerpt: 'Essential tips for staying productive while working from home.',
    author: 'Productivity Expert',
    authorId: 'user3',
    status: 'published',
    category: 'Remote Work',
    tags: ['remote work', 'productivity', 'work from home'],
    views: 875,
    featured: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    publishedAt: new Date('2024-01-08')
  }
];

const mockCategories: BlogCategory[] = [
  { id: '1', name: 'CV Tips', slug: 'cv-tips', description: 'Tips for creating better CVs', postCount: 5 },
  { id: '2', name: 'Job Search', slug: 'job-search', description: 'Job search strategies', postCount: 8 },
  { id: '3', name: 'Remote Work', slug: 'remote-work', description: 'Remote work guidance', postCount: 3 },
  { id: '4', name: 'Career Development', slug: 'career-development', description: 'Career growth tips', postCount: 6 }
];

export const blogService = {
  // Get all blog posts
  getAllPosts: async (): Promise<BlogPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockBlogPosts]), 300);
    });
  },

  // Get blog post by ID
  getPostById: async (id: string): Promise<BlogPost | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = mockBlogPosts.find(p => p.id === id);
        resolve(post || null);
      }, 300);
    });
  },

  // Create new blog post
  createPost: async (data: CreateBlogPostRequest): Promise<BlogPost> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost: BlogPost = {
          ...data,
          id: Date.now().toString(),
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          author: 'Admin User',
          authorId: 'admin',
          views: 0,
          featured: data.featured || false,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: data.status === 'published' ? new Date() : undefined
        };
        mockBlogPosts.unshift(newPost);
        resolve(newPost);
      }, 500);
    });
  },

  // Update blog post
  updatePost: async (data: UpdateBlogPostRequest): Promise<BlogPost> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBlogPosts.findIndex(p => p.id === data.id);
        if (index === -1) {
          reject(new Error('Post not found'));
          return;
        }

        const updatedPost = {
          ...mockBlogPosts[index],
          ...data,
          updatedAt: new Date(),
          publishedAt: data.status === 'published' && !mockBlogPosts[index].publishedAt 
            ? new Date() 
            : mockBlogPosts[index].publishedAt
        };

        mockBlogPosts[index] = updatedPost;
        resolve(updatedPost);
      }, 500);
    });
  },

  // Delete blog post
  deletePost: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBlogPosts.findIndex(p => p.id === id);
        if (index === -1) {
          reject(new Error('Post not found'));
          return;
        }
        mockBlogPosts.splice(index, 1);
        resolve();
      }, 300);
    });
  },

  // Get all categories
  getCategories: async (): Promise<BlogCategory[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockCategories]), 200);
    });
  }
};