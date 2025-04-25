import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  return (
    <div className="w-[300px] bg-white rounded-lg shadow-lg overflow-hidden m-4 relative">
      <img
        src={item.image[0]}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
        <p className="text-gray-600 text-sm mt-2">{item.category}</p>
        <p className="text-gray-700 mt-4">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-green-500">LKR.{item.price}</span>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              item.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {item.availability ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Dimensions:</span> {item.dimensions}
        </div>
      </div>
      <br></br>
      <div className=" flex justify-end h-full p-4 border-t border-gray-200">
        <Link  to={"/product/"+item.key} className="text-center w-[90%] h-[40px] bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 absolute mx-auto  bottom-3">
          View Details
        </Link>
      </div>
    </div>
  );
}