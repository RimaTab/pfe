import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react';

// Liste d'adjectifs pour générer des noms de repas variés
const adjectives = ['Savoureux', 'Gourmand', 'Léger', 'Épicé', 'Croustillant', 'Fondant', 'Parfumé', 'Frais', 'Exotique', 'Traditionnel'];
const ingredients = ['Poulet', 'Saumon', 'Bœuf', 'Tofu', 'Pois chiches', 'Lentilles', 'Quinoa', 'Riz complet', 'Patate douce', 'Brocoli'];
const preparations = ['rôti', 'vapeur', 'grillé', 'sauté', 'au four', 'mariné', 'en salade', 'en soupe', 'en wok', 'en papillote'];

// Fonction pour générer un nom de repas aléatoire
const generateMealName = (baseName) => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
  const randomPrep = preparations[Math.floor(Math.random() * preparations.length)];
  
  // 50% de chance d'utiliser le nom de base ou un nouveau nom aléatoire
  return Math.random() > 0.5 
    ? `${randomAdjective} ${randomIngredient} ${randomPrep}`
    : `${baseName} (Variation ${Math.floor(Math.random() * 100)})`;
};

// Fonction pour générer des repas similaires
const generateSimilarMeals = (meal, index) => {
  if (!meal) return [];
  
  return [1, 2, 3].map(i => {
    const baseName = meal.title.split('(')[0].trim(); // Enlève le numéro de variation s'il existe
    const mealName = generateMealName(baseName);
    
    return {
      id: `${index}-${i}-${Date.now()}`,
      title: mealName,
      calories: Math.max(100, Math.floor(meal.calories * (0.8 + Math.random() * 0.4))),
      protein: Math.floor(meal.protein * (0.7 + Math.random() * 0.6)),
      carbs: Math.floor(meal.carbs * (0.7 + Math.random() * 0.6)),
      fat: Math.floor(meal.fat * (0.7 + Math.random() * 0.6)),
      image: meal.image,
      description: `Une délicieuse alternative à ${baseName.toLowerCase()}`
    };
  });
};

// Données des menus (à remplacer par un appel API plus tard)
const menusData = {
  petit: {
    id: 'petit',
    title: 'Menu petit',
    description: 'Des repas légers et équilibrés pour une alimentation saine au quotidien.',
    image: 'http://localhost:3000/menu.jpg',
    dailyPlan: [
      {
        meal: 'Petit déjeuner',
        time: '8h00',
        title: 'Omelette aux épinards et fromage de chèvre',
        description: 'Une omelette légère et protéinée avec des épinards frais et du fromage de chèvre',
        image: 'http://localhost:3000/Omelette.jpg',
        calories: 350,
        protein: 28,
        carbs: 8,
        fat: 24
      },
      {
        meal: 'Déjeuner',
        time: '12h30',
        title: 'Salade César légère',
        description: 'Une version allégée de la classique salade César',
        image: 'http://localhost:3000/SaladeCésarlégère.jpg',
        calories: 420,
        protein: 25,
        carbs: 30,
        fat: 12
      },
      {
        meal: 'Collation',
        time: '16h00',
        title: 'Mélange de noix et fruits secs',
        description: 'Un en-cas sain et énergétique',
        image: 'http://localhost:3000/fruitssecs.jpg',
        calories: 200,
        protein: 6,
        carbs: 15,
        fat: 14
      },
      {
        meal: 'Dîner',
        time: '19h30',
        title: 'Poulet rôti aux légumes',
        description: 'Un dîner léger et riche en protéines',
        image: 'http://localhost:3000/Pouletrôti.jpg',
        calories: 380,
        protein: 35,
        carbs: 25,
        fat: 15
      }
    ]
  },
  // Ajoutez d'autres menus ici
};

export default function MenuDetail() {
  const router = useRouter();
  const { menuId } = router.query;
  
  // État unifié pour une meilleure gestion des dépendances
  const [state, setState] = useState({
    menu: null,
    loading: true,
    activeMeal: 0,
    isRefreshing: false,
    similarMeals: {}
  });
  
  const { menu, loading, activeMeal, isRefreshing, similarMeals } = state;
  const currentMeal = menu?.dailyPlan?.[activeMeal] || null;
  const currentSimilarMeals = similarMeals[activeMeal] || [];

  // Chargement initial du menu
  useEffect(() => {
    if (!menuId) return;
    
    const loadMenu = async () => {
      try {
        const foundMenu = menusData[menuId];
        if (!foundMenu) {
          setState(prev => ({ ...prev, loading: false }));
          return;
        }
        
        // Générer les repas similaires pour tous les repas
        const allSimilarMeals = {};
        foundMenu.dailyPlan?.forEach((meal, index) => {
          allSimilarMeals[index] = generateSimilarMeals(meal, index);
        });
        
        setState({
          menu: foundMenu,
          loading: false,
          activeMeal: 0,
          isRefreshing: false,
          similarMeals: allSimilarMeals
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    
    loadMenu();
  }, [menuId]);

  // Gestion du rafraîchissement des repas similaires
  const handleRefreshSimilar = async () => {
    if (!currentMeal) return;
    
    try {
      setState(prev => ({ ...prev, isRefreshing: true }));
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const similar = generateSimilarMeals(currentMeal, activeMeal);
      
      setState(prev => ({
        ...prev,
        isRefreshing: false,
        similarMeals: {
          ...prev.similarMeals,
          [activeMeal]: similar
        }
      }));
      
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des plats similaires:', error);
      setState(prev => ({ ...prev, isRefreshing: false }));
    }
  };

  // Gestion du changement de repas actif
  const handleMealChange = (index) => {
    setState(prev => ({ ...prev, activeMeal: index }));
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Gestion du menu non trouvé
  if (!menu) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu non trouvé</h2>
          <p className="text-gray-600 mb-6">Le menu que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link href="/programme" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Retour aux menus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{menu.title} | RASHAQA</title>
        <meta name="description" content={menu.description} />
      </Head>

      {/* En-tête avec image du menu */}
      <div className="relative h-64 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end relative z-10 pb-8">
          <div className="max-w-3xl">
            <Link href="/programme" className="inline-flex items-center text-white mb-4 hover:underline">
              <ArrowLeft size={16} className="mr-1" />
              Retour aux menus
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{menu.title}</h1>
            <p className="text-gray-200">{menu.description}</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Votre journée type avec le menu {menu.title.toLowerCase()}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation des repas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <ul>
                {menu.dailyPlan.map((meal, index) => (
                  <li key={index} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => handleMealChange(index)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                        activeMeal === index ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{meal.meal}</div>
                        <div className="text-sm text-gray-500">{meal.time}</div>
                      </div>
                      <ChevronRight size={16} className={`transition-transform ${
                        activeMeal === index ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Détails du repas sélectionné */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-64 bg-gray-200">
                <img
                  src={currentMeal.image}
                  alt={currentMeal.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                      {currentMeal.meal}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800">{currentMeal.title}</h2>
                    <p className="text-gray-600 mt-1">{currentMeal.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{currentMeal.calories}</div>
                        <div className="text-xs text-gray-500">Calories</div>
                      </div>
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{currentMeal.protein}g</div>
                        <div className="text-xs text-gray-500">Protéines</div>
                      </div>
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{currentMeal.carbs}g</div>
                        <div className="text-xs text-gray-500">Glucides</div>
                      </div>
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{currentMeal.fat}g</div>
                        <div className="text-xs text-gray-500">Lipides</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingrédients</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array(5).fill().map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-700">Ingrédient {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Préparation</h3>
                  <ol className="space-y-3">
                    {Array(3).fill().map((_, i) => (
                      <li key={i} className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 text-sm font-medium mr-3">
                          {i + 1}
                        </span>
                        <span className="text-gray-700">Étape {i + 1} de préparation pour {currentMeal.title}.</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Alternatives similaires</h3>
                    <button 
                      onClick={handleRefreshSimilar}
                      disabled={isRefreshing}
                      className="flex items-center text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? 'Recherche...' : 'Rafraîchir'}
                    </button>
                  </div>
                  
                  {currentSimilarMeals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {currentSimilarMeals.map((similar, index) => (
                        <div key={similar.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="h-32 bg-gray-200 relative">
                            <img 
                              src={similar.image} 
                              alt={similar.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium">
                              {similar.calories} cal
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-gray-800 mb-1">{similar.title}</h4>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Protéines: {similar.protein}g</span>
                              <span>Glucides: {similar.carbs}g</span>
                              <span>Lipides: {similar.fat}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      {isRefreshing ? 'Recherche d\'alternatives...' : 'Aucune alternative trouvée'}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Voir la recette complète
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
