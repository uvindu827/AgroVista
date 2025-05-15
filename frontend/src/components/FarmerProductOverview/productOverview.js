import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../../components/ImageSlider/imageSlider";
import { addToCart, loadCart } from "../../utils/cartFunction";
import toast from "react-hot-toast";

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
    <div className="w-full min-h-screen flex justify-center items-center p-4">
      {loadingStatus === "loading" && (
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-b-4 border-accent rounded-full animate-spin"></div>
        </div>
      )}

      {loadingStatus === "loaded" && (
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8">
          {/* Product Name for Mobile */}
          <h1 className="text-2xl font-bold text-accent my-4 md:hidden text-center">
            {product.name}
          </h1>

          {/* Image Slider */}
          <div className="w-full md:w-1/2">
            <ImageSlider images={product.image} />
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-4">
            <h1 className="hidden md:block text-3xl font-bold text-accent">
              {product.name}
            </h1>
            <h2 className="text-xl font-semibold text-gray-800">
              {product.category} Category
            </h2>
            <p className="text-gray-700 text-center md:text-left">
              {product.description}
            </p>
            <p className="text-2xl text-green-600 font-bold">
              Rs. {product.price?.toFixed(2)}
            </p>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Dimensions:</span>{" "}
              {product.dimensions}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                addToCart(product.key, 1);
                toast.success("Added to Cart");
                console.log(loadCart());
              }}
              className="mt-4 bg-accent hover:bg-accent-dark transition-all text-white font-semibold px-6 py-3 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {loadingStatus === "error" && (
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold text-red-500">Error Occurred</h1>
        </div>
      )}
    </div>
  );
}
