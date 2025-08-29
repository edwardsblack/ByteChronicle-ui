/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogCard from '../components/BlogCard';
import blogService from '../services/blogService';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (query) {
      searchBlogs();
    }
  }, [query, currentPage]);

  const searchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.searchBlogs(query, currentPage, 6);
      setBlogs(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to search blogs');
      console.error('Error searching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-6 h-6 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          <p className="text-gray-600">
            {blogs.length > 0 
              ? `Found ${blogs.length} result${blogs.length !== 1 ? 's' : ''} for "${query}"`
              : `No results found for "${query}"`
            }
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try searching with different keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>
        )}

        {/* Pagination would go here if needed */}
      </motion.div>
    </div>
  );
};

export default SearchResults;
