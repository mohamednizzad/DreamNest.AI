
import React from 'react';
import { type ShoppingListItem } from '../types';

interface ProductCardProps {
  item: ShoppingListItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col h-full bg-gray-50 dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-indigo-900/20 transition-shadow">
      <div className="flex-grow">
        <h4 className="font-bold text-md text-gray-800 dark:text-gray-100">{item.name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{item.priceRange}</p>
        <button className="w-full mt-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition-colors">
          View Product
        </button>
      </div>
    </div>
  );
};
