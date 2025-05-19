import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import { SearchProvider } from './context/SearchContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { useEffect, useState } from 'react';

function App() {


  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/hotel/:id" element={<HotelDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </SearchProvider>
  );
}

export default App;