// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import RoomDetailPage from './pages/RoomDetailPage';

function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/rooms/:roomSlug" element={<RoomDetailPage />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </DataProvider>
    </LanguageProvider>
  );
}

export default App;