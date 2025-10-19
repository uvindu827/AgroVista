import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/downloads/AgroVista_Brochure.pdf'; // <-- File path in your public folder
    link.download = 'AgroVista_Brochure.pdf';
    link.click();
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-green-900 to-green-600">
      {/* Background Image & Overlay */}
      <main
        className="flex-1 relative flex flex-col items-center justify-center px-4 py-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bacT.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />

        {/* Intro Text */}
        <div className="relative z-10 w-full max-w-6xl px-8 mb-10 text-center">
          <p className="text-green-100 text-lg md:text-xl">
            Welcome to the AgroVista Tool Supplier Portal — your one-stop dashboard to effortlessly manage agricultural tools, add new products, and track your business growth with ease and style.
          </p>
        </div>

        {/* Cards grid */}
        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8">
          {/* Card 1 */}
          <div
            className="cursor-pointer p-6 rounded-3xl bg-white bg-opacity-20 border border-green-300 backdrop-blur-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105 hover:-translate-y-2"
            onClick={() => navigate('/e')}
          >
            <img
              src="https://img.icons8.com/ios-filled/100/ffffff/add--v1.png"
              alt="Add Tool"
              className="mx-auto mb-4 w-16 h-16 opacity-80"
            />
            <h2 className="text-center text-green-200 text-2xl font-semibold mb-2">
              Add New Tool
            </h2>
            <p className="text-center text-green-100 text-sm">
              Add new tools quickly to your inventory for customers to see.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="cursor-pointer p-6 rounded-3xl bg-white bg-opacity-20 border border-green-300 backdrop-blur-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105 hover:-translate-y-2"
            onClick={() => navigate('/jyhg')}
          >
            <img
              src="https://img.icons8.com/ios-filled/100/ffffff/toolbox.png"
              alt="Manage Tools"
              className="mx-auto mb-4 w-16 h-16 opacity-80"
            />
            <h2 className="text-center text-green-200 text-2xl font-semibold mb-2">
              Manage Tools
            </h2>
            <p className="text-center text-green-100 text-sm">
              Edit or remove your tool listings, and manage your inventory.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="cursor-pointer p-6 rounded-3xl bg-white bg-opacity-20 border border-green-300 backdrop-blur-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105 hover:-translate-y-2"
            onClick={() => navigate('/reports')}
          >
            <img
              src="https://img.icons8.com/ios-filled/100/ffffff/combo-chart--v1.png"
              alt="Reports & Orders"
              className="mx-auto mb-4 w-16 h-16 opacity-80"
            />
            <h2 className="text-center text-green-200 text-2xl font-semibold mb-2">
              Reports & Orders
            </h2>
            <p className="text-center text-green-100 text-sm">
              Get insights into sales, order history, and performance.
            </p>
          </div>
        </div>
      </main>

      {/* Header (Transparent) */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between py-6 px-6 bg-transparent">
        <h1
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          AgroVista
        </h1>
        <nav className="flex items-center space-x-6 text-green-200">
          <ul className="flex space-x-6">
            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/add')}>Add Tool</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/display')}>Manage Tools</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/reports')}>Reports</li>
          </ul>
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="ml-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          >
            Download
          </button>
        </nav>
      </header>

      {/* Footer (Transparent) */}
      <footer className="absolute bottom-0 inset-x-0 z-20 py-4 px-6 bg-transparent text-center text-green-200">
        <p className="text-sm">
          &copy; 2025 AgroVista — Empowering Agriculture Through Innovation
        </p>
      </footer>
    </div>
  );
}
