import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Clock, Heart, Utensils, Clock as ClockIcon, Star, Users, Flame, Leaf, Globe } from 'lucide-react';
import { recipesData } from '@/components/recipeCarousel';

export default function RecetteDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      // Simuler un chargement de données
      const fetchRecipe = async () => {
        try {
          // Ici, vous pourriez faire un appel API pour récupérer la recette par son ID
          const foundRecipe = recipesData.find(r => r.id === parseInt(id));
          if (foundRecipe) {
            setRecipe(foundRecipe);
            setIsFavorite(foundRecipe.favorite);
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la recette:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Ici, vous pourriez mettre à jour le statut favori dans votre base de données
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recette non trouvée</h2>
          <p className="text-gray-600 mb-6">La recette que vous recherchez n'existe pas ou a été supprimée.</p>
          <Link href="/menu-plaisir" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Retour aux recettes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{recipe.title} | RASHAQA</title>
        <meta name="description" content={`Découvrez comment préparer ${recipe.title}`} />
      </Head>

      {/* En-tête avec image de la recette */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-6">
          <div className="flex justify-between items-start">
            <Link href="/menu-plaisir" className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
              <ArrowLeft size={20} className="text-gray-800" />
            </Link>
            <button 
              onClick={toggleFavorite}
              className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart 
                size={20} 
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
              />
            </button>
          </div>
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-green-600 text-xs font-medium px-2 py-1 rounded-full">
                {recipe.category === 'plaisir' ? 'Plaisir' : 
                 recipe.category === 'sante' ? 'Santé' : 
                 recipe.category === 'vege' ? 'Végétarien' : 
                 recipe.category === 'rapide' ? 'Rapide' : 
                 recipe.category === 'mondial' ? 'Du monde' : 
                 recipe.category}
              </span>
              <div className="flex items-center text-sm">
                <ClockIcon size={14} className="mr-1" />
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users size={14} className="mr-1" />
                <span>{recipe.servings} pers.</span>
              </div>
              <div className="flex items-center text-sm">
                <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                <span>{recipe.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-gray-200">{recipe.description || 'Une délicieuse recette à découvrir.'}</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Section Ingrédients */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Utensils size={20} className="mr-2 text-green-600" />
              Ingrédients
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Préparation */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-green-600" />
              Préparation
            </h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Bouton de retour */}
        <div className="mt-8 text-center">
          <Link 
            href="/menu-plaisir" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Retour aux recettes
          </Link>
        </div>
      </div>
    </div>
  );
}
