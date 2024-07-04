import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://backend-bookstore-ydjh.onrender.com/books'); // Adjust the endpoint as needed
      console.log('Fetched books:', response.data); // Debug log
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleEdit = (id) => {
    navigate(`/edit-book/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-bookstore-ydjh.onrender.com/books/${id}`);
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24" style={{ background: 'linear-gradient(to right, #A8CABA, #5D4157)' }}>
      <nav className="w-full fixed top-0 left-0 flex items-center justify-between p-4 bg-gray-800 text-white z-10">
        <h1 className="text-2xl">View Books</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleBack}>
          Back
        </button>
      </nav>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mt-4">
        {books.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 border-b border-gray-300">Book Name</th>
                <th className="py-2 border-b border-gray-300">Publisher Name</th>
                <th className="py-2 border-b border-gray-300">Author</th>
                <th className="py-2 border-b border-gray-300">Publish Date</th>
                <th className="py-2 border-b border-gray-300">Number of Copies</th>
                <th className="py-2 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="bg-gray-50 hover:bg-gray-100">
                  <td className="py-2 border-b border-gray-300">{book.title}</td>
                  <td className="py-2 border-b border-gray-300">{book.publisher.name}</td>
                  <td className="py-2 border-b border-gray-300">{book.author.name}</td>
                  <td className="py-2 border-b border-gray-300">{new Date(book.publishedDate).toLocaleDateString()}</td>
                  <td className="py-2 border-b border-gray-300">{book.copies}</td>
                  <td className="py-2 border-b border-gray-300">
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleEdit(book._id)}>Edit</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDelete(book._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No books available</p>
        )}
      </div>
    </div>
  );
}

export default ViewBooks;
