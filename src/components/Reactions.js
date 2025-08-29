/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, ThumbsUp, Smile, Zap } from 'lucide-react';

const Reactions = ({ blogId, className = '' }) => {
  const [reactions, setReactions] = useState({
    likes: 0,
    loves: 0,
    bookmarks: 0,
    claps: 0,
    smiles: 0,
  });
  
  const [userReactions, setUserReactions] = useState({
    likes: false,
    loves: false,
    bookmarks: false,
    claps: false,
    smiles: false,
  });

  const reactionTypes = [
    {
      key: 'likes',
      icon: ThumbsUp,
      label: 'Like',
      color: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      activeColor: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
    },
    {
      key: 'loves',
      icon: Heart,
      label: 'Love',
      color: 'text-red-600',
      hoverColor: 'hover:bg-red-50 dark:hover:bg-red-900/20',
      activeColor: 'bg-red-50 text-red-600 dark:bg-red-900/20',
    },
    {
      key: 'claps',
      icon: Zap,
      label: 'Clap',
      color: 'text-yellow-600',
      hoverColor: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
      activeColor: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20',
    },
    {
      key: 'smiles',
      icon: Smile,
      label: 'Smile',
      color: 'text-green-600',
      hoverColor: 'hover:bg-green-50 dark:hover:bg-green-900/20',
      activeColor: 'bg-green-50 text-green-600 dark:bg-green-900/20',
    },
    {
      key: 'bookmarks',
      icon: Bookmark,
      label: 'Bookmark',
      color: 'text-purple-600',
      hoverColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
      activeColor: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
    },
  ];

  useEffect(() => {
    // Load reactions from localStorage (in a real app, this would be from an API)
    const savedReactions = localStorage.getItem(`reactions_${blogId}`);
    const savedUserReactions = localStorage.getItem(`user_reactions_${blogId}`);
    
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions));
    }
    
    if (savedUserReactions) {
      setUserReactions(JSON.parse(savedUserReactions));
    }
  }, [blogId]);

  const handleReaction = (reactionKey) => {
    const isCurrentlyActive = userReactions[reactionKey];
    
    // Update user reactions
    const newUserReactions = {
      ...userReactions,
      [reactionKey]: !isCurrentlyActive,
    };
    
    // Update reaction counts
    const newReactions = {
      ...reactions,
      [reactionKey]: isCurrentlyActive 
        ? Math.max(0, reactions[reactionKey] - 1)
        : reactions[reactionKey] + 1,
    };
    
    setUserReactions(newUserReactions);
    setReactions(newReactions);
    
    // Save to localStorage (in a real app, this would be sent to an API)
    localStorage.setItem(`reactions_${blogId}`, JSON.stringify(newReactions));
    localStorage.setItem(`user_reactions_${blogId}`, JSON.stringify(newUserReactions));
    
    // Add animation effect
    const button = document.querySelector(`[data-reaction="${reactionKey}"]`);
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => {
        button.classList.remove('animate-pulse');
      }, 300);
    }
  };

  const getTotalReactions = () => {
    return Object.values(reactions).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {reactionTypes.map((reaction) => {
        const IconComponent = reaction.icon;
        const isActive = userReactions[reaction.key];
        const count = reactions[reaction.key];
        
        return (
          <button
            key={reaction.key}
            data-reaction={reaction.key}
            onClick={() => handleReaction(reaction.key)}
            className={`group relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? reaction.activeColor 
                : `text-gray-600 dark:text-gray-400 ${reaction.hoverColor}`
            }`}
            title={`${reaction.label} this article`}
          >
            <IconComponent 
              className={`w-4 h-4 transition-all duration-200 ${
                isActive 
                  ? reaction.color 
                  : 'group-hover:scale-110'
              }`}
              fill={isActive ? 'currentColor' : 'none'}
            />
            {count > 0 && (
              <span className={`text-xs font-medium ${
                isActive ? reaction.color : 'text-gray-500 dark:text-gray-400'
              }`}>
                {count}
              </span>
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {reaction.label}
            </div>
          </button>
        );
      })}
      
      {/* Total reactions count */}
      {getTotalReactions() > 0 && (
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {getTotalReactions()} reaction{getTotalReactions() !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default Reactions;
