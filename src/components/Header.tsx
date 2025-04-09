
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <div className="container flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Ghibli Selfie Dreams
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Transform your selfies into magical Ghibli-inspired art
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
