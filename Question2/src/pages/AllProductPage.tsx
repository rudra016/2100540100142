import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FIlterBar';
import Pagination from '../components/Pagination';

const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: 'Laptop', 
    company: '',
    rating: 0,
    minPrice: 1,
    maxPrice: 10000,
    availability: 'all',
  });
  const [sortBy, setSortBy] = useState<string>('price');
  const [order, setOrder] = useState<string>('asc');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy, order, page]);

  const fetchProducts = async () => {
    const { category, minPrice, maxPrice } = filters;
    try {
      const response = await axios.get(
        `http://localhost:10533/categories/${category}/products`,
        {
          params: { n: 10, page, sort_by: sortBy, order, minPrice, maxPrice },
        }
      );
      setProducts(response.data);
      setTotalPages(Math.ceil(response.data.length / 10));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">All Products</h1>
      <FilterBar filters={filters} setFilters={setFilters} setSortBy={setSortBy} setOrder={setOrder} />
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default AllProductsPage;
