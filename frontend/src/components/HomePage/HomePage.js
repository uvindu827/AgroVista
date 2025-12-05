import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function HomePage() {
  const images = ["/homeimg.jpg", "/homeimg2.jpg", "/homeimg3.jpg"]; // add more images if needed
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO SECTION */}
      <section className="relative h-[90vh] w-full bg-cover bg-center flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 animate-[bgMove_25s_linear_infinite]"
          style={{ backgroundImage: `url(${images[currentImage]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-800/80 to-green-900/80" />

        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-500" />

        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg mb-4">
            Welcome to <span className="text-green-300">AgroVista</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            Empowering Farmers, Buyers, Tool Dealers & Inspectors  
            through one smart digital platform.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              to="/login"
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl transition-all font-semibold"
            >
              Get Started
            </Link>

            <Link
              to="/about"
              className="px-8 py-3 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-green-700 mb-6">
            About AgroVista
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            AgroVista is a unified agricultural marketplace and management system 
            that connects farmers, buyers, tool dealers, and inspectors through a 
            smart ecosystem – improving productivity, transparency, and earnings.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-14">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 justify-items-center">
            {[
              {
                title: "For Farmers",
                desc: "Sell your produce directly and manage your crop marketplace.",
                icon: "🌾",
              },
              {
                title: "For Buyers",
                desc: "Purchase high-quality goods at transparent and fair rates.",
                icon: "🛒",
              },
              {
                title: "For Customers",
                desc: "Discover fresh produce and buy directly from trusted local farmers.",
                icon: "👥",
              },
              {
                title: "Tool Dealers",
                desc: "List your farming tools and manage equipment sales easily.",
                icon: "⚙️",
              },
              {
                title: "Inspectors",
                desc: "Perform inspections, manage reports, and ensure compliance.",
                icon: "📋",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white shadow-lg p-8 rounded-2xl text-center hover:scale-105 transition-transform border border-green-200"
              >
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="text-2xl font-bold text-green-700 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl text-center text-green-700 font-bold mb-14">
            What People Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "AgroVista increased my profits by 40% with direct sales!",
                user: "Farmer – Saman",
              },
              {
                text: "Very smooth buying process & real-time updates.",
                user: "Buyer – Dilshan",
              },
              {
                text: "Inspection process became easier and more organized.",
                user: "Inspector – Nadeesha",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-8 bg-green-50 border border-green-200 rounded-xl shadow-md hover:bg-green-100 transition-all"
              >
                <p className="text-gray-700 italic mb-4">“{t.text}”</p>
                <h4 className="text-green-700 font-semibold">{t.user}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANIMATIONS */}
      <style>
        {`
        @keyframes bgMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        `}
      </style>

      <Footer />
    </div>
  );
}
