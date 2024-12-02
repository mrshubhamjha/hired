import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/header';

const AppLayout = () => {
  return (
    <div className="relative min-h-screen">
      {/* Dark Geometric Shapes */}
      <div className="fixed inset-0 bg-black bg-opacity-90 pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-2 gap-10 opacity-20">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`h-64 w-64 bg-gradient-to-r from-gray-600 to-gray-900 rounded-lg transform rotate-45 translate-x-8`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 min-h-screen">
        <Header />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-10 text-center bg-secondary mt-10">
        <p className="text-sm text-muted-foreground">
          Made with ❤️ by Shubham
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
