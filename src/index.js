import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()

root.render(
  <BrowserRouter >
    <QueryClientProvider client={queryClient}>
      <ToastContainer draggable={false} autoClose={3000} />
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);

