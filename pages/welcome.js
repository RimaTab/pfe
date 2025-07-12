import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function Welcome() {
  const router = useRouter();
  const { name } = router.query;
  const [hasIncompleteQuiz, setHasIncompleteQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur a un quiz en cours
    const savedQuiz = localStorage.getItem('quizAnswers');
    setHasIncompleteQuiz(!!savedQuiz);
    setIsLoading(false);
  }, []);

  const handleContinueQuiz = () => {
    router.push('/quiz');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Head>
        <title>Bienvenue sur RASHAQA</title>
        <meta name="description" content="Bienvenue sur votre espace personnel RASHAQA" />
      </Head>

      <main className="max-w-md mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenue {name || 'sur RASHAQA'} !
          </h1>
          
          <p className="text-gray-600 mb-8">
            Votre compte a été créé avec succès. 
            Prêt à commencer votre parcours de remise en forme ?
          </p>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Prochaines étapes</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-3">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Compte créé</h3>
                  <p className="text-sm text-gray-500">Votre compte a été créé avec succès</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-3">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email vérifié</h3>
                  <p className="text-sm text-gray-500">Votre adresse email a été vérifiée</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-500 mr-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Profil à compléter</h3>
                  <p className="text-sm text-gray-500">Ajoutez vos informations personnelles</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-gray-300 mr-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-400">Plan personnalisé</h3>
                  <p className="text-sm text-gray-400">Obtenez votre programme sur mesure</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {hasIncompleteQuiz ? (
              <button
                onClick={handleContinueQuiz}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full text-lg transition-colors flex items-center justify-center"
              >
                Continuer le quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            ) : (
              <Link href="/profile" passHref>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-full text-lg transition-colors">
                  Accéder à mon profil
                </button>
              </Link>
            )}
            
            {/* Redirection automatique vers le profil après 3 secondes */}
            {!hasIncompleteQuiz && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    setTimeout(() => {
                      window.location.href = '/profile';
                    }, 3000);
                  `
                }}
              />
            )}
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Vous pouvez modifier ces paramètres à tout moment dans votre espace personnel.
          </p>
        </div>
      </main>
    </div>
  );
}
