
import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ghibli-blue to-ghibli-green opacity-70 animate-spin-slow" />
      <div className="absolute inset-2 rounded-full bg-white" />
      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-ghibli-yellow to-ghibli-peach opacity-70 animate-pulse-soft" />
      <div className="absolute inset-6 rounded-full bg-white" />
      <div className="absolute inset-8 rounded-full bg-ghibli-blue opacity-60 animate-float" />
    </div>
  );
};

export default LoadingAnimation;
