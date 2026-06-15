import { BrowserRouter } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import './styles/darkmode.css';

function App() {
  return (
    <BrowserRouter>
      <Header />

      <AppRoutes />

      <Footer />
    </BrowserRouter>
  );
}

export default App;