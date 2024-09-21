import React, { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import bg from "../../assets/background.png";
import Pagination from "../../components/Pagination";
import { showToast } from "../../utils/toastNotifications";

const Favorites = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await api.get("/wishlist/");
        setProducts(response.data);
      } catch (error) {
        showToast("Failed to load wishlist. Please try again later.", "error");
      }
    };

    fetchProducts();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
      showToast("Product removed from wishlist.", "success");
    } catch (error) {
      showToast("Failed to remove product. Please try again later.", "error");
    }
  };


  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handler for changing pages
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
<div className="overflow-x-hidden min-h-screen">
  <section className="relative w-full py-12 md:py-24 lg:py-32 bg-black text-white">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-50"
      style={{ backgroundImage: `url(${bg})` }}
    />
    <div className="relative container mx-auto px-4 md:px-6 text-center">
      <h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        FAVORITE LIST
      </h1>
      <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto">
        Our state-of-the-art factory is where innovation meets excellence.
      </p>
    </div>
  </section>
  <div className="container mx-auto px-4 py-6 md:py-12">
    <p className="text-gray-600 text-sm md:text-base mb-4">
      {products.length} {products.length === 1 ? 'ITEM' : 'ITEMS'}
    </p>
    {products.length === 0 ? (
      <p className="text-gray-500 text-center text-lg sm:text-xl md:text-2xl mt-20">
        There are no products in the favorite list
      </p>
    ) : (
      <>
        <div className="space-y-6">
          {currentProducts.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center w-full md:w-auto">
                <img
                  src={`${item.imagePath[0]}`}
                  alt={item.productName}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md"
                />
                <div className="ml-0 mt-4 sm:ml-4 sm:mt-0 w-full md:w-auto">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                    {item.productName}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-full sm:max-w-sm md:max-w-md overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 w-full md:w-auto">
                <p className="text-lg md:text-xl font-bold text-gray-800">
                  {item.finalPrice} TND
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="mt-2 md:mt-0 md:ml-4 text-red-500 text-sm md:text-base"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Component */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </>
    )}
  </div>
</div>



  );
}

export default Favorites;
