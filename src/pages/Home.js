import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, ChevronLeft, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogCard from '../components/BlogCard';
import blogService from '../services/blogService';
import toast from 'react-hot-toast';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs(currentPage, 9);
      setBlogs(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await blogService.getAllTags();
      setTags(response.slice(0, 12)); // Show only first 12 tags
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="container-wide">
        <div className="flex justify-center items-center min-h-96">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 md:py-24"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Welcome to ByteChronicle</span>
          </motion.div>
          
          <h1 className="heading-1 mb-6">
            Where code meets
            <br />
            <span className="text-primary-600 dark:text-primary-400">storytelling</span>
          </h1>
          
          <p className="body-large text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover cutting-edge tech insights, programming tutorials, and developer stories. 
            Share your coding journey with our markdown-powered publishing platform.
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={() => document.getElementById('stories').scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-lg px-8 py-4"
            >
              Explore Stories
            </button>
          </div>
        </div>
      </motion.section>

      {/* Popular Tags */}
      {tags.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="heading-4">Trending Topics</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              >
                <Link
                  to={`/tag/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Blog Posts */}
      <section id="stories" className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="heading-3">Latest Stories</h2>
        </div>

        {blogs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="heading-4 text-gray-900 dark:text-white mb-2">No stories yet</h3>
            <p className="body-medium text-gray-600 dark:text-gray-400">Be the first to share your tech story with the world!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => {
              // Make first post featured on larger screens
              const variant = index === 0 && blogs.length > 1 ? 'featured' : 'default';
              return (
                <BlogCard 
                  key={blog.id} 
                  blog={blog} 
                  index={index}
                  variant={variant}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center space-x-4 pb-16"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage === pageNum
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.section>
      )}

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 text-center text-white mb-16"
      >
        <h2 className="heading-3 text-white mb-4">Ready to share your code story?</h2>
        <p className="body-large text-gray-300 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join our community of developers and tech enthusiasts. Create beautiful stories with our markdown editor.
        </p>
        <Link to="/create" className="btn-success">
          <PenTool className="w-5 h-5 mr-2" />
          Start Writing Today
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;
