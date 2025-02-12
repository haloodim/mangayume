// pages/_app.js
import { PaginationProvider } from "../context/PaginationContext";
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <PaginationProvider>
      <Component {...pageProps} />
    </PaginationProvider>
  );
}
