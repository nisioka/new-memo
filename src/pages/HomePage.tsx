import React from 'react';

const HomePage: React.FC = () => {
  console.log('[HomePage] rendered (simplified)');
  return (
    <div>
      <h1>Simple Home Page</h1>
      <p>This is a test to see if the component renders.</p>
    </div>
  );
};

export default HomePage;
