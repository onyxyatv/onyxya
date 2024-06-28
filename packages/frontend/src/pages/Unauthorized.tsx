import React from "react";

const Unauthorized: React.FC = () => {
  return (
    <div>
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/home">Go to Home</a>
    </div>
  );
};

export default Unauthorized;
