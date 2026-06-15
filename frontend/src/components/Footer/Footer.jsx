import instagram from "../../assets/images/instagram.svg";
import twitter from "../../assets/images/twitter.svg";
import facebook from "../../assets/images/facebook.svg";
import youtube from "../../assets/images/youtube.svg";
import pinterest from "../../assets/images/pinterest.svg";
import tiktok from "../../assets/images/tiktok.svg";
import "./Footer.css"; // Importamos el CSS (si ya tienes uno, usa ese)

function Footer() {
  return (
    <footer className="footer">
      {/* COLUMNAS */}
      <div className="footer-columna">
        <p>Sobre nosotros</p>
        <p>Contactos</p>
      </div>

      <div className="footer-columna">
        <p>Preguntas frecuentes</p>
        <p>Política de envíos</p>
      </div>

      <div className="footer-columna">
        <p>Información legal</p>
        <p>Suscripciones</p>
      </div>

      {/* ICONOS */}
      <div className="footer-iconos">
        <img src={instagram} alt="instagram" className="icono-red-social" />
        <img src={twitter} alt="twitter" className="icono-red-social" />
        <img src={facebook} alt="facebook" className="icono-red-social" />
        <img src={youtube} alt="youtube" className="icono-red-social" />
        <img src={pinterest} alt="pinterest" className="icono-red-social" />
        <img src={tiktok} alt="tiktok" className="icono-red-social" />
      </div>
    </footer>
  );
}

export default Footer;