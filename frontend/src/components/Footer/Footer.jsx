import instagram from "../../assets/images/instagram.svg";
import twitter from "../../assets/images/twitter.svg";
import facebook from "../../assets/images/facebook.svg";
import youtube from "../../assets/images/youtube.svg";
import pinterest from "../../assets/images/pinterest.svg";
import tiktok from "../../assets/images/tiktok.svg";

function Footer() {
  return (
    <footer className="flex justify-between items-start p-5 w-full box-border shadow-[0px_-4px_6px_rgba(0,0,0,0.1)] mt-7">

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
      <div className="flex items-center gap-3.5">

        <img src={instagram} alt="instagram" />
        <img src={twitter} alt="twitter" />
        <img src={facebook} alt="facebook" />
        <img src={youtube} alt="youtube" />
        <img src={pinterest} alt="pinterest" />
        <img src={tiktok} alt="tiktok" />

      </div>

    </footer>
  );
}

export default Footer;