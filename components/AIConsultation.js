import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function AIConsultation() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const response = await fetch('/api/ai-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le serveur');
      }

      const data = await response.json();
      setResponse(data.response || data.error || 'Réponse non disponible');
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Désolé, une erreur est survenue. Veuillez réessayer plus tard.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-24">
      <h1 className="text-3xl font-bold text-center mb-2 flex items-center justify-center">
        <MessageSquare className="mr-2 text-green-700" />
        <span className="border-b-2 border-green-700 pb-1">Conseil IA personnalisé</span>
      </h1>
      
      <p className="text-center text-gray-600 mb-8">
        Dites-nous ce que vous cherchez, l'IA vous guide.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre question ici..."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="absolute bottom-4 right-4 bg-green-700 text-white p-2 rounded-full hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
      
      <div className="mt-8">
        <div className="flex items-center text-gray-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Résultat :</span>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg min-h-20">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700"></div>
            </div>
          ) : response ? (
            <p>{response}</p>
          ) : (
            <p className="text-gray-400">Votre réponse apparaîtra ici...</p>
          )}
        </div>
      </div>
    </div>
  );
}
