import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import ChatInterface1 from './components/ChatInterface1';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { useAuth } from './contexts/AuthContext';

// Wrapper to use hooks in App
const AppWithRedirect = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const prevSignedIn = useRef(isSignedIn);

  useEffect(() => {
    if (prevSignedIn.current && !isSignedIn) {
      navigate('/');
    }
    prevSignedIn.current = isSignedIn;
  }, [isSignedIn, navigate]);

  return (
    <div className="flex flex-col">
      <Navbar hideOnMobile={false} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/chat1" element={<ChatInterface1 />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppWithRedirect />
    </Router>
  );
};

export default App;