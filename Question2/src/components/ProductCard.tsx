import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard: React.FC<any> = ({ product }) => {
    const randomImageUrl = `https://picsum.photos/seed/${product.id}/300/200`;
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <Link to={`/product/${product.id}`}>
      <img src={randomImageUrl} alt={product.name} className="w-full h-48 object-cover mb-4" />
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p>Price: ${product.price}</p>
        <p>Rating: {product.rating}</p>
      </Link>
    </div>
  );
};

export default ProductCard;
