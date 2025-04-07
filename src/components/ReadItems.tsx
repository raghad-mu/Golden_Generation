import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

interface Item {
  id: string;
  name: string;
  description: string;
}

const ReadItems: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      setItems(itemsList);
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Items List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex justify-between">
              <Link to={`/update/${item.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                Edit
              </Link>
              <Link to={`/delete/${item.id}`} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Delete
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadItems;