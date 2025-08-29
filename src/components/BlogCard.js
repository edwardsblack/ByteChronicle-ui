import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogCard = ({ blog, index = 0, variant = 'default' }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  // Featured card variant (larger, spans 2 columns)
  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="col-span-1 md:col-span-2 card-minimal group cursor-pointer"
      >
        <Link to={`/blog/${blog.id}`} className="block">
          {blog.featuredImage && (
            <div className="aspect-[2/1] overflow-hidden">
              <img 
                src={blog.featuredImage} 
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          )}
          
          <div className="p-8">
            {/* Meta information */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              {blog.author && (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium">{blog.author}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              
              {blog.readingTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readingTime} min read</span>
                </div>
              )}
            </div>

            <h2 className="heading-3 mb-4 group-hover:text-primary-700 transition-colors duration-200">
              {blog.title}
            </h2>

            {blog.summary && (
              <p className="body-large text-gray-600 mb-6 leading-relaxed">
                {truncateText(blog.summary, 200)}
              </p>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.slice(0, 4).map((tag, tagIndex) => (
                  <Link
                    key={tagIndex}
                    to={`/tag/${encodeURIComponent(tag)}`}
                    className="tag-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {tag}
                  </Link>
                ))}
                {blog.tags.length > 4 && (
                  <span className="tag">
                    +{blog.tags.length - 4} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
                Read full story
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Default card variant
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-minimal group cursor-pointer"
    >
      <Link to={`/blog/${blog.id}`} className="block">
        {blog.featuredImage && (
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Author and date */}
          <div className="flex items-center space-x-3 mb-3">
            {blog.author && (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{blog.author}</span>
              </div>
            )}
            
            <span className="text-sm text-gray-500">·</span>
            <span className="text-sm text-gray-500">{formatDate(blog.createdAt)}</span>
            
            {blog.readingTime && (
              <>
                <span className="text-sm text-gray-500">·</span>
                <span className="text-sm text-gray-500">{blog.readingTime} min</span>
              </>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors duration-200 leading-tight">
            {truncateText(blog.title, 80)}
          </h3>

          {blog.summary && (
            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
              {truncateText(blog.summary, 120)}
            </p>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                <Link
                  key={tagIndex}
                  to={`/tag/${encodeURIComponent(tag)}`}
                  className="tag"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag}
                </Link>
              ))}
              {blog.tags.length > 2 && (
                <span className="tag">
                  +{blog.tags.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
              Read more
            </span>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
