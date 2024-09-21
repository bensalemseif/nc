import React, { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import { useParams } from "react-router-dom";
import SimpleCarousel from "../../components/SimpleCarousel";
import { showToast } from "../../utils/toastNotifications";
import { TagsInput } from "react-tag-input-component";
import Spinner from "../../components/Spinner";
import { RiDeleteBinLine } from "react-icons/ri";
import { FcApproval } from "react-icons/fc";

export default function ProductDetailsAdmin() {
  const { id } = useParams();
  const [CategorySelect, SetCategorySelect] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [gifts, setGifts] = useState([]);
  const [selectedGifts, setSelectedGifts] = useState([]);
  const [selected, setSelected] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    includingGift: false,
    giftPoints: "",
    size: "",
    Ingredients: [],
    reviews: [],
    promotion: "",
    AVGrating: "",
    video: "",
    gifts: [],
  });


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          "/categories/select/all",
        );
        SetCategorySelect(response.data);
      } catch (err) {
        setError("Failed to fetch categories");
        showToast("failed to fetch categories", "success");
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await api.get("/gifts/",);
        setGifts(response.data);
      } catch (err) {
        setError("Failed to fetch gifts");


      }
    };

    fetchGifts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const fetchProduct = async () => {
    try {
      const response = await api.get(
        `/products/admin/getByid/${id}`,
      );
      const data = response.data;
      setProduct(data);
      setImages(data.imagePath || []);
      setFormData({
        ...formData,
        productName: data.productName || "",
        price: data.price || "",
        description: data.description || "",
        category: data.category || "",
        stock: data.stock || "",
        includingGift: data.includingGift || false,
        giftPoints: data.giftPoints || "",
        size: data.size || "",
        Ingredients: data.Ingredients || [],
        reviews: data.reviews || [],
        promotion: data.promotion || "",
        AVGrating: data.AVGrating || "",
        video: data.video || "",
        gifts: data.gifts || [],
      });
      setSelectedGifts(formData.gifts)


      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
 

    fetchProduct();
  }, [id, 1]);


  const handleGiftSelection = (giftId) => {
    setSelectedGifts((prevSelected) =>
      prevSelected.includes(giftId)
        ? prevSelected.filter((id) => id !== giftId)
        : [...prevSelected, giftId]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    formData.Ingredients = selected;
    try {
      await api.put(
        `/products/${id}`,
        { ...formData },
      );
      setSelectedGifts(selectedGifts)
      showToast("Product updated successfully", "success");

    } catch (err) {
      setError(err.message);
    }
  };
  const confirmeReviews = async (Rid) => {
    try {
      const response = await api.put(`reviews/validation/${Rid}`);
      showToast("reviews approved successfully", "success");
      fetchProduct();

    }
    catch (error) {
      throw new Error();
    }
  }

  const deleteReviews = async (Rid) => {
    try {
      const response = await api.delete(`reviews/${Rid}`);
      showToast("review deleted successfully", "success");
      fetchProduct();

    }
    catch (error) {
      throw new Error();
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  const averageRating = (
    formData.reviews.reduce((acc, review) => acc + review.rating, 0) /
    formData.reviews.length || 0
  ).toFixed(1);

  const reviewsPerPage = 3;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = formData.reviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const handleInputChangcheck = (event) => {
    const { value, checked } = event.target;
    setFormData(prevState => ({
      ...prevState,
      gifts: checked
        ? [...prevState.gifts, value]
        : prevState.gifts.filter(giftId => giftId !== value)
    }));
  }
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="flex flex-col sm:flex-row ">
      <div className="p-4 sm:ml-60 h-full flex flex-col flex-1">
        <h1 className="border border-blue-700 text-blue-600 dark:bg-green-500 font-medium rounded-lg text-lg px-5 py-5 text-center mb-5">
          Product Details
        </h1>
        <div className="flex flex-col md:flex-row flex-1 mt-4 h-full bg-white">
          {/* Left Section: Product Image Carousel */}
          <div className="w-full md:w-1/2 flex-1 mb-4 mt-4 md:mb-0 border-r-2 border-green-500">
            <SimpleCarousel images={images} />
            {/* Product Reviews */}
            <div className="p-6 mt-4 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Product Reviews</h2>
                <span className="text-sm text-gray-500">
                  Average Rating: {averageRating}
                </span>
              </div>
              <div className="h-80 overflow-y-auto">
                {currentReviews.length === 0 ? (
                  <p className="text-gray-500">
                    No reviews available for this product.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {currentReviews.map((review) => (
                      <li
                        key={review._id}
                        className="p-4 border rounded-lg shadow-sm bg-gray-50"
                      >
                        <p className="text-sm text-gray-700">
                          {review.comment}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          - {review.userName}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span className="text-yellow-500">
                            Rating: {review.rating} / 5
                          </span>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span
                            className={`text-xs font-semibold ${review.isValid
                                ? "text-green-500"
                                : "text-gray-500"
                              }`}
                          >
                            {review.isValid ? "Confirmed" : "Pending"}

                          </span>
                          <div className="mt-4 flex gap-6 items-center">
                            <button className="text-2xl text-red-600"onClick={()=>{deleteReviews(review._id)}} >
                              <RiDeleteBinLine />
                            </button>
                            <button className="text-2xl" onClick={() => confirmeReviews(review._id)}>
  <FcApproval />
</button>
                          </div>
                        </div>

                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white border border-gray-300 text-gray-500 rounded-l-md hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastReview >= formData.reviews.length}
                    className="px-3 py-2 bg-white border border-gray-300 text-gray-500 rounded-r-md hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
          {/* Right Section: Product Details Form */}
          <div className="w-full md:w-1/2 p-6 rounded-lg flex-1">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Form Fields */}
              <div>
                {/* Gift Selection */}
                <div className="mb-4 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Gifts:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gifts.map((gift) => (
                      <div
                        key={gift._id}
                        className={`p-2 border rounded-lg ${formData.gifts.includes(gift._id)
                            ? "bg-blue-100 border-blue-400"
                            : "bg-white border-gray-200"
                          }`}
                      >
                        <input
                          type="checkbox"
                          id={gift._id}
                          name="gifts"
                          value={gift._id}
                          checked={formData.gifts.includes(gift._id)}
                          onChange={handleInputChangcheck} // Added onChange handler

                        />
                        <label htmlFor={gift._id} className="ml-2">
                          {gift.giftName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="productName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category._id} // Assuming you want to use the category ID as the value
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <option value="" disabled>Select a category</option>
                    {CategorySelect.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock */}
                <div className="mb-4">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  />
                </div>

                {/* Including Gift */}
                <div className="mb-4 flex items-center">
                  <label
                    htmlFor="includingGift"
                    className="inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id="includingGift"
                      name="includingGift"
                      checked={formData.includingGift}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div
                      className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Include Gift
                    </span>
                  </label>
                </div>


                {/* Gift Points */}
                {formData.includingGift && (
                  <div className="mb-4">
                    <label
                      htmlFor="giftPoints"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gift Points
                    </label>
                    <input
                      type="number"
                      id="giftPoints"
                      name="giftPoints"
                      value={formData.giftPoints}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </div>
                )}

                {/* Size */}
                <div className="mb-4">
                  <label
                    htmlFor="size"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                  <label
                    htmlFor="Ingredients"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ingredients
                  </label>
                  <div className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <TagsInput
                      value={formData.Ingredients}
                      onChange={setSelected}
                      name="fruits"
                      placeHolder="enter your ingredient"
                      style={{ color: 'red' }}
                    />
                  </div>

                </div>



                {/* Video */}
                <div className="mb-4">
                  <label
                    htmlFor="video"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Video URL
                  </label>
                  <input
                    type="text"
                    id="video"
                    name="video"
                    value={formData.video}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>



                {/* Promotion */}
                <div className="mb-4">
                  <label
                    htmlFor="promotion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Promotion
                  </label>
                  <input
                    type="text"
                    id="promotion"
                    name="promotion"
                    value={formData.promotion.name}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                    disabled
                  />
                </div>

              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-blue-700 flex  hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
