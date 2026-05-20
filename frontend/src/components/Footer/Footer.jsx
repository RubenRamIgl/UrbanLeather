import instagram from "../../assets/images/instagram.svg";
import twitter from "../../assets/images/twitter.svg";
import facebook from "../../assets/images/facebook.svg";
import youtube from "../../assets/images/youtube.svg";
import pinterest from "../../assets/images/pinterest.svg";
import tiktok from "../../assets/images/tiktok.svg";

function Footer() {
  return (
    <footer
      className="
        flex flex-col sm:flex-row
        justify-between
        items-center sm:items-start
        text-center sm:text-left
        gap-6 sm:gap-0
        p-5
        w-full
        box-border
        shadow-[0px_-4px_6px_rgba(0,0,0,0.1)]
        mt-7
      "
    >
      {/* COLUMNAS */}
      <div className="flex flex-col gap-2.5">
        <p>Sobre nosotros</p>
        <p>Contactos</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Preguntas frecuentes</p>
        <p>Política de envíos</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Información legal</p>
        <p>Suscripciones</p>
      </div>

      {/* ICONOS */}
      <div className="flex items-center justify-center gap-3.5 flex-wrap">
        <img src={instagram} alt="instagram" className="h-5" />
        <img src={twitter} alt="twitter" className="h-5" />
        <img src={facebook} alt="facebook" className="h-5" />
        <img src={youtube} alt="youtube" className="h-5" />
        <img src={pinterest} alt="pinterest" className="h-5" />
        <img src={tiktok} alt="tiktok" className="h-5" />
      </div>
    </footer>
  );
}

export default Footer;