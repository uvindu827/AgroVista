import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo with Text (optional) */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/agrologo.png"
            alt="Agro Logo"
            className="w-[60px] h-[60px] object-contain"
          />
          <span className="text-2xl font-bold text-green-800">AgroVista</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition">
            Cart
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
