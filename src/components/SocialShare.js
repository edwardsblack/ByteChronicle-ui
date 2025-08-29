/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link, Copy, Check } from 'lucide-react';

const SocialShare = ({ title, summary, url, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText = summary || '';

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-900/20',
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setIsOpen(false);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleSocialShare = (platform) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
        title="Share this article"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share</span>
      </button>

      {/* Share Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-large z-50 animate-slide-down">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Share this article
              </h3>
              
              {/* Social Platforms */}
              <div className="space-y-1 mb-4">
                {socialPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <button
                      key={platform.name}
                      onClick={() => handleSocialShare(platform)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 ${platform.color}`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Copy Link */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Link copied!</span>
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4" />
                      <span className="text-sm font-medium">Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;
