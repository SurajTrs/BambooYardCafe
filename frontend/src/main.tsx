import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const root = document.getElementById('root');
if (root) {
  const loader = document.getElementById('loader');
  if (loader) loader.remove();
  
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
