import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import MyListingsPage from './pages/MyListingsPage';
import Profile from './pages/Profile';
import PublicProfilePage from './pages/PublicProfilePage';
import ChatPage from './pages/ChatPage';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { Toaster } from "@/components/ui/sonner";
import FloatingChatButton from './components/FloatingChatButton';

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  // --- THIS IS THE FIX ---
  // The /chat route is removed from this array, so the Navbar and Footer will now appear on the chat page.
  const noNavFooterPaths = []; 
  // --- END FIX ---
  const showLayout = !noNavFooterPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {showLayout && <Navbar />}
      <main className={showLayout ? "pt-16" : ""}>{children}</main>
      {showLayout && <Footer />}
      {showLayout && <FloatingChatButton />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <LayoutWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/profile/:userId" element={<PublicProfilePage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/create-listing" element={<CreatePropertyPage />} />
                <Route path="/edit-listing/:id" element={<EditPropertyPage />} />
                <Route path="/my-listings" element={<MyListingsPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:conversationId" element={<ChatPage />} />
              </Route>
            </Routes>
          </LayoutWrapper>
          <Toaster richColors />
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;