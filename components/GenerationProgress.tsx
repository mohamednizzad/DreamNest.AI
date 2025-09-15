
import React from 'react';
import { type GenerationStatus } from '../types';

interface GenerationProgressProps {
    status: GenerationStatus;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({ status }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-700 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Bringing Your Vision to Life...</h2>
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">{status.stage}</p>
            <div className="w-full max-w-md text-left">
                {status.messages.map((msg, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                        <span className="font-mono text-indigo-500 dark:text-indigo-400 mr-2">&gt;</span>{msg}
                    </p>
                ))}
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">Please remain on this page. High-quality design takes a moment to perfect!</p>
        </div>
    );
};
