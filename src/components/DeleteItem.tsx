import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

interface DeleteItemProps {
  id: string;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'items', id));
      alert('Item deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Delete Item</h2>
      <p className="mb-4">Are you sure you want to delete this item?</p>
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Delete Item
      </button>
    </div>
  );
}

export default DeleteItem;