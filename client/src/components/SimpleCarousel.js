import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import api from "../config/axiosConfig";
const SimpleCarousel = ({ images, onImageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const { id } = useParams(); // Use this only if `productId` is not provided
  const [Image, setImage] = useState([]);
  const [prevImages, setPrevImages] = useState([]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length ? 0 : prevIndex + 1
    );
  };

  const [uploadStatus, setUploadStatus] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus("Uploading...");

      const formData = new FormData();
      formData.append("image", file); // Ensure the key matches your backend

      try {
        const response = await api.post(`/upload/add/product/${id}`, formData);

        if (response.status === 200) {
          const imageUrl = response.data.imagePath; // Assuming the response contains the image path
          setImagePreviewUrl(imageUrl); // Update preview URL
          setSelectedFile(null); // Clear the selected file after upload
          setUploadStatus("Upload successful!");

          setTimeout(window.location.reload(), 10000);

          if (onImageChange) {
            onImageChange(imageUrl); // Pass the URL to the parent component if needed
          }
        } else {
          setUploadStatus("Failed to upload image");
        }
      } catch (error) {
        setUploadStatus("Error uploading image");
      }
    }
  };

  const handleDeleteImage = async (image, index) => {
    try {
      await api.delete(`/upload/delete-image/product/${id}`, {
        method: "delete",
        data: { imagePath: image },
      });

      setImage((prevImages) => {
        if (!Array.isArray(prevImages)) {
          return prevImages;
        }
        window.location.reload();

        return prevImages.filter((_, i) => i !== index);
      });
      // Optionally, show a success notification
    } catch (error) {
    }
  };
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="flex">
          {/* Existing images */}
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-full h-80 flex justify-center items-center overflow-hidden ${
                index === currentIndex ? "block" : "hidden"
              }`}
            >
              {image ? (
                <>
                  <img
                    src={`${image}`}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => handleDeleteImage(image, index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    &#x2715;
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex justify-center items-center bg-gray-200">
                  <p>No Image Available</p>
                </div>
              )}
            </div>
          ))}

          {/* Last slot for file input */}
          <div
            className={`flex-shrink-0 w-full h-80 flex justify-center items-center bg-gray-200 ${
              currentIndex === images.length ? "block" : "hidden"
            }`}
            onClick={() => document.getElementById("file-input").click()}
          >
            <div className="flex flex-col items-center justify-center w-full h-full">
              <FaPlus className="text-4xl text-gray-600" />
              <p className="text-gray-600">Add Image</p>
            </div>
            <div>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              {uploadStatus && <p>{uploadStatus}</p>}
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Uploaded Preview"
                  className="mt-4 max-w-xs"
                />
              )}
            </div>
          </div>
        </div>
        {images.length >= 0 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute text-center top-1/2 left-0 transform -translate-y-1/2 bg-white text-gray-800 px-2 py-1 rounded-full  backdrop-filter backdrop-blur-md h-8 w-8 shadow-md"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-gray-800 rounded-full  backdrop-filter backdrop-blur-md h-8 w-8 shadow-md font-semibold flex items-center justify-center"
            >
              <i className="text-gray-500 "> ›</i>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleCarousel;
