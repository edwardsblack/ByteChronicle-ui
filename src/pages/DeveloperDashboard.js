/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Edit, Eye, Calendar, User, Tag, Trash2 } from 'lucide-react';
import { useDeveloperAuth } from '../hooks/useDeveloperAuth';
import DeveloperKeyManager from '../components/DeveloperKeyManager';
import blogService from '../services/blogService';

const DeveloperDashboard = () => {
  const { isAuthorized, loading: authLoading, currentKey } = useDeveloperAuth();
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    if (isAuthorized) {
      fetchPendingBlogs();
    }
  }, [isAuthorized]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">Validating access...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Invalid or missing developer key</p>
        </div>
      </div>
    );
  }

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getPendingBlogs();
      setPendingBlogs(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error fetching pending blogs:', err);
      setError('Failed to fetch pending blogs');
      setPendingBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (blogId) => {
    try {
      await blogService.approveBlog(blogId);
      setPendingBlogs(prev => (prev || []).filter(blog => blog.id !== blogId));
      setError(null);
    } catch (err) {
      console.error('Error approving blog:', err);
      setError('Failed to approve blog');
    }
  };

  const handleReject = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      setPendingBlogs(prev => (prev || []).filter(blog => blog.id !== blogId));
      setError(null);
    } catch (err) {
      console.error('Error rejecting blog:', err);
      setError('Failed to reject blog');
    }
  };

  const handleDeleteById = async () => {
    if (!deleteId) return;
    
    try {
      await blogService.deleteBlog(parseInt(deleteId));
      setPendingBlogs(prev => (prev || []).filter(blog => blog.id !== parseInt(deleteId)));
      setDeleteId('');
      setError(null);
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError(`Failed to delete blog with ID: ${deleteId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Developer Dashboard</h1>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/tts-test-page?key=${currentKey}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              TTS Test Page
            </Link>
            <Link
              to={`/data/load-sample-posts?key=${currentKey}`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Load Sample Posts
            </Link>
            <Link
              to="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Public Site
            </Link>
          </div>
        </div>

        {/* Developer Key Management */}
        <div className="mb-8">
          <DeveloperKeyManager />
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Delete by ID Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delete Blog by ID</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blog ID
                </label>
                <input
                  type="number"
                  value={deleteId}
                  onChange={(e) => setDeleteId(e.target.value)}
                  placeholder="Enter blog ID to delete"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleDeleteById}
                disabled={!deleteId}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Pending Blogs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pending Blog Approvals ({(pendingBlogs || []).length})</h2>
          </div>

          {(!pendingBlogs || pendingBlogs.length === 0) ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No pending blogs for approval
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {(pendingBlogs || []).map((blog) => (
                <div key={blog.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {blog.summary}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        {blog.tags && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>{blog.tags.join(', ')}</span>
                          </div>
                        )}
                        <div className="text-blue-600 dark:text-blue-400">
                          ID: {blog.id}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/blog/${blog.id}?preview=true&key=${currentKey}`}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/write/${blog.id}?key=${currentKey}`}
                        className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleApprove(blog.id)}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(blog.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
