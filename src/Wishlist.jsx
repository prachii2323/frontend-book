// wishlist.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Wishlist({ email }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/wishlist?email=${email}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await axios.post('http://localhost:5000/remove-from-wishlist', { email, bookId });
      setWishlist(wishlist.filter(book => book._id !== bookId)); // Update local state
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const buyBook = async (bookId) => {
    try {
      await axios.post('http://localhost:5000/buy-book', { email, bookId });
      fetchWishlist(); // Refresh the wishlist to update book copies
    } catch (error) {
      console.error('Error buying book:', error);
    }
  };

  return (
    <div>
      <h2>Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No books in wishlist.</p>
      ) : (
        <ul>
          {wishlist.map(book => (
            <li key={book._id}>
              <span>{book.title}</span>
              <p>Author: {book.author.name}</p>
              <p>Publisher: {book.publisher.name}</p>
              <button onClick={() => buyBook(book._id)}>Buy Now</button>
              <button onClick={() => removeFromWishlist(book._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Wishlist;
