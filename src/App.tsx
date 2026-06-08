import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { AssetDetails } from './pages/AssetDetails';
import { Dashboard } from './pages/Dashboard';
import { UploadPage } from './pages/UploadPage';
import { AdminPanel } from './pages/AdminPanel';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/asset/:id" element={<AssetDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}
