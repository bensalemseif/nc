import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from '../../components/ProductDetails';

const ProductDetailsPage = () => {
  const { productId } = useParams();

  return <ProductDetails productId={productId} />;
};

export default ProductDetailsPage;
