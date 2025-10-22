import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-green-800 to-green-900 text-white py-10 mt-auto">
      <div className="overflow-x-auto">
        <div className="min-w-[768px] grid grid-cols-3 gap-10 px-6">
          {/* Column 1: Logo + About */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/agrologo.png" alt="AgroVista Logo" className="h-10 w-auto mr-3" />
              <h3 className="text-xl font-bold">AgroVista</h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Your trusted partner in agricultural commerce, connecting farmers and customers for a sustainable future.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* Social icons */}
              {/* Facebook */}
              <button className="text-green-100 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
              {/* Twitter */}
              <button className="text-green-100 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.222 0-.443-.152-.654a8.348 8.348 0 0 0 2.284-2.558 8.673 8.673 0 0 1-2.244.616 4.318 4.318 0 0 0 1.892-2.38 8.634 8.634 0 0 1-2.733 1.042 4.302 4.302 0 0 0-7.331 3.917 12.204 12.204 0 0 1-8.864-4.493 4.302 4.302 0 0 0 1.33 5.734A4.268 4.268 0 0 1 1.8 9.713v.052a4.302 4.302 0 0 0 3.45 4.217 4.305 4.305 0 0 1-1.942.072 4.306 4.306 0 0 0 4.017 2.988 8.625 8.625 0 0 1-5.33 1.84c-.346 0-.688-.02-1.02-.06a12.184 12.184 0 0 0 6.601 1.934" />
                </svg>
              </button>
              {/* Instagram */}
              <button className="text-green-100 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-green-600 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              {["/home", "/contact", "/gallery", "/items"].map((path, idx) => {
                const label = path.replace("/", "").charAt(0).toUpperCase() + path.slice(2);
                return (
                  <li key={idx}>
                    <Link to={path} className="text-green-100 hover:text-white transition-colors flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-green-600 pb-2">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-green-100">info@agrovista.com</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-green-100">+1 234 567 890</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-green-100">123 Agriculture St, Farm City</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-green-700 text-center px-6">
        <p className="text-green-100 text-sm">
          &copy; {new Date().getFullYear()} AgroVista. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
