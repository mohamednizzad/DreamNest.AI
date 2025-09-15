import React, { useState, useCallback, useEffect } from 'react';
import { type DesignAssets } from '../types';
import { ProductCard } from './ProductCard';
import { CameraIcon, ImageIcon, MapIcon, SpeakerWaveIcon, ShoppingBagIcon, ArrowPathIcon, ArrowDownTrayIcon } from './IconComponents';

interface ResultsDisplayProps {
  assets: DesignAssets;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ assets, onReset }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    // Cleanup function to cancel speech synthesis when the component unmounts
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, [synth]);

  const handlePlayWalkthrough = useCallback(() => {
    if (!synth) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(assets.walkthroughScript);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
    setIsSpeaking(true);
  }, [assets.walkthroughScript, synth]);

  return (
    <div className="space-y-12 animate-fade-in">
        <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Dream Home Awaits</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Explore the AI-generated design based on your unique vision.</p>
        </div>

      {/* Video Tour - Conditionally rendered */}
      {assets.videoUrl && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
            <h3 className="flex items-center text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100"><CameraIcon className="w-7 h-7 mr-3 text-indigo-600"/>3D Video Tour</h3>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-900">
            <video src={assets.videoUrl} controls autoPlay muted loop className="w-full h-full object-cover">
                Your browser does not support the video tag.
            </video>
            </div>
        </section>
      )}

      {/* Image Gallery & Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
          <h3 className="flex items-center text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100"><ImageIcon className="w-7 h-7 mr-3 text-indigo-600"/>Photorealistic Renderings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.images.map((img, index) => (
              <img key={index} src={img} alt={`House rendering ${index + 1}`} className="w-full h-auto object-cover rounded-lg shadow-md" />
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
            <h3 className="flex items-center text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100"><SpeakerWaveIcon className="w-7 h-7 mr-3 text-indigo-600"/>Voice-Guided Walkthrough</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 h-48 overflow-y-auto pr-2">{assets.walkthroughScript}</p>
            <button onClick={handlePlayWalkthrough} className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                {isSpeaking ? 'Stop Walkthrough' : 'Play Walkthrough'}
            </button>
        </div>
      </div>

      {/* 2D Floor Plan */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
            <h3 className="flex items-center text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100"><MapIcon className="w-7 h-7 mr-3 text-indigo-600"/>2D Floor Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <img src={assets.plan2D.imageUrl} alt="2D floor plan" className="w-full h-auto object-contain rounded-lg shadow-md bg-gray-100 dark:bg-gray-700" />
                </div>
                <div className="flex flex-col">
                    <p className="text-gray-600 dark:text-gray-300 flex-grow">{assets.plan2D.description}</p>
                    <a 
                        href={assets.plan2D.imageUrl} 
                        download="dreamnest-2d-plan.png"
                        className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Download Plan
                    </a>
                </div>
            </div>
        </section>

      {/* 3D Floor Plan */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
            <h3 className="flex items-center text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100"><MapIcon className="w-7 h-7 mr-3 text-indigo-600"/>3D Floor Plan</h3>
            <div className="space-y-4">
                 <img src={assets.plan3D.imageUrl} alt="3D floor plan" className="w-full h-auto object-contain rounded-lg shadow-md bg-gray-100 dark:bg-gray-700" />
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <p className="text-gray-600 dark:text-gray-300 flex-grow">{assets.plan3D.description}</p>
                    <a 
                        href={assets.plan3D.imageUrl} 
                        download="dreamnest-3d-plan.png"
                        className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Download Plan
                    </a>
                </div>
            </div>
        </section>

      {/* Shopping List */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
        <h3 className="flex items-center text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100"><ShoppingBagIcon className="w-7 h-7 mr-3 text-indigo-600"/>Shop the Look</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {assets.shoppingList.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      </section>
      
      <div className="text-center pt-8">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-8 py-3 bg-gray-700 dark:bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-800 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-transform transform hover:scale-105"
        >
          <ArrowPathIcon className="w-6 h-6 mr-2" />
          Create Another Design
        </button>
      </div>
    </div>
  );
};