/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const blogService = {
  // Get all blogs with pagination
  getAllBlogs: async (page = 0, size = 10) => {
    const response = await api.get(`/blogs?page=${page}&size=${size}`);
    return response.data;
  },

  // Get blog by ID
  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  // Create new blog
  createBlog: async (blogData) => {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    await api.delete(`/blogs/${id}`);
  },

  // Search blogs
  searchBlogs: async (keyword, page = 0, size = 10) => {
    const response = await api.get(`/blogs/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    return response.data;
  },

  // Get blogs by tag
  getBlogsByTag: async (tag, page = 0, size = 10) => {
    const response = await api.get(`/blogs/tags/${encodeURIComponent(tag)}?page=${page}&size=${size}`);
    return response.data;
  },

  // Get all tags
  getAllTags: async () => {
    const response = await api.get('/blogs/tags');
    return response.data;
  },

  // Get pending blogs (for developer dashboard)
  getPendingBlogs: async () => {
    const response = await api.get('/blogs/pending');
    return response.data;
  },

  // Approve blog
  approveBlog: async (id) => {
    const response = await api.put(`/blogs/${id}/approve`);
    return response.data;
  },
};

export default blogService;
