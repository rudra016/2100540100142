const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors'); 

const app = express();
const PORT = 10533;
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzI0MTcwNTI2LCJpYXQiOjE3MjQxNzAyMjYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI3ZDg4YTEzLWRiODQtNDc4OC1iMzZkLWMwZDBlYjViMjYzMyIsInN1YiI6InJ1ZHJhNjE5a3VtYXJAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiQkJESVRNIiwiY2xpZW50SUQiOiJiN2Q4OGExMy1kYjg0LTQ3ODgtYjM2ZC1jMGQwZWI1YjI2MzMiLCJjbGllbnRTZWNyZXQiOiJuTnB4d3dmcVNxSm9jU3dYIiwib3duZXJOYW1lIjoiUnVkcmEgS3VtYXIiLCJvd25lckVtYWlsIjoicnVkcmE2MTlrdW1hckBnbWFpbC5jb20iLCJyb2xsTm8iOiIyMTAwNTQwMTAwMTQyIn0.hyh6xdJy-9yFYBE7bkvw0n5ouDeLecla0bAHbdyOy1E";
const BASE_URL = 'http://20.244.56.144/test/companies';
const COMPANIES = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];

let productCache = {};


const generateProductId = (product) => {
  return crypto.createHash('md5').update(JSON.stringify(product)).digest('hex');
};


app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173' 
}));

//below is logic for automatic token refresh, i was not able to find the error occuring in this thats why i commented it out and hard coded it :()
// const getNewToken = async () => {
//   try {
//     const response = await axios.post('http://20.244.56.144/test/auth', {
//       companyName: "BBDITM",
//       clientID: "b7d88a13-db84-4788-b36d-c0d0eb5b2633",
//       clientSecret: "nNpxwwfqSqJocSwX",
//       ownerName: "Rudra Kumar",
//       ownerEmail: "rudra619kumar@gmail.com",
//       rollNo: "2100540100142"
//     });
//     bearerToken = response.data.access_token;
//     tokenExpiresAt = Date.now() + 5 * 60 * 1000; 
//     console.log('New token fetched:', bearerToken);
//   } catch (error) {
//     console.error('Failed to fetch new token', error);
//     throw error;
//   }
// };

// axios.interceptors.request.use(async (config) => {
//   if (!bearerToken || Date.now() >= tokenExpiresAt) {
//     await getNewToken();
//   }
//   config.headers['Authorization'] = `Bearer ${bearerToken}`;
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

app.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params;
  const { n = 10, page = 1, sort_by, order = 'asc', minPrice = 1, maxPrice = 10000 } = req.query;

  const requests = COMPANIES.map(company => {
    return axios.get(`${BASE_URL}/${company}/categories/${categoryname}/products?top=${n}&minPrice=${minPrice}&maxPrice=${maxPrice}`, {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });
  });

  try {
    const responses = await Promise.all(requests);
    let products = responses.flatMap(response => response.data);

    products = products.map(product => {
      const id = generateProductId(product);
      productCache[id] = product;
      return { ...product, id };
    });

    if (sort_by) {
      products.sort((a, b) => {
        if (order === 'asc') {
          return a[sort_by] > b[sort_by] ? 1 : -1;
        } else {
          return a[sort_by] < b[sort_by] ? 1 : -1;
        }
      });
    }

    const startIndex = (page - 1) * n;
    const paginatedProducts = products.slice(startIndex, startIndex + n);

    res.json(paginatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


app.get('/categories/:categoryname/products/:productid', (req, res) => {
  const { productid } = req.params;
  const product = productCache[productid];

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
