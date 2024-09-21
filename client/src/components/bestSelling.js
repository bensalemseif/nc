import React, { useState } from "react";
import ProductCard from "./prodCard";

const BestSellingProducts = ({ bestSellingProducts, fallbackProducts }) => {
  const [viewType, setViewType] = useState("grid"); // State to toggle between grid and list view
  const productsToDisplay =
    bestSellingProducts.length > 0 ? bestSellingProducts : fallbackProducts;

  return (
    (bestSellingProducts.length > 0 || fallbackProducts.length > 0) && (
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          {bestSellingProducts.length > 0
            ? "Best Selling Products"
            : "Featured Products"}
        </h2>

        {/* Product Grid/List Display */}
        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"}>
          {productsToDisplay.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewType={viewType}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default BestSellingProducts;
