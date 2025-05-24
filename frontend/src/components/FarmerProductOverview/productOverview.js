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
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState([]);

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

  const renderStars = (rating) => {
    const totalStars = 5;
    const stars = [];
    const fullStars = Math.floor(rating || 0);

    for (let i = 0; i < totalStars; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400 text-xl">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 text-xl">☆</span>);
      }
    }

    return stars;
  };

  const handleSubmitReview = () => {
    if (userRating === 0 || userComment.trim() === "") {
      toast.error("Please provide a rating and a comment.");
      return;
    }

    const newReview = {
      rating: userRating,
      comment: userComment,
      date: new Date().toLocaleDateString(),
    };

    setReviews([...reviews, newReview]);
    setUserRating(0);
    setUserComment("");
    toast.success("Review submitted!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />
      <main className="flex-grow px-4 py-8 flex flex-col items-center">
        {loadingStatus === "loading" && (
          <div className="w-16 h-16 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        )}

        {loadingStatus === "error" && (
          <h1 className="text-3xl font-bold text-red-500">Error Occurred</h1>
        )}

        {loadingStatus === "loaded" && (
          <div className="w-full max-w-6xl flex flex-col gap-10">
            <div className="flex flex-col md:flex-row gap-10 bg-white rounded-xl shadow-lg p-6">
              {/* Left: Image */}
              <div className="md:w-1/2 w-full">
                <ImageSlider images={product.image} />
              </div>

              {/* Right: Details */}
              <div className="md:w-1/2 w-full flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-green-800">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600">
                    {product.rating ? product.rating.toFixed(1) : "No rating"}
                  </span>
                </div>

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

            {/* Review Section */}
            <div className="bg-gray-50 rounded-xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>

              {/* Star rating input */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`text-2xl ${
                      userRating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                className="w-full border border-gray-300 rounded p-2 mb-4"
                placeholder="Write your comment..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={3}
              />

              <button
                onClick={handleSubmitReview}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
              >
                Submit Review
              </button>
            </div>

            {/* Display reviews */}
            <div className="bg-white shadow rounded-xl p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                reviews.map((review, index) => (
                  <div key={index} className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
