import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './Redux/Store.jsx'; 
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from "./Context/ThemeContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
          <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);