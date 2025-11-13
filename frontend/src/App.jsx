import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FindRoommate from "./pages/FindRoommate";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";
import PublicProfilePage from "./pages/PublicProfilePage";
import CreatePropertyPage from "./pages/CreatePropertyPage";
import MyListingsPage from "./pages/MyListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./pages/AdminDashboard";
import PremiumPage from "./pages/PremiumPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import FloatingChatButton from "./components/FloatingChatButton";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <ChatProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/find-roommates" element={<FindRoommate />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/profile/:userId" element={<PublicProfilePage />} />
                  <Route path="/properties/:id" element={<PropertyDetailPage />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/chat" 
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chat/:conversationId" 
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/create-listing" 
                    element={
                      <ProtectedRoute>
                        <CreatePropertyPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/my-listings" 
                    element={
                      <ProtectedRoute>
                        <MyListingsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/premium" 
                    element={
                      <ProtectedRoute>
                        <PremiumPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
              <FloatingChatButton />
            </div>
            <Toaster position="top-right" richColors />
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;