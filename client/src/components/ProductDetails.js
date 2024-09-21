import React, { useState, useEffect, useContext } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { submitReview } from "../services/reviewsServices";
import AuthContext from "../contexts/AuthContext";
import { showPopup } from "../utils/popupUtils";
import Spinner from "./Spinner";
import {
  getCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
} from "../services/cartService";

import {
  getProductDetails,
  checkWishlistStatus,
  toggleWishlist,
} from "../services/productService";
import { showToast } from "../utils/toastNotifications";

const ProductDetails = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [selectedGifts, setSelectedGifts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [giftPoints, setGiftPoints] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const fetchProductDetails = async () => {
    try {
      const data = await getProductDetails(productId);
      setProduct(data);
      if (data.includingGift) {
        setGifts(data.gifts);
        setGiftPoints(data.giftPoints);
      }
    } catch (error) {}
  };
  useEffect(() => {
  

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    const checkCartStatus = async () => {
      try {
        const cart = await getCart();
        setIsInCart(
          cart.items.some((item) => item.productId._id === productId)
        );
      } catch (error) {}
    };
    if (user) checkCartStatus();
  }, [productId, user]);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const status = await checkWishlistStatus(productId);
        setIsInWishlist(status);
      } catch (error) {}
    };
    if (user) fetchWishlistStatus();
  }, [productId, user]);

  const checkIfUserRequired = (action) => {
    if (!user) {
      showPopup({
        title: "Login Required",
        message:
          "You need to log in to perform this action. Would you like to log in now?",
        type: "login",
        onConfirm: "",
        confirmText: "Log In",
        cancelText: "Cancel",
      });
      return false;
    }
    return true;
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!checkIfUserRequired()) return;

    const reviewData = { rating, comment };
    try {
      await submitReview(productId, reviewData);

      const data = await getProductDetails(productId);
      if(data.status==='400'){
        showToast('your review is on pending','warning')
      }
      showToast('review subimtted successfuly','success')
    } catch (error) {
    }
  };

  const handleAddToWishlist = async () => {
    if (!checkIfUserRequired()) return;

    try {
      await toggleWishlist(productId, isInWishlist);
      setIsInWishlist(!isInWishlist);
    } catch (error) {}
  };

  const handleAddToCartWithGifts = async () => {
    await addToCartApi(product._id, selectedGifts, quantity);
    setShowGiftPopup(false);
    setIsInCart(true);
  };

  const handleAddToCart = async () => {
    if (!checkIfUserRequired()) return;

    if (isInCart) {
      await removeFromCartApi(product._id);
      setIsInCart(false);
    } else {
      if (product?.includingGift) {
        setShowGiftPopup(true);
      } else {
        await addToCartApi(product._id, [], quantity);
        setIsInCart(true);
      }
    }
  };

  const handleGiftSelection = (giftId, giftPointValue) => {
    if (selectedGifts.includes(giftId)) {
      setSelectedGifts(selectedGifts.filter((id) => id !== giftId));
      setGiftPoints(giftPoints + giftPointValue);
    } else if (giftPoints >= giftPointValue) {
      setSelectedGifts([...selectedGifts, giftId]);
      setGiftPoints(giftPoints - giftPointValue);
    }
  };

  const changeImage = (index) => setCurrentImage(index);

  const getYouTubeVideoID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  const renderContent = () => {
    return (
      <div className="container mx-auto p-4 ">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 ${
                activeTab === "description"
                  ? "border-b-2 border-second text-second font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "additionalInfo"
                  ? "border-b-2 border-second text-second font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("additionalInfo")}
            >
              Additional Information
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "reviews"
                  ? "border-b-2 border-second text-second font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="  ">
          {activeTab === "description" && (
            <div className="space-y-6 shadow rounded-lg">
              {/* Product Description */}
              <div className="bg-white p-6 ">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product?.description || "No description available."}
                </p>
              </div>

              {/* Product Video */}
              {product?.video && (
                <div className="bg-white p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Product Video
                  </h2>
                  <div className="relative w-full h-60 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoID(
                        product.video
                      )}`}
                      title="Product Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 pointer-events-none"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "additionalInfo" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 border border-gray-200 ">
                <h3 className="font-semibold text-gray-900">Including Gift</h3>
                <p
                  className={`mt-1 text-gray-700 ${
                    product?.includingGift ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product?.includingGift ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 ">
                <h3 className="font-semibold text-gray-900">Including Gift</h3>
                <p
                  className={`mt-1 text-gray-700 ${
                    product?.promotion ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product?.promotion ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 ">
                <h3 className="font-semibold text-gray-900">Gift Points</h3>
                <p className="mt-1 text-gray-700">
                  {product?.giftPoints || "0 Points"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200  col-span-1 md:col-span-3">
                <h3 className="font-semibold text-gray-900">Ingredients</h3>
                <ul className="mt-1 list-disc pl-5 text-gray-700">
                  {product?.Ingredients?.length ? (
                    product.Ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))
                  ) : (
                    <li>No ingredients listed</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {/* Review Summary */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Reviews
                </h2>
                <p className="text-gray-600">
                  Average Rating: {product?.AVGrating || "No ratings yet"}
                </p>
                <p className="text-gray-600">
                  Total Reviews: {product?.reviews.length || "0"}
                </p>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {product?.reviews.length ? (
                  product.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center mb-2">
                        <img
                          src={
                            review.user.profileImage || "/default-avatar.png"
                          }
                          alt="User Avatar"
                          className="w-10 h-10 rounded-full border-2 border-gray-300"
                        />
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900">
                            {review.user.userName}
                          </p>
                          <div className="flex space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No reviews available.</p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="mt-8 p-6  ">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Submit Your Review
                </h2>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Rating
                    </label>
                    <div id="rating" className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <svg
                          key={value}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={value <= rating ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className={`w-6 h-6 ${
                            value <= rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          } cursor-pointer`}
                          onClick={() => setRating(value)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Write your review..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <section className="py-16 px-0">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="relative">
              <img
                src={`${product.imagePath[currentImage]}`}
                alt="product"
                className="h-[36rem]"
              />
              <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 pb-4">
                {product.imagePath.map((img, index) => (
                  <img
                    key={index}
                    src={`${img}`}
                    alt={`thumbnail-${index}`}
                    className={`h-16 w-16 cursor-pointer border-2 ${
                      index === currentImage
                        ? "border-gray-900"
                        : "border-transparent"
                    }`}
                    onClick={() => changeImage(index)}
                  />
                ))}
              </div>
            </div>
            {/* Product Details Section */}
            <div className="flex flex-col space-y-6">
              {/* Product Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.productName}
              </h2>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={index < product.AVGrating ? "currentColor" : "none"}
                      className="w-5 h-5"
                      stroke="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {product.AVGrating}/5 ({product.reviews.length} reviews)
                </p>
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-4 text-gray-900">
                {product.finalPrice !== product.price && (
                  <span className="text-xl line-through text-red-500">
                    {product.price} TND
                  </span>
                )}
                <span className="text-2xl font-semibold">
                  {product.finalPrice} TND
                </span>
                {product.finalPrice !== product.price && (
                  <span className="bg-yellow-300 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                    {product.promotion.discountRate}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-medium">Availability:</h4>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-semibold">In Stock</span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Description */}
              <p className="text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className={`px-6 py-3 rounded-md text-white font-semibold shadow-md transition-all duration-300 ${
                    isInCart
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-900 hover:bg-gray-600"
                  }`}
                >
                  {isInCart ? "Remove from Cart" : "Add to Cart"}
                </button>

                <button
                  className={`p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:text-second transition-all ${
                    isInWishlist ? "text-second" : "text-gray-500"
                  }`}
                  onClick={handleAddToWishlist}
                >
                  <HeartIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="min-h-screen">{renderContent()}</div>
      {showGiftPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Gifts
            </h2>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">
                Available Gift Points: {giftPoints}
              </p>
            </div>
            <div className="space-y-4 mb-4">
              {gifts.map((gift) => (
                <div
                  key={gift._id}
                  className="flex items-center border-b border-gray-200 pb-4"
                >
                  <img
                    src={`${gift.imagePath[0]}`}
                    alt={gift.giftName}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {gift.giftName}
                    </h3>
                    <p className="text-gray-600">Points: {gift.pointValue}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleGiftSelection(gift._id, gift.pointValue)
                    }
                    className={`px-4 py-2 text-xs font-semibold rounded-md ${
                      selectedGifts.includes(gift._id)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    disabled={
                      giftPoints < gift.pointValue &&
                      !selectedGifts.includes(gift._id)
                    }
                  >
                    {selectedGifts.includes(gift._id) ? "Remove" : "Add"}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center mb-4">
              <label
                htmlFor="quantity"
                className="text-gray-700 font-medium mr-4"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="border border-gray-300 rounded-md p-2 w-20 text-center"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleAddToCartWithGifts}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setShowGiftPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductDetails;
