import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Product Detail</h1>
      <p className="text-gray-600 mb-2">Product ID: {id}</p>
      <p className="text-gray-500">Product information and gallery will appear here.</p>
    </div>
  );
}
