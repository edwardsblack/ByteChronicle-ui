/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

// This script can be used to load sample posts from the public directory
// Sample posts loader for ByteChronicle
async function loadSamplePosts() {
  try {
    const response = await fetch('/data/sample-posts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error loading sample posts:', error);
    return [];
  }
}

async function addSamplePostsToAPI(apiBaseUrl = 'http://localhost:8080/api/blogs') {
  const posts = await loadSamplePosts();
  
  if (posts.length === 0) {
    console.log('No sample posts to load');
    return;
  }

  console.log(`Loading ${posts.length} sample posts...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    try {
      console.log(`Adding post ${i + 1}/${posts.length}: "${post.title}"`);
      
      const response = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });

      if (response.ok) {
        console.log(`✅ Successfully added: "${post.title}"`);
        successCount++;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to add "${post.title}":`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n🎉 Finished loading sample posts!`);
  console.log(`📊 Summary: ${successCount} successful, ${errorCount} failed`);
  
  if (successCount > 0) {
    console.log('\n🌐 Sample posts are now available in ByteChronicle!');
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadSamplePosts, addSamplePostsToAPI };
}

// // Make available globally in browser
// if (typeof window !== 'undefined') {
//   window.ByteChronicle = {
//     loadSamplePosts,
//     addSamplePostsToAPI
//   };
// }

