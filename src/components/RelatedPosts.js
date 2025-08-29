import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import blogService from '../services/blogService';

const RelatedPosts = ({ currentBlogId, tags = [], className = '' }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentBlogId, tags]);

  const fetchRelatedPosts = async () => {
    try {
      setLoading(true);
      
      // Get all blogs
      const allBlogs = await blogService.getAllBlogs(0, 50);
      
      // Filter and score related posts
      const scoredPosts = allBlogs.content
        .filter(blog => blog.id !== parseInt(currentBlogId))
        .map(blog => ({
          ...blog,
          score: calculateRelatednessScore(blog, tags),
        }))
        .filter(blog => blog.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      
      setRelatedPosts(scoredPosts);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRelatednessScore = (blog, currentTags) => {
    let score = 0;
    
    if (!blog.tags || !currentTags) return score;
    
    // Score based on common tags
    const commonTags = blog.tags.filter(tag => 
      currentTags.some(currentTag => 
        currentTag.toLowerCase() === tag.toLowerCase()
      )
    );
    
    score += commonTags.length * 10;
    
    // Bonus for exact tag matches
    score += commonTags.length === currentTags.length ? 5 : 0;
    
    // Slight bonus for recent posts
    const daysSinceCreated = Math.floor(
      (new Date() - new Date(blog.createdAt)) / (1000 * 60 * 60 * 24)
    );
    score += Math.max(0, 30 - daysSinceCreated) * 0.1;
    
    return score;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="heading-4 mb-6">Related Articles</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="heading-4 mb-6 text-gray-900 dark:text-white">
        Related Articles
      </h3>
      
      <div className="space-y-6">
        {relatedPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <Link 
              to={`/blog/${post.id}`}
              className="block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
            >
              <div className="flex space-x-4">
                {/* Thumbnail */}
                {post.featuredImage ? (
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                      {post.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2 mb-2">
                    {truncateText(post.title, 80)}
                  </h4>
                  
                  {post.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {truncateText(post.summary, 100)}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    
                    {post.readingTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} min</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Common tags */}
                  {post.tags && tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags
                        .filter(tag => tags.some(currentTag => 
                          currentTag.toLowerCase() === tag.toLowerCase()
                        ))
                        .slice(0, 2)
                        .map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))
                      }
                    </div>
                  )}
                </div>
                
                {/* Arrow */}
                <div className="flex-shrink-0 flex items-center">
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
      
      {/* View more link */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
        >
          <span>Explore more articles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default RelatedPosts;
