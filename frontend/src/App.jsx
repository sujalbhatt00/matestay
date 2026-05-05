import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/FloatingChatButton";
import ScrollToTop from "./components/ScrollToTop"; 

// Pages
import LandingPage from "./pages/LandingPage";
import FindRoommate from "./pages/FindRoommate";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";
import PublicProfilePage from "./pages/PublicProfilePage";
import CreatePropertyPage from "./pages/CreatePropertyPage";
import MyListingsPage from "./pages/MyListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import PropertiesSearchPage from "./pages/PropertiesSearchPage";
import LocationSearchPage from "./components/LocationSearchPage";
import AllPropertiesPage from "./pages/AllPropertiesPage";
import AdminDashboard from "./pages/AdminDashboard";
import PremiumPage from "./pages/PremiumPage";
import EditPropertyPage from "./pages/EditPropertyPage";

// Footer pages
import AboutUs from "./pages/AboutUs";
import ContactSupport from "./pages/ContactSupport";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";

// New: Find Rooms Page
import FindRooms from "./pages/FindRooms";

// Route protection
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


// ---------------- MAIN CONTENT WRAPPER ----------------
function MainContent() {
  const location = useLocation();

  return (
    <main className="flex-grow pb-20 md:pb-0" key={location.pathname}>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/find-roommates" element={<FindRoommate />} />

        {/*  Find Rooms Route */}
        <Route path="/find-rooms" element={<FindRooms />} />

        <Route path="/profile/:userId" element={<PublicProfilePage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/search" element={<LocationSearchPage />} />
        <Route path="/properties/all" element={<AllPropertiesPage />} />
        <Route path="/properties/search" element={<PropertiesSearchPage />} />

        {/* Footer Routes */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />

        {/* Protected Routes */}
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/create-listing" element={<ProtectedRoute><CreatePropertyPage /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
        <Route path="/properties/edit/:id" element={<ProtectedRoute><EditPropertyPage /></ProtectedRoute>} />
        <Route path="/premium" element={<ProtectedRoute><PremiumPage /></ProtectedRoute>} />

        {/* Admin Route */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      </Routes>
    </main>
  );
}


// ---------------- APP WRAPPER ----------------
function App() {
  return (
    <ChatProvider>
      <Router>

            {/*  Auto Scroll on Every Page Navigation */}
            <ScrollToTop />

            <div className="flex flex-col min-h-screen">
              <Navbar />
              <MainContent />
              <Footer />
              <FloatingChatButton />
            </div>

            <Toaster position="top-right" richColors />
          </Router>
        </ChatProvider>
  );
}

export default App;
