import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container-wide py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <Link to="/" className="flex items-center space-x-3 group mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Byte</span>
                <span className="text-xl font-light text-primary-600 dark:text-primary-400 ml-0">Chronicle</span>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-center md:text-left max-w-md">
              Where code meets storytelling. A modern blogging platform for developers and tech enthusiasts.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/Prasadkotkar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 group"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
            </a>
            <a
              href="https://www.linkedin.com/in/prasad-kotkar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} ByteChronicle. Built with ❤️ using Spring Boot and React.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
