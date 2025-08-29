/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useReadingPreferences } from '../contexts/ReadingPreferencesContext';
import blogService from '../services/blogService';
import toast from 'react-hot-toast';
import TextToSpeech from '../components/TextToSpeech';
import SocialShare from '../components/SocialShare';
import Reactions from '../components/Reactions';
import RelatedPosts from '../components/RelatedPosts';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { preferences } = useReadingPreferences();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogById(id);
      setBlog(response);
    } catch (error) {
      toast.error('Failed to fetch blog post');
      console.error('Error fetching blog:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  const getContainerClass = () => {
    const widthClasses = {
      narrow: 'container-narrow',
      medium: 'container-medium',
      wide: 'container-wide',
    };
    return widthClasses[preferences.maxWidth] || 'container-narrow';
  };

  const getFontFamilyClass = () => {
    const fontClasses = {
      serif: 'font-serif',
      sans: 'font-sans',
      mono: 'font-mono',
    };
    return fontClasses[preferences.fontFamily] || 'font-serif';
  };

  if (loading) {
    return (
      <div className="container-narrow">
        <div className="flex justify-center items-center min-h-96">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container-narrow text-center py-20">
        <h2 className="heading-3 text-gray-900 dark:text-white mb-4">Story not found</h2>
        <p className="body-medium text-gray-600 dark:text-gray-400 mb-6">The story you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={getContainerClass()}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Article Header */}
      <header className="mb-12">
        <h1 className={`heading-1 mb-6 ${getFontFamilyClass()}`}>
          {blog.title}
        </h1>

        {blog.summary && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-light">
            {blog.summary}
          </p>
        )}

        {/* Author and Meta Info */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {blog.author && (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{blog.author}</p>
                  <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(blog.createdAt)}</span>
                    {blog.readingTime && (
                      <>
                        <span>·</span>
                        <span>{blog.readingTime} min read</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <SocialShare 
              title={blog.title}
              summary={blog.summary}
              url={window.location.href}
            />
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/tag/${encodeURIComponent(tag)}`}
                className="tag-primary"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Text-to-Speech Player */}
        <div className="mb-8">
          <TextToSpeech 
            text={blog.content}
          />
        </div>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="aspect-[2/1] overflow-hidden rounded-2xl mb-12">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Article Content */}
      <article className={`prose prose-lg dark:prose-invert max-w-none mb-16 ${getFontFamilyClass()}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {blog.content}
        </ReactMarkdown>
      </article>

      {/* Reactions */}
      <div className="mb-12">
        <Reactions blogId={blog.id} />
      </div>

      {/* Article Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SocialShare 
              title={blog.title}
              summary={blog.summary}
              url={window.location.href}
            />
          </div>
          
          {blog.updatedAt !== blog.createdAt && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formatDate(blog.updatedAt)}
            </div>
          )}
        </div>
      </footer>

      {/* Related Posts */}
      <div className="mb-16">
        <RelatedPosts 
          currentBlogId={blog.id}
          tags={blog.tags}
        />
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center">
        <h3 className="heading-4 mb-4 text-gray-900 dark:text-white">Enjoyed this story?</h3>
        <p className="body-medium text-gray-600 dark:text-gray-400 mb-6">
          Discover more amazing stories or share your own with our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-secondary">
            More Stories
          </Link>
          <Link to="/create" className="btn-primary">
            Write Your Story
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetail;
