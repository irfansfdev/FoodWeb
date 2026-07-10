import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './Redux/Store.jsx'; 
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { AuthModalProvider } from './context/AuthModalContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthModalProvider>
          {/* Removed the extra BrowserRouter from here! */}
          <App />
        </AuthModalProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);