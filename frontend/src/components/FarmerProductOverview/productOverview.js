import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../../components/ImageSlider/imageSlider";
import { addToCart, loadCart } from "../../utils/cartFunction";
import toast from "react-hot-toast";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";

export default function ProductOverview() {
  const { key } = useParams();
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/${key}`)
      .then((res) => {
        setProduct(res.data);
        setLoadingStatus("loaded");
      })
      .catch((err) => {
        console.error(err);
        setLoadingStatus("error");
      });
  }, [key]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />
      <main className="flex-grow px-4 py-8 flex justify-center items-center">
        {loadingStatus === "loading" && (
          <div className="w-16 h-16 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        )}

        {loadingStatus === "error" && (
          <h1 className="text-3xl font-bold text-red-500">Error Occurred</h1>
        )}

        {loadingStatus === "loaded" && (
          <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10 bg-white rounded-xl shadow-lg p-6">
            {/* Left: Image */}
            <div className="md:w-1/2 w-full">
              <ImageSlider images={product.image} />
            </div>

            {/* Right: Details */}
            <div className="md:w-1/2 w-full flex flex-col gap-4">
              <h1 className="text-3xl font-bold text-green-800">
                {product.name}
              </h1>
              <h2 className="text-xl text-gray-700">
                {product.category} Category
              </h2>
              <p className="text-gray-600">{product.description}</p>

              <p className="text-2xl font-semibold text-green-600">
                LKR{product.price?.toFixed(2)}
              </p>

              <div className="text-sm text-gray-500">
                <span className="font-medium">Dimensions:</span>{" "}
                {product.dimensions}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    addToCart(product.key, 1);
                    toast.success("Added to Cart");
                    console.log(loadCart());
                  }}
                  className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-lg transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
