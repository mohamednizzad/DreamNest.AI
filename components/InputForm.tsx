import React, { useState } from 'react';
import { type FormData } from '../types';
import { SparklesIcon } from './IconComponents';

interface InputFormProps {
  onSubmit: (formData: FormData) => void;
}

const styles = [
  'Modern', 'Traditional', 'Eco-Friendly', 'Minimalist', 'Luxury', 'Scandinavian', 'Bohemian'
];
const outdoorFeatures = [
  'Garden', 'Swimming Pool', 'Patio', 'Rooftop Terrace', 'Balcony', 'Outdoor Kitchen'
];
const specialRooms = [
  'Home Office', 'Gym', 'Home Theatre', 'Prayer Room', 'Maid\'s Room', 'Library', 'Kids Playroom'
];
const orientations = ['North', 'South', 'East', 'West'];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    plotDimensions: '40x60 feet',
    orientation: 'North',
    floors: '2',
    bedrooms: '3',
    bathrooms: '3',
    style: 'Modern',
    outdoorFeatures: ['Garden', 'Swimming Pool'],
    specialRooms: ['Home Office'],
    additionalDetails: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: 'outdoorFeatures' | 'specialRooms', value: string) => {
    setFormData(prev => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Design Your Dream Home</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Fill in the details below and let our AI bring your vision to life.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Core Specs */}
        <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Core Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="plotDimensions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plot Dimensions</label>
              <input type="text" name="plotDimensions" id="plotDimensions" value={formData.plotDimensions} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="orientation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plot Orientation</label>
              <select name="orientation" id="orientation" value={formData.orientation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                {orientations.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="floors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floors</label>
              <input type="number" name="floors" id="floors" value={formData.floors} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" min="1"/>
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms</label>
              <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" min="1"/>
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bathrooms</label>
              <input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" min="1"/>
            </div>
          </div>
        </div>

        {/* Section 2: Style and Features */}
        <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Style & Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Architectural Style</label>
                    <select name="style" id="style" value={formData.style} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                        {styles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Outdoor Features</label>
                    <div className="grid grid-cols-2 gap-2">
                        {outdoorFeatures.map(feature => (
                        <label key={feature} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" checked={formData.outdoorFeatures.includes(feature)} onChange={() => handleCheckboxChange('outdoorFeatures', feature)} className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500" />
                            <span>{feature}</span>
                        </label>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Rooms</label>
                    <div className="grid grid-cols-2 gap-2">
                        {specialRooms.map(room => (
                        <label key={room} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" checked={formData.specialRooms.includes(room)} onChange={() => handleCheckboxChange('specialRooms', room)} className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500" />
                            <span>{room}</span>
                        </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Section 3: Additional Details */}
        <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Additional Details</h3>
          <div>
            <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anything else? (e.g., specific materials, orientation, etc.)</label>
            <textarea name="additionalDetails" id="additionalDetails" value={formData.additionalDetails} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
        </div>
        
        <div className="text-center pt-4">
          <button type="submit" className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
            <SparklesIcon className="w-6 h-6 mr-2" />
            Generate My Dream Home
          </button>
        </div>
      </form>
    </div>
  );
};