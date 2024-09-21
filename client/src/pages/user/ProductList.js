import React, { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import {  useNavigate } from "react-router-dom";
import ProductCard from "../../components/prodCard";
import { FaTh, FaList, FaSortUp, FaSortDown ,FaChevronUp ,FaChevronDown } from "react-icons/fa";
import { useHeroSection } from "../../contexts/HeroSectionContext";
import PagesHeroSection from "../../components/PagesHeroSection";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import { showToast } from "../../utils/toastNotifications";
import GlobalError from "../../components/GlobalError";
function ProductList() {
  const { heroData, loading, error } = useHeroSection();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [showGifts, setShowGifts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewType, setViewType] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("finalPrice");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showPromotions, setShowPromotions] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false); // State to toggle filters on mobile

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (err) {
      showToast("Whoops, something went wrong please try later!",'error')
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          minPrice,
          maxPrice,
          sortBy: sortOption,
          sortOrder,
          showGifts,
          showPromotions,
          categories: selectedCategories.join(","),
        });

        const response = await api.get(`/products?${params.toString()}`);
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        showToast("Whoops, something went wrong please try later!",'error')
      }
    };

    fetchProducts();
  }, [
    currentPage,
    searchTerm,
    minPrice,
    maxPrice,
    sortOption,
    sortOrder,
    showGifts,
    showPromotions,
    selectedCategories,
  ]);

  // Update URL when filter changes
  const updateURL = () => {
    const params = new URLSearchParams({
      page: currentPage,
      category: selectedCategories.join(","),
      sortBy: sortOption,
      sortOrder,
    });
    navigate({ search: params.toString() });
  };

  useEffect(() => {
    updateURL();
  }, [currentPage, sortOption, sortOrder, selectedCategories]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleView = () => {
    setViewType(viewType === "grid" ? "list" : "grid");
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  if (loading)   return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>
  );

  if (error) {
    return <GlobalError />;
  }
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {heroData && (
        <PagesHeroSection
          title={heroData.products.title}
          subtitle={heroData.products.subTitle}
          backgroundImage={heroData.products.imagePath}
        />
      )}

      <div className="flex-grow w-full">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Toggle Button for Filters on Mobile */}
          <div className="lg:hidden p-4">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="p-3 border bg-gray-200 rounded-lg flex items-center justify-between w-full"
            >
              <span>Filters</span>
              {filtersVisible ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`${
              filtersVisible ? 'block' : 'hidden'
            } lg:block w-full lg:w-1/4 bg-white shadow-lg p-4 md:p-6 lg:p-8 mb-8 lg:mb-0`}
          >
            <h2 className="text-2xl font-semibold mb-6">Filters</h2>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products"
                className="w-full p-3 border rounded-lg bg-gray-50 shadow-md"
              />
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min Price"
                className="w-full p-3 border rounded-lg bg-gray-50 shadow-md mb-2"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max Price"
                className="w-full p-3 border rounded-lg bg-gray-50 shadow-md"
              />
            </div>

            {/* Gift Toggle */}
            <div className="mb-6 flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showGifts}
                onChange={() => setShowGifts(!showGifts)}
                className="h-6 w-6 rounded border-gray-300 text-green-600"
              />
              <label className="text-gray-800 text-lg">Show Products with Gifts</label>
            </div>

            {/* Promotions Toggle */}
            <div className="mb-6 flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showPromotions}
                onChange={() => setShowPromotions(!showPromotions)}
                className="h-6 w-6 rounded border-gray-300 text-green-600"
              />
              <label className="text-gray-800 text-lg">Show Products with Promotions</label>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                      className="h-6 w-6 rounded border-gray-300"
                    />
                    <label className="text-gray-800">{category.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-3/4 p-4 md:p-6 lg:p-8">
            {/* View and Sort Controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-4">
                <button
                  onClick={toggleView}
                  className={`p-2 border rounded-lg ${
                    viewType === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={toggleView}
                  className={`p-2 border rounded-lg ${
                    viewType === 'list' ? 'bg-green-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  <FaList />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-lg">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="finalPrice">Price</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border rounded-lg"
                >
                  {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {products.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewType === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} viewType={viewType} />
                ))}
              </div>
            ) : (
              <p>No products found</p>
            )}

            {/* Pagination */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
