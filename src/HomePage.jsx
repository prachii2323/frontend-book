import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import logo from './assets/logoo.png';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [expandedBook, setExpandedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (query = '') => {
    try {
      const response = await axios.get('http://localhost:5000/books', { params: { search: query } });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleViewMore = (book) => {
    setExpandedBook(book);
  };

  const handleCloseDialog = () => {
    setExpandedBook(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col items-center pt-15 pb-1" style={{ background: 'white' }}>
      <nav className="w-full fixed top-0 left-0 flex items-center justify-between p-4 bg-gray-800 text-white z-10">
        <img src={logo} alt="Logo" className="h-31 w-32" />
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => navigate('/register')}>
          Register Now
        </button>
      </nav>
      <div className="p-10 bg-white rounded-lg shadow-lg max-w-full mt-24">
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
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(books.length / booksPerPage) }, (_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {expandedBook && (
        <div className="fixed top-10 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="text-sm bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold mb-4">{expandedBook.title}</h2>
            <p className="text-gray-600 mb-2">Author: {expandedBook.author?.name}</p>
            <p className="text-gray-600 mb-2">Publisher: {expandedBook.publisher?.name}</p>
            <p className="text-gray-600 mb-2">Published on: {new Date(expandedBook.publishedDate).toDateString()}</p>
            <p className="text-gray-600 mb-2">Number of copies: {expandedBook.copies}</p>
            <p className="text-gray-600 mb-2">Price: ₹{expandedBook.price}</p>
            <p className="mb-4">{expandedBook.summary}</p>
            <button 
              className="bg-gray-500 text-white px-3 py-1 rounded-sm text-sm"
              onClick={handleCloseDialog}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <footer className="w-full p-4 bg-gray-800 text-white mt-4 text-center">
        <p>&copy; 2024 Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
