import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function UpdateItemPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [productKey, setProductKey] = useState(location.state.key);
  const [productName, setProductName] = useState(location.state.name);
  const [productPrice, setProductPrice] = useState(location.state.price);
  const [productCategory, setProductCategory] = useState(
    location.state.category
  );
  const [productDimensions, setProductDimensions] = useState(
    location.state.dimensions
  );
  const [productDescription, setProductDescription] = useState(
    location.state.description
  );
  const [productImages, setProductImages] = useState([]);

  async function handleUpdateItem() {
    let updatingImages = location.state.image;

    if (productImages.length > 0) {
      const promises = [...productImages].map((file) => mediaUpload(file));
      updatingImages = await Promise.all(promises);
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const result = await axios.put(
          `http://localhost:3000/api/products/${productKey}`,
          {
            name: productName,
            price: productPrice,
            category: productCategory,
            dimensions: productDimensions,
            description: productDescription,
            image: updatingImages,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        toast.success(result.data.message);
        navigate("/farmer/items");
      } catch (err) {
        toast.error(err.response.data.error);
      }
    } else {
      toast.error("You are not authorized to update items");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Update Item
        </h1>

        <div className="space-y-4">
          <input
            disabled
            type="text"
            value={productKey}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="number"
            placeholder="Product Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          />
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          >
            <option value="vegitable">Vegitable</option>
            <option value="friuts">Friuts</option>
          </select>
          <input
            type="text"
            placeholder="Product Dimensions"
            value={productDimensions}
            onChange={(e) => setProductDimensions(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          />
          <textarea
            placeholder="Product Description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            rows="3"
          ></textarea>
          <input
            type="file"
            multiple
            onChange={(e) => setProductImages(e.target.files)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          />

          <button
            onClick={handleUpdateItem}
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Update Item
          </button>
          <button
            onClick={() => navigate("/farmer/items")}
            className="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
