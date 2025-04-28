import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full h-[100px] shadow-xl flex justify-center items-center relative bg-gradient-to-r from-green-800 to-green-900">
      <img src="/agrologo.png" alt="logo" className="w-[100px] h-[100px] object-cover absolute left-3 "/>
      <div className="flex space-x-8 items-center">

      <span className="text-white text-4xl font-bold">Welcome to AgroVista</span>
      {/*<Link to="/home" className="text-green-100 hover:text-white transition-colors flex items-center">
        Home
      </Link>
      <Link to="/contact" className="text-green-100 hover:text-white transition-colors flex items-center">
        Contact
      </Link>
      <Link to="/gallery" className="text-green-100 hover:text-white transition-colors flex items-center">
        Gallery
      </Link>
      <Link to="/items" className="text-green-100 hover:text-white transition-colors flex items-center">
        Items
      </Link> */}

</div>
    </header>
  );
}