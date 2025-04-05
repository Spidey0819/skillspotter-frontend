// src/components/common/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, hideNavbar = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;