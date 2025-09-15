
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputForm } from './components/InputForm';
import { GenerationProgress } from './components/GenerationProgress';
import { ResultsDisplay } from './components/ResultsDisplay';
import { type FormData, type DesignAssets, type GenerationStatus } from './types';
import { generateDesignAssets } from './services/geminiService';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [designAssets, setDesignAssets] = useState<DesignAssets | null>(null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    stage: '',
    messages: []
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFormSubmit = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setDesignAssets(null);

    try {
      const assets = await generateDesignAssets(formData, setGenerationStatus);
      setDesignAssets(assets);
    } catch (err) {
      console.error('An error occurred during asset generation:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate design. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setIsLoading(false);
    setError(null);
    setDesignAssets(null);
    setGenerationStatus({ stage: '', messages: [] });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {!isLoading && !designAssets && !error && (
          <InputForm onSubmit={handleFormSubmit} />
        )}
        {isLoading && (
          <GenerationProgress status={generationStatus} />
        )}
        {!isLoading && error && (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">Generation Failed</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        {!isLoading && designAssets && (
          <ResultsDisplay assets={designAssets} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
