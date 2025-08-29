import React from 'react';

const TailwindTest = () => {
  return (
    <div className="p-8 bg-gray-25">
      <h1 className="heading-1 text-primary-600 mb-4">Tailwind CSS Test</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="heading-4 mb-2">Card Component</h2>
          <p className="body-medium text-gray-600">This card uses custom Tailwind components.</p>
          <button className="btn-primary mt-4">Primary Button</button>
        </div>
        
        <div className="card p-6">
          <h2 className="heading-4 mb-2">Typography</h2>
          <p className="body-large mb-2">Large body text</p>
          <p className="body-medium mb-2">Medium body text</p>
          <p className="body-small">Small body text</p>
        </div>
        
        <div className="card p-6">
          <h2 className="heading-4 mb-2">Tags & Buttons</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="tag">Default Tag</span>
            <span className="tag-primary">Primary Tag</span>
            <span className="tag-accent">Accent Tag</span>
          </div>
          <div className="space-y-2">
            <button className="btn-secondary w-full">Secondary Button</button>
            <button className="btn-ghost w-full">Ghost Button</button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl">
        <h3 className="heading-3 mb-2">Gradient Background</h3>
        <p className="body-medium text-gray-700">
          This section demonstrates custom gradients and rounded corners.
        </p>
      </div>
    </div>
  );
};

export default TailwindTest;
