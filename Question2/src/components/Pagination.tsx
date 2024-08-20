import React from 'react';

const Pagination: React.FC<any> = ({ page, setPage, totalPages }) => {
  return (
    <div className="flex justify-center mt-4">
      <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded-l">
        Previous
      </button>
      <div className="px-4 py-2 bg-gray-200">{page} of {totalPages}</div>
      <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-4 py-2 bg-gray-300 rounded-r">
        Next
      </button>
    </div>
  );
};

export default Pagination;
