import React from "react";

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    <div className="h-4 bg-gray-300 rounded w-full"></div>
  </div>
);

export default SkeletonLoader;
