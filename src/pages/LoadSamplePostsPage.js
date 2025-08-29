import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useDeveloperAuth } from '../hooks/useDeveloperAuth';
import { addSamplePostsToAPI } from '../components/loadSamplePosts';

const LoadSamplePostsPage = () => {
  const { isAuthorized, loading: authLoading, currentKey } = useDeveloperAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

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
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleLoadSamplePosts = async () => {
    setLoading(true);
    setStatus('Loading sample posts...');
    
    try {
      // Create a custom version that provides feedback
      const response = await fetch('/data/sample-posts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      
      if (posts.length === 0) {
        setStatus('No sample posts found');
        toast.error('No sample posts found');
        return;
      }

      setStatus(`Found ${posts.length} sample posts. Adding to database...`);
      
      let successCount = 0;
      let errorCount = 0;
      const apiBaseUrl = 'http://localhost:8080/api/blogs';

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        try {
          setStatus(`Adding post ${i + 1}/${posts.length}: "${post.title}"`);
          
          const response = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
          });

          if (response.ok) {
            successCount++;
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`Failed to add "${post.title}":`, error.message);
          errorCount++;
        }
      }
      
      const finalStatus = `Finished! ${successCount} successful, ${errorCount} failed`;
      setStatus(finalStatus);
      
      if (successCount > 0) {
        toast.success(`Successfully loaded ${successCount} sample posts!`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to load ${errorCount} posts`);
      }
      
    } catch (error) {
      console.error('Error loading sample posts:', error);
      setStatus(`Error: ${error.message}`);
      toast.error(`Error loading sample posts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to={`/developer-dashboard?key=${currentKey}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Developer Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Load Sample Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              This is a developer tool to load sample blog posts into the database.
              <br />
              <strong>Warning:</strong> This will add new posts to your database.
            </p>
            
            <div className="space-y-6">
              <button
                onClick={handleLoadSamplePosts}
                disabled={loading}
                className={`
                  px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {loading ? 'Loading...' : 'Load Sample Posts'}
              </button>
              
              {status && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Status:</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap">
                    {status}
                  </p>
                </div>
              )}
              
              <div className="text-left bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-2xl mx-auto">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Developer Notes:
                </h3>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• This loads sample posts from <code>/public/data/sample-posts.json</code></li>
                  <li>• Posts are sent to <code>http://localhost:8080/api/blogs</code></li>
                  <li>• Make sure your backend server is running</li>
                  <li>• This route is only accessible by developers who know the URL</li>
                  <li>• Check browser console for detailed logs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadSamplePostsPage;
