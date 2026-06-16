import { HashRouter } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import './styles/darkmode.css';

function App() {
  return (
    <HashRouter>
      <Header />

      <AppRoutes />

      <Footer />
    </HashRouter>
  );
}

export default App;