import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Heart, Clock, Utensils, Plus, Star, Flame, Leaf, Globe } from 'lucide-react';

export default function MenuPlaisir() {
  const [activeTab, setActiveTab] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Catégories de recettes
  const categories = [
    { id: 'tous', name: 'Tous', icon: <Utensils size={16} className="mr-1" /> },
    { id: 'plaisir', name: 'Plaisir', icon: <Heart size={16} className="mr-1" /> },
    { id: 'sante', name: 'Santé', icon: <Leaf size={16} className="mr-1" /> },
    { id: 'rapide', name: 'Rapide', icon: <Clock size={16} className="mr-1" /> },
    { id: 'vege', name: 'Végétarien', icon: <Leaf size={16} className="mr-1" /> },
    { id: 'mondial', name: 'Du monde', icon: <Globe size={16} className="mr-1" /> },
    { id: 'epice', name: 'Épicé', icon: <Flame size={16} className="mr-1" /> },
  ];
  

  // Données des recettes
  useEffect(() => {
    // Simuler un chargement de données
    const fetchRecipes = async () => {
      try {
        // Ici, vous pourriez faire un appel API
        const mockRecipes = [
          {
            id: 1,
            title: 'Pâtes Carbonaraa',
            category: 'plaisir',
            time: '30 min',
            difficulty: 'Moyen',
            rating: 4.8,
            favorite: true,
            image: 'PâtesCarbonara.jpg',
            tags: ['italien', 'fromage', 'pâtes']
          },
          {
            id: 2,
            title: 'Salade César',
            category: 'sante',
            time: '20 min',
            difficulty: 'Facile',
            rating: 4.5,
            favorite: false,
            image: 'SaladeCésarlégère.jpg',
            tags: ['légumes', 'poulet', 'salade']
          },
          {
            id: 3,
            title: 'Bowl Buddha',
            category: 'vege',
            time: '25 min',
            difficulty: 'Facile',
            rating: 4.7,
            favorite: true,
            image: 'BowlBuddha.jpg',
            tags: ['végétarien', 'healthy', 'légumes']
          },
          {
            id: 4,
            title: 'Poulet Tikka Masala',
            category: 'mondial',
            time: '45 min',
            difficulty: 'Intermédiaire',
            rating: 4.9,
            favorite: false,
            image: 'PouletTikkaMasala.jpg',
            tags: ['indien', 'épicé', 'riz']
          },
          {
            id: 5,
            title: 'Soupe Miso',
            category: 'rapide',
            time: '15 min',
            difficulty: 'Facile',
            rating: 4.6,
            favorite: false,
            image: 'SoupeMiso.jpg',
            tags: ['japonais', 'soupe', 'tofu']
          },
          {
            id: 6,
            title: 'Burger Végétarien',
            category: 'vege',
            time: '30 min',
            difficulty: 'Moyen',
            rating: 4.4,
            favorite: true,
            image: 'BurgerVégétarien.jpg',
            tags: ['végétarien', 'burger', 'patates']
          }
        ];
        
        setRecipes(mockRecipes);
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filtrer les recettes en fonction des critères de recherche
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = activeTab === 'tous' || recipe.category === activeTab;
    const matchesFavorites = !favoritesOnly || recipe.favorite;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  // Basculer le statut favori d'une recette
  const toggleFavorite = (id) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Menu de Plaisir | RASHAQA</title>
        <meta name="description" content="Découvrez nos délicieuses recettes de plaisir culinaire" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* En-tête avec barre de recherche */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-green-700 hover:text-green-800">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Le menu plaisir</h1>
            <div className="w-6"></div> {/* Pour l'alignement */}
          </div>
          
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Rechercher une recette..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Navigation par catégorie */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 py-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === category.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab(category.id)}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`ml-4 p-2 rounded-full ${favoritesOnly ? 'text-red-500' : 'text-gray-400'}`}
              title="Afficher uniquement les favoris"
            >
              <Heart size={20} fill={favoritesOnly ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Utensils className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Aucune recette trouvée</h3>
            <p className="mt-1 text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
                <Link href={`/recette/${recipe.id}`}>
                  <div className="relative cursor-pointer">
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img
                        src={recipe.image || '/images/placeholder-food.jpg'}
                        alt={recipe.title}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute top-0 left-0 bg-green-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                      {categories.find(cat => cat.id === recipe.category)?.name || recipe.category}
                    </div>
                    <button 
                      className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(recipe.id);
                      }}
                    >
                      <Heart 
                        size={20} 
                        className={recipe.favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
                      />
                    </button>
                  </div>
                </Link>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{recipe.title}</h3>
                    <div className="flex items-center bg-yellow-50 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      <Star size={12} className="mr-1 fill-yellow-400" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <div className="flex items-center mr-4">
                      <Clock size={14} className="mr-1" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      {recipe.difficulty}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link href={`/recette/${recipe.id}`}>
                    <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                      Voir la recette
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton flottant d'ajout */}
        <Link 
          href="/ajouter-recette" 
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
          style={{
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
          }}
        >
          <Plus size={24} />
          <span className="sr-only">Ajouter une recette</span>
        </Link>
      </main>
      
      {/* Styles globaux pour cette page */}
      <style jsx global>{`n        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
