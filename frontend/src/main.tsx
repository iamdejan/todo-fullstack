import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from "@mui/material/CssBaseline";
import App from './App';

const rootElement = document.getElementById("root");
if(rootElement !== null && !rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <CssBaseline />
      <App />
    </StrictMode>
  );
}
