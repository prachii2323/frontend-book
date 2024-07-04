import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import logo from './assets/logoo.png'; 

function Wishlist({ wishlistBooks, handleRemoveFromWishlist, handleCloseWishlist }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm max-h-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Wishlist</h2>
        {wishlistBooks.map(book => (
          <div key={book._id} className="border p-2 rounded-lg mb-2 flex flex-col">
            <div className="flex items-center">
              <img src={book.imageUrl} alt={book.title} className="w-16 h-24 object-cover rounded" />
              <div className="ml-2">
                <h3 className="text-sm font-bold">{book.title}</h3>
                <p className="text-xs text-gray-600">by {book.author?.name}</p>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded-sm text-xs mt-2"
                  onClick={() => handleRemoveFromWishlist(book._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <button 
          className="bg-gray-500 text-white px-3 py-1 rounded-sm text-sm mt-4"
          onClick={handleCloseWishlist}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [expandedBook, setExpandedBook] = useState(null);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [isBuyFormOpen, setIsBuyFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    quantity: 1
  });
  const [selectedBookId, setSelectedBookId] = useState(null);
  const booksPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchWishlist();
  }, []);

  const fetchBooks = async (query = '') => {
    try {
      const response = await axios.get('https://backend-bookstore1.onrender.com/books', { params: { search: query } });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.get('https://backend-bookstore1.onrender.com/wishlist', { params: { email } });
      setWishlistBooks(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    await axios.post('https://backend-bookstore1.onrender.com/logout', { email });
    localStorage.removeItem('email');
    navigate('/register');
  };

  const handleViewMore = (book) => {
    setExpandedBook({
      title: book.title,
      author: book.author?.name,
      publisher: book.publisher?.name,
      copies: book.copies,
      publishedDate: book.publishedDate,
      price: book.price,
      summary: book.summary,
      imageUrl: book.imageUrl
    });
  };

  const handleCloseDialog = () => {
    setExpandedBook(null);
  };

  const handleBuyNowClick = (bookId) => {
    setSelectedBookId(bookId);
    setIsBuyFormOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleBuyFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('email');
      const response = await axios.post('https://backend-bookstore1.onrender.com/buy-book', {
        email,
        bookId: selectedBookId,
        name: formData.name,
        address: formData.address,
        pincode: formData.pincode,
        quantity: formData.quantity
      });

      if (response.data.success) {
        setNotification({ show: true, message: 'Purchase successful!' });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000); // Auto-hide after 3 seconds
        setIsBuyFormOpen(false);
        setBooks(books.map(b => b._id === selectedBookId ? { ...b, copies: b.copies - formData.quantity } : b));
      } else {
        console.error('Error buying book:', response.data.message);
      }
    } catch (error) {
      console.error('Error buying book:', error);
    }
  };

  const handleAddToWishlist = async (bookId) => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.post('https://backend-bookstore1.onrender.com/wishlist', { email, bookId });

      if (response.data.success) {
        setNotification({ show: true, message: 'Added to wishlist!' });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
        fetchWishlist();
      } else {
        console.error('Error adding to wishlist:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.delete('https://backend-bookstore1.onrender.com/wishlist', { data: { email, bookId } });

      if (response.data.success) {
        setNotification({ show: true, message: 'Removed from wishlist!' });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
        fetchWishlist();
      } else {
        console.error('Error removing from wishlist:', response.data.message);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div className="p-0">
      <nav className="bg-gray-800 p-4 flex items-center justify-between mb-4">
        <img src={logo} alt="Logo" className="h-31 w-32" /> 
        <div className="flex space-x-4">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => setShowWishlist(true)}>
            Wishlist
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="p-10 bg-white rounded-lg shadow-lg max-w-full">
        <div className="max-w-full mx-auto my-50 mb-4">
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            <div>
              <img src="https://images.unsplash.com/photo-1549737221-bef65e2604a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/800x400" alt="Slide 1" />
              <p className="legend">Ever lusted over a book but had to control yourself because it was too expensive?</p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/800x400" alt="Slide 2" />
              <p className="legend">Our unique book curation is online! We’ve been working hard to bring to you the feeling of visiting Champaca in person to buy books. Take a look below.</p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/800x400" alt="Slide 3" />
              <p className="legend">We select books with love and care and feature books that speak of diverse experiences, places and perspectives from around India and the world.</p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/800x400" alt="Slide 4" />
              <p className="legend">We hope to build a collection that gives you the joy of discovery, each time you visit.</p>
            </div>
          </Carousel>
        </div>
        <h2 className="text-2xl font-bold mb-4 mt-4">Books</h2>
        <form onSubmit={handleSearch} className="mb-4">
          <input 
            type="text" 
            className="w-full p-2 border rounded" 
            placeholder="Search by author, publisher, book name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentBooks.map(book => (
            <div key={book._id} className="border p-4 rounded-lg shadow-lg flex flex-col">
              <div className="flex md:flex-row justify-between">
                <img src={book.imageUrl} alt={book.title} className="w-40 h-52 object-cover mb-4 rounded md:mb-0 md:mr-4" />
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">by {book.author?.name}</p>
                  <p className="text-gray-600 mb-2">Published by {book.publisher?.name}</p>
                  <p className="text-gray-600 mb-2">Published on {new Date(book.publishedDate).toDateString()}</p>
                  <p className="text-gray-600 mb-2">Number of copies: {book.copies}</p>
                  <p className="text-gray-600 mb-2">Price: ₹{book.price}</p>
                </div>
              </div>
              <div className="mt-auto flex justify-center space-x-2">
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded-sm text-sm"
                  onClick={() => handleViewMore(book)}
                >
                  View More
                </button>
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded-sm text-sm"
                  onClick={() => handleBuyNowClick(book._id)}
                >
                  Buy Now
                </button>
                <button 
                  className="bg-yellow-500 text-white px-3 py-1 rounded-sm text-sm"
                  onClick={() => handleAddToWishlist(book._id)}
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(books.length / booksPerPage) }, (_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {expandedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="text-xs bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">{expandedBook.title}</h2>
            <img src={expandedBook.imageUrl} alt={expandedBook.title} className="w-40 h-52 object-cover mb-4 rounded" />
            <p className="text-gray-600 mb-2">Author: {expandedBook.author}</p>
            <p className="text-gray-600 mb-2">Publisher: {expandedBook.publisher}</p>
            <p className="text-gray-600 mb-2">Published Date: {new Date(expandedBook.publishedDate).toDateString()}</p>
            <p className="text-gray-600 mb-2">Copies: {expandedBook.copies}</p>
            <p className="text-gray-600 mb-2">Price: ₹{expandedBook.price}</p>
            <p className="text-gray-600 mb-4">{expandedBook.summary}</p>
            <div className="flex justify-between">
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCloseDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isBuyFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Purchase Book</h2>
            <form onSubmit={handleBuyFormSubmit}>
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </label>
              <label className="block mb-2">
                Address:
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </label>
              <label className="block mb-2">
                Pincode:
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </label>
              <label className="block mb-4">
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  min="1"
                  max="10"
                  required
                />
              </label>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsBuyFormOpen(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Buy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showWishlist && (
        <Wishlist 
          wishlistBooks={wishlistBooks} 
          handleRemoveFromWishlist={handleRemoveFromWishlist}
          handleCloseWishlist={() => setShowWishlist(false)} 
        />
      )}
      {notification.show && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
