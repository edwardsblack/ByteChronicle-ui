# ByteChronicle Frontend

React-based frontend for the ByteChronicle blogging platform with modern UI/UX.

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **React Markdown** - Markdown rendering
- **Prism.js** - Code syntax highlighting
- **Lucide React** - Beautiful icons

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 

### Installation & Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - URL: http://localhost:3000
   - The app will automatically reload on file changes

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App (irreversible)
```

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico             # App icon
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── BlogCard.js         # Blog post card
│   │   ├── Footer.js           # Site footer
│   │   ├── Navbar.js           # Navigation bar
│   │   ├── TextToSpeech.js     # TTS functionality
│   │   └── ThemeToggle.js      # Dark/light mode toggle
│   ├── contexts/               # React contexts
│   │   ├── ThemeContext.js     # Theme management
│   │   └── ReadingPreferencesContext.js
│   ├── hooks/                  # Custom React hooks
│   │   └── useDeveloperAuth.js # Developer authentication
│   ├── pages/                  # Page components
│   │   ├── Home.js             # Homepage
│   │   ├── BlogDetail.js       # Blog post detail
│   │   ├── CreateBlog.js       # Blog creation
│   │   └── SearchResults.js    # Search results
│   ├── services/               # API services
│   │   └── blogService.js      # Blog API calls
│   ├── App.js                  # Main app component
│   ├── index.js                # App entry point
│   └── index.css               # Global styles
└── package.json                # Dependencies and scripts
```

## 🎨 Features

### Core Features
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - System preference detection + manual toggle
- **Markdown Support** - Full markdown rendering with syntax highlighting
- **Text-to-Speech** - Browser-based TTS with voice selection
- **Search** - Real-time search across posts and tags
- **Animations** - Smooth transitions with Framer Motion

### UI Components
- **BlogCard** - Post preview cards with hover effects
- **Navbar** - Responsive navigation with search
- **Footer** - Social links and site information
- **TextToSpeech** - Audio playback controls
- **ThemeToggle** - Dark/light mode switcher

## 🔧 Configuration

### Environment Variables
Create `.env` file in frontend directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_VERSION=1.0.0
```

### Tailwind Configuration
Custom configuration in `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { /* custom primary colors */ }
      }
    }
  }
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🔊 Text-to-Speech

### Browser Support
- Chrome/Edge: Full support
- Firefox: Limited voice selection
- Safari: Basic support
- Mobile: Varies by browser

### Features
- Voice selection
- Speed control (0.5x - 2x)
- Volume control
- Play/pause/stop controls
- Error handling for unsupported browsers

## 📊 Performance Optimizations

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy libraries


## 🚀 Production Build

### Build Process
```bash
npm run build
```