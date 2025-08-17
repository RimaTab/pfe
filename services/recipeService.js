const RECIPES_STORAGE_KEY = 'admin_recipes';

// Récupérer toutes les recettes
export const getRecipes = () => {
  if (typeof window === 'undefined') return [];
  const recipesJson = localStorage.getItem(RECIPES_STORAGE_KEY);
  return recipesJson ? JSON.parse(recipesJson) : [];
};

// Récupérer une recette par son ID
export const getRecipeById = (id) => {
  const recipes = getRecipes();
  return recipes.find(recipe => recipe.id === id);
};

// Créer une nouvelle recette
export const createRecipe = (recipeData) => {
  const recipes = getRecipes();
  const newRecipe = {
    ...recipeData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft'
  };
  
  const updatedRecipes = [...recipes, newRecipe];
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
  return newRecipe;
};

// Mettre à jour une recette existante
export const updateRecipe = (id, recipeData) => {
  const recipes = getRecipes();
  const index = recipes.findIndex(recipe => recipe.id === id);
  
  if (index === -1) return null;
  
  const updatedRecipe = {
    ...recipes[index],
    ...recipeData,
    updatedAt: new Date().toISOString()
  };
  
  const updatedRecipes = [...recipes];
  updatedRecipes[index] = updatedRecipe;
  
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
  return updatedRecipe;
};

// Supprimer une recette
export const deleteRecipe = (id) => {
  const recipes = getRecipes();
  const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
  return true;
};
