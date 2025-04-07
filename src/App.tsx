import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateItem from './components/CreateItem';
import ReadItems from './components/ReadItems';
import UpdateItem from './components/UpdateItem';
import DeleteItem from './components/DeleteItem';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div>
                  <Link to="/" className="flex items-center py-4 px-2">
                    <span className="font-semibold text-gray-500 text-lg">CRUD App</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link to="/" className="py-4 px-2 text-gray-500 hover:text-gray-900">Home</Link>
                <Link to="/create" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Create Item</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<ReadItems />} />
            <Route path="/create" element={<CreateItem />} />
            <Route path="/update/:id" element={<UpdateItem id="" name="" description="" />} />
            <Route path="/delete/:id" element={<DeleteItem id="" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;