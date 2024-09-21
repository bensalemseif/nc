import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // If total pages are 5 or less, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and the current page with some surrounding pages
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 mx-1 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        &laquo;
      </button>
      {renderPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={index} className="p-2 mx-1 text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`p-2 mx-1 ${
              currentPage === page ? 'bg-green-600 text-white' : 'bg-gray-100'
            } rounded-lg`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 mx-1 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
