import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:10533/categories/Laptop/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  if (!product) return <div>Loading...</div>;

  const randomImageUrl = `https://picsum.photos/seed/${product.id}/600/400`;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img src={randomImageUrl} alt={product.name} className="w-20% mb-4" />
      
      <p className='font-bold'>Price: ${product.price}</p>
      <p className='font-bold'>Rating: {product.rating}</p>
      <p className='font-bold'>Discount: {product.discount}%</p>
      <p className='font-bold'>Availability: {product.availability}</p>
    </div>
  );
};

export default ProductDetailPage;
