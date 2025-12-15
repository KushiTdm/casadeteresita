import React, { useEffect } from 'react'; // <-- Importez useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import netlifyIdentity from 'netlify-identity-widget'; // <-- Importez netlifyIdentity
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

function App() {
  
  // --- NOUVEAU CODE D'INITIALISATION ---
  useEffect(() => {
    // 1. Initialiser Netlify Identity
    // Cette fonction scanne automatiquement l'URL (le hash #invite_token=...)
    // et ouvre la modale de création de mot de passe si un token est présent.
    netlifyIdentity.init(); 

    // Optionnel mais recommandé : Écouter la connexion pour rediriger
    netlifyIdentity.on('login', () => {
        // Rediriger vers l'interface d'administration après connexion
        // Ceci est crucial si vous utilisez Netlify CMS
        netlifyIdentity.close();
        // Optionnel: window.location.href = '/admin/';
    });
    
    // Nettoyage : retirer l'écouteur si le composant est démonté
    return () => {
        netlifyIdentity.off('login');
    };
  }, []); // [] garantit que cela s'exécute uniquement au montage

  // --- FIN DU NOUVEAU CODE ---


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