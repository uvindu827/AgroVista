import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  return (
    <div className="w-[300px] bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={item.image?.[0] || "/placeholder.jpg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 truncate">{item.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
          <p className="text-sm text-gray-700 mt-3 line-clamp-3">{item.description}</p>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-green-600">₹{item.price}</span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                item.availability
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.availability ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="text-xs text-gray-600 mt-2">
            <span className="font-medium">Dimensions:</span> {item.dimensions}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <Link
          to={`/product/${item.key}`}
          className="block w-full text-center bg-green-800 hover:bg-green-900 text-white py-2 rounded-lg transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
