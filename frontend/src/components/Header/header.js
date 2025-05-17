import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full h-[100px] shadow-xl flex justify-center items-center relative bg-accent text-white">
      <img src="/agrologo.png" alt="logo" className="w-[100px] h-[100px] object-cover absolute left-3 "/>
      <Link to="/dashboard" className="text-[25px] font-bold m-1">
        Home
      </Link>
      <Link to="/contact" className="text-[25px] font-bold m-1">
        Contact
      </Link>
      <Link to="/gallery" className="text-[25px] font-bold m-1">
        Gallery
      </Link>
      <Link to="/items" className="text-[25px] font-bold m-1">
        Items
      </Link>
    </header>
  );
}