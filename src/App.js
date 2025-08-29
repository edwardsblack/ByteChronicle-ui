import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { ReadingPreferencesProvider } from './contexts/ReadingPreferencesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import SearchResults from './pages/SearchResults';
import TagResults from './pages/TagResults';
import LoadSamplePostsPage from './pages/LoadSamplePostsPage';
import TTSTestPage from './pages/TTSTestPage';
import DeveloperDashboard from './pages/DeveloperDashboard';

function App() {
  return (
    <ThemeProvider>
      <ReadingPreferencesProvider>
        <Router>
          <div className="min-h-screen bg-gray-25 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="pt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/create" element={<CreateBlog />} />
                <Route path="/write" element={<CreateBlog />} />
                <Route path="/write/:id" element={<EditBlog />} />
                <Route path="/edit/:id" element={<EditBlog />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/tag/:tag" element={<TagResults />} />
                <Route path="/data/load-sample-posts" element={<LoadSamplePostsPage />} />
                <Route path="/tts-test-page" element={<TTSTestPage />} />
                {/* Developer dashboard page route - only acccese via API KEY*/}
                <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
                {/* TTS Test Route - only in development */}
                {/* {process.env.NODE_ENV === 'development' && (
                  <Route path="/tts-test" element={<TTSTest />} />
                )} */}
              </Routes>
            </main>
            <Footer />
            
            {/* Toast notifications with theme-aware design */}
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                className: 'dark:bg-gray-800 dark:text-gray-100',
                style: {
                  borderRadius: '12px',
                  padding: '16px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2), 0 2px 10px -2px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  className: 'dark:bg-green-800 dark:text-green-100',
                  style: {
                    background: '#22c55e',
                    color: '#ffffff',
                  },
                  iconTheme: {
                    primary: '#ffffff',
                    secondary: '#22c55e',
                  },
                },
                error: {
                  className: 'dark:bg-red-800 dark:text-red-100',
                  style: {
                    background: '#ef4444',
                    color: '#ffffff',
                  },
                  iconTheme: {
                    primary: '#ffffff',
                    secondary: '#ef4444',
                  },
                },
                loading: {
                  className: 'dark:bg-yellow-800 dark:text-yellow-100',
                  style: {
                    background: '#f59e0b',
                    color: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ReadingPreferencesProvider>
    </ThemeProvider>
  );
}

export default App;
