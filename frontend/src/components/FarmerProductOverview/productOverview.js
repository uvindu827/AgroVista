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

    // Load reviews from sessionStorage
    loadReviewsFromStorage();
  }, [key]);

  const loadReviewsFromStorage = () => {
    try {
      const storedReviews = sessionStorage.getItem(`reviews_${key}`);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
    } catch (error) {
      console.error("Error loading reviews from storage:", error);
    }
  };

  const saveReviewsToStorage = (reviewsData) => {
    try {
      sessionStorage.setItem(`reviews_${key}`, JSON.stringify(reviewsData));
    } catch (error) {
      console.error("Error saving reviews to storage:", error);
    }
  };

  // Calculate average rating from user reviews
  const calculateAverageRating = () => {
    if (reviews.length === 0) {
      return product.rating || 0;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  // Calculate rating breakdown
  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
    });
    return breakdown;
  };

  const renderStars = (rating, size = "text-xl") => {
    const totalStars = 5;
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating % 1) >= 0.5;

    for (let i = 0; i < totalStars; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={`text-yellow-400 ${size}`}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={`text-yellow-400 ${size}`}>☆</span>);
      } else {
        stars.push(<span key={i} className={`text-gray-300 ${size}`}>☆</span>);
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

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    saveReviewsToStorage(updatedReviews);
    
    setUserRating(0);
    setUserComment("");
    toast.success("Review submitted!");
  };

  const averageRating = calculateAverageRating();
  const ratingBreakdown = getRatingBreakdown();
  const totalReviews = reviews.length;

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

                {/* Enhanced Rating Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {renderStars(averageRating, "text-2xl")}
                      <span className="text-2xl font-bold text-gray-800">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  {totalReviews > 0 && (
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2 text-sm">
                          <span className="w-3 text-gray-600">{rating}</span>
                          <span className="text-yellow-400">★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: totalReviews > 0 
                                  ? `${(ratingBreakdown[rating] / totalReviews) * 100}%`
                                  : '0%'
                              }}
                            ></div>
                          </div>
                          <span className="w-8 text-right text-gray-600">
                            {ratingBreakdown[rating] || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {totalReviews === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No customer reviews yet. Be the first to review!
                    </p>
                  )}
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
                    className={`text-2xl transition-colors ${
                      userRating >= star ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-300`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Write your comment..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={3}
              />

              <button
                onClick={handleSubmitReview}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded transition-colors"
              >
                Submit Review
              </button>
            </div>

            {/* Display reviews */}
            <div className="bg-white shadow rounded-xl p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">☆</div>
                  <p className="text-gray-500">No reviews yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating, "text-lg")}
                          <span className="font-medium text-gray-700">
                            {review.rating}/5
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}