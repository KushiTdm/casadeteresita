import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import RoomDetailPage from './pages/RoomDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import MuseumPage from './pages/MuseumPage';
import BlogPostDebugger from './pages/BlogPostDebugger';
import MuseumDetailPage from './pages/MuseumDetailPage';



function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/rooms/:roomSlug" element={<RoomDetailPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/museum" element={<MuseumPage />} />
                  <Route path="/museum/:slug" element={<MuseumDetailPage />} />
                  <Route path="/debug-blog" element={<BlogPostDebugger />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
          </Router>
        </DataProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;