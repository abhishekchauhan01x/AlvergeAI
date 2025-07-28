import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const NotFoundPage = () => (
  <>
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Page not found.</p>
      <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Go Home</Link>
    </div>
    <Footer />
  </>
);

export default NotFoundPage; 