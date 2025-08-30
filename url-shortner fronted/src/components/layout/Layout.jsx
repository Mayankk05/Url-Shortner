import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Main layout component for authenticated pages
 */
const Layout = ({ children }) => {
  return (
    <div className="bg-gray" style={{minHeight: '100vh'}}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto" style={{maxWidth: '80rem'}}>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;