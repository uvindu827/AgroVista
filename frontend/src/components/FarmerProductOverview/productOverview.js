import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductNotFound from "./productNotFound";
import ImageSlider from "../../components/ImageSlider/imageSlider";
import { addToCart } from "../../utils/cartFunction";
import toast from "react-hot-toast";

export default function ProductOverview() {
  const params = useParams();
  const key = params.key;
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, not-found, found
  const navigate = useNavigate();

  useEffect(() => {
    console.log(key);
    axios
      .get("http://localhost:3000/api/products/" + key)
      .then((res) => {
        if (res.data === null || !res.data.productName) {
          setStatus("not-found");
        } else {
          setProduct(res.data);
          setStatus("found");
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setStatus("not-found");
      });
  }, [key]);

  function onAddtoCartClick() {
    if (product) {
      addToCart(product.key, 1);
      toast.success(product.key + " added to cart");
    }
  }

  function onBuyNowClick() {
    if (product) {
      navigate("/shipping", {
        state: {
          items: [
            {
              key: product.key,
              qty: 1,
            },
          ],
        },
      });
    }
  }

  return (
    <div className="w-full h-[calc(100vh-100px)]">
      {status === "loading" && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32  border-2 border-gray-500 border-b-accent border-b-4"></div>
        </div>
      )}
      {status === "not-found" && <ProductNotFound />}
      {status === "found" && product && (
        <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800 lg:hidden">
            {product.productName}
          </h1>
          <p className="text-xl text-gray-600 lg:hidden">
            {product.price > product.lastPrice && (
              <span className="line-through text-red-500">
                LKR.{product.price}
              </span>
            )}
            <span>{"LKR." + product.lastPrice}</span>
          </p>
          <div className="w-[100%] border-[3px] border-blue-900 lg:w-[35%] lg:h-full">
            <ImageSlider images={product.images || []} />
          </div>
          <div className="w-[65%] h-full p-4">
            <h1 className="text-3xl font-bold text-gray-800 hidden lg:block">
              {product.productName}
            </h1>
            <h1 className="text-3xl font-bold text-gray-500">
              {product.altNames && product.altNames.length > 0
                ? product.altNames.join(" | ")
                : "No alternative names available"}
            </h1>
            <p className="text-xl text-gray-600 hidden lg:block">
              {product.price > product.lastPrice && (
                <span className="line-through text-red-500">
                  LKR.{product.price}
                </span>
              )}
              <span>{"LKR." + product.lastPrice}</span>
            </p>
            <p className="text-lg text-gray-600 line-clamp-3">
              {product.description || "No description available."}
            </p>
            <button
              onClick={onAddtoCartClick}
              className="bg-accent text-white p-2 rounded-lg"
            >
              Add to cart
            </button>
            <button
              onClick={onBuyNowClick}
              className=" text-accent border mx-1 border-accent p-2 rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
