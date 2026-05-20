import { Link } from "react-router-dom";
import rectangle from "../../assets/images/rectangle.png";

function Home() {
  return (
    <div className="flex flex-col">

      {/* GENEROS */}
      <div className="flex justify-between items-center px-5 w-full mt-6 box-border">

        <Link
          to="/hombre"
          className="flex-1 text-center no-underline text-black"
        >
          <p className="font-[Montserrat] text-xl m-0">HOMBRE</p>
        </Link>

        <Link
          to="/mujer"
          className="flex-1 text-center no-underline text-black"
        >
          <p className="font-[Montserrat] text-xl m-0">MUJER</p>
        </Link>

      </div>

      {/* IMAGEN */}
      <div className="w-full h-[50vh] overflow-hidden mt-2.5">
        <img
          src={rectangle}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}

export default Home;