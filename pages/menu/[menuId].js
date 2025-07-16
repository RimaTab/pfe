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

// Catégories de repas avec des alternatives variées
const mealAlternatives = {
  // Petit-déjeuner
  'Petit déjeuner': [
    { 
      title: 'Smoothie bowl aux fruits rouges',
      description: 'Un bol vitaminé avec des fruits frais et du granola croustillant',
      image: '/images/breakfast1.jpg',
      calories: 320,
      protein: 8,
      carbs: 58,
      fat: 5
    },
    { 
      title: 'Tartines d\'avocat et œufs',
      description: 'Pain complet grillé, avocat écrasé et œufs pochés',
      image: '/images/breakfast2.jpg',
      calories: 380,
      protein: 18,
      carbs: 35,
      fat: 22
    },
    { 
      title: 'Pancakes protéinés',
      description: 'Pancakes légers à la banane et aux flocons d\'avoine',
      image: '/images/breakfast3.jpg',
      calories: 350,
      protein: 22,
      carbs: 45,
      fat: 8
    },
    { 
      title: 'Bowl de chia au lait d\'amande',
      description: 'Graines de chia, lait d\'amande, fruits frais et noix',
      image: '/images/breakfast4.jpg',
      calories: 290,
      protein: 12,
      carbs: 32,
      fat: 14
    },
    { 
      title: 'Omelette aux champignons',
      description: 'Omelette moelleuse aux champignons et fromage de chèvre',
      image: '/images/breakfast5.jpg',
      calories: 340,
      protein: 25,
      carbs: 8,
      fat: 24
    },
    { 
      title: 'Porridge aux fruits secs',
      description: 'Flocons d\'avoine, cannelle, miel et fruits secs',
      image: '/images/breakfast6.jpg',
      calories: 310,
      protein: 11,
      carbs: 52,
      fat: 7
    }
  ],
  // Déjeuner
  'Déjeuner': [
    { 
      title: 'Bowl thaï au poulet',
      description: 'Riz, poulet grillé, légumes croquants et sauce cacahuète',
      image: '/images/lunch1.jpg',
      calories: 420,
      protein: 32,
      carbs: 45,
      fat: 12
    },
    { 
      title: 'Salade de quinoa méditerranéenne',
      description: 'Quinoa, concombre, tomates, olives et feta',
      image: '/images/lunch2.jpg',
      calories: 380,
      protein: 15,
      carbs: 52,
      fat: 14
    },
    { 
      title: 'Wrap au poulet et légumes',
      description: 'Galette de blé complète, poulet, avocat et crudités',
      image: '/images/lunch3.jpg',
      calories: 400,
      protein: 28,
      carbs: 38,
      fat: 16
    },
    { 
      title: 'Poke bowl saumon avocat',
      description: 'Riz vinaigré, saumon frais, avocat, edamame et sésame',
      image: '/images/lunch4.jpg',
      calories: 450,
      protein: 35,
      carbs: 42,
      fat: 18
    },
    { 
      title: 'Buddha bowl végétarien',
      description: 'Patate douce, chou kale, pois chiches rôtis et tahini',
      image: '/images/lunch5.jpg',
      calories: 390,
      protein: 14,
      carbs: 58,
      fat: 13
    },
    { 
      title: 'Salade césar légère',
      description: 'Laitue romaine, poulet grillé, croûtons et parmesan',
      image: '/images/lunch6.jpg',
      calories: 380,
      protein: 34,
      carbs: 22,
      fat: 18
    }
  ],
  // Dîner
  'Dîner': [
    { 
      title: 'Saumon rôti aux légumes',
      description: 'Filet de saumon avec courgettes et carottes rôties',
      image: '/images/dinner1.jpg',
      calories: 380,
      protein: 35,
      carbs: 20,
      fat: 18
    },
    { 
      title: 'Curry de lentilles corail',
      description: 'Lentilles corail, lait de coco et épices douces',
      image: '/images/dinner2.jpg',
      calories: 320,
      protein: 18,
      carbs: 45,
      fat: 8
    },
    { 
      title: 'Poulet rôti aux herbes',
      description: 'Haut de cuisse de poulet mariné aux herbes avec pommes de terre',
      image: '/images/dinner3.jpg',
      calories: 410,
      protein: 40,
      carbs: 30,
      fat: 15
    },
    { 
      title: 'Lasagnes aux légumes grillés',
      description: 'Pâtes fraîches, aubergines, courgettes et béchamel légère',
      image: '/images/dinner4.jpg',
      calories: 370,
      protein: 18,
      carbs: 48,
      fat: 12
    },
    { 
      title: 'Bowl burrito végétarien',
      description: 'Riz complet, haricots noirs, maïs, avocat et salsa',
      image: '/images/dinner5.jpg',
      calories: 390,
      protein: 15,
      carbs: 62,
      fat: 11
    },
    { 
      title: 'Pavé de cabillaud et ratatouille',
      description: 'Cabillaud poêlé avec une ratatouille de légumes du soleil',
      image: '/images/dinner6.jpg',
      calories: 350,
      protein: 38,
      carbs: 18,
      fat: 14
    }
  ],
  // Collation
  'Collation': [
    { 
      title: 'Yaourt grec aux fruits rouges',
      description: 'Yaourt grec nature avec un mélange de fruits rouges frais',
      image: '/images/snack1.jpg',
      calories: 180,
      protein: 15,
      carbs: 20,
      fat: 4
    },
    { 
      title: 'Barre énergétique maison',
      description: 'Barre aux flocons d\'avoine, fruits secs et miel',
      image: '/images/snack2.jpg',
      calories: 200,
      protein: 6,
      carbs: 30,
      fat: 8
    },
    { 
      title: 'Trempette de légumes et houmous',
      description: 'Bâtonnets de légumes frais avec houmous maison',
      image: '/images/snack3.jpg',
      calories: 160,
      protein: 5,
      carbs: 15,
      fat: 10
    },
    { 
      title: 'Smoothie vert détox',
      description: 'Épinards, banane, pomme verte et graines de lin',
      image: '/images/snack4.jpg',
      calories: 190,
      protein: 4,
      carbs: 38,
      fat: 5
    },
    { 
      title: 'Mélange de noix et fruits secs',
      description: 'Amandes, noix, noix de cajou et baies séchées',
      image: '/images/snack5.jpg',
      calories: 220,
      protein: 8,
      carbs: 12,
      fat: 16
    },
    { 
      title: 'Fromage blanc et muesli',
      description: 'Fromage blanc 0% avec muesli maison et miel',
      image: '/images/snack6.jpg',
      calories: 210,
      protein: 18,
      carbs: 25,
      fat: 4
    }
  ]
};

// Alternatives par thème de menu
const menuThemes = {
  // Alternatives pour le menu végétarien
  'vegetarien': {
    'Petit déjeuner': [
      {
        title: 'Smoothie bowl protéiné',
        description: 'Yaourt de soja, banane, épinards et graines de courge',
        image: '/images/veggie-smoothie-bowl.jpg',
        calories: 320,
        protein: 14,
        carbs: 45,
        fat: 10
      },
      {
        title: 'Porridge aux fruits secs',
        description: 'Flocons d\'avoine, lait d\'amande, miel et fruits secs',
        image: '/images/veggie-porridge.jpg',
        calories: 350,
        protein: 12,
        carbs: 58,
        fat: 8
      }
    ],
    'Déjeuner': [
      {
        title: 'Bowl de légumes rôtis et quinoa',
        description: 'Mélange de légumes de saison rôtis, quinoa et sauce tahini',
        image: '/images/veggie-quinoa-bowl.jpg',
        calories: 480,
        protein: 18,
        carbs: 72,
        fat: 15
      },
      {
        title: 'Curry de pois chiches',
        description: 'Pois chiches, épinards et tomates au lait de coco',
        image: '/images/chickpea-curry.jpg',
        calories: 420,
        protein: 16,
        carbs: 55,
        fat: 18
      }
    ],
    'Dîner': [
      {
        title: 'Risotto aux champignons',
        description: 'Riz arborio, champignons sauvages et parmesan végétal',
        image: '/images/mushroom-risotto.jpg',
        calories: 450,
        protein: 14,
        carbs: 68,
        fat: 16
      },
      {
        title: 'Tartine d\'avocat et œufs pochés',
        description: 'Pain complet, avocat, œufs et graines de sésame',
        image: '/images/avocado-toast.jpg',
        calories: 380,
        protein: 18,
        carbs: 45,
        fat: 22
      }
    ]
  },
  // Alternatives pour le menu gourmand
  'gourmand': {
    'Petit déjeuner': [
      {
        title: 'Pancakes aux myrtilles',
        description: 'Pancakes moelleux aux myrtilles et sirop d\'érable',
        image: '/images/blueberry-pancakes.jpg',
        calories: 520,
        protein: 14,
        carbs: 78,
        fat: 18
      },
      {
        title: 'Oeufs bénédictine',
        description: 'Muffin anglais, jambon, œufs pochés et sauce hollandaise',
        image: '/images/eggs-benedict.jpg',
        calories: 580,
        protein: 28,
        carbs: 42,
        fat: 35
      }
    ],
    'Déjeuner': [
      {
        title: 'Boeuf Wellington',
        description: 'Filet de bœuf en croûte, foie gras et champignons',
        image: '/images/beef-wellington.jpg',
        calories: 780,
        protein: 48,
        carbs: 45,
        fat: 48
      },
      {
        title: 'Risotto aux truffes',
        description: 'Risotto crémeux à la truffe noire et parmesan',
        image: '/images/truffle-risotto.jpg',
        calories: 620,
        protein: 18,
        carbs: 72,
        fat: 28
      }
    ],
    'Dîner': [
      {
        title: 'Magret de canard à l\'orange',
        description: 'Magret de canard, sauce à l\'orange et légumes glacés',
        image: '/images/duck-orange.jpg',
        calories: 680,
        protein: 42,
        carbs: 35,
        fat: 42
      },
      {
        title: 'Homard thermidor',
        description: 'Homard gratiné à la moutarde et au cognac',
        image: '/images/lobster-thermidor.jpg',
        calories: 720,
        protein: 52,
        carbs: 28,
        fat: 45
      }
    ]
  },
  // Alternatives pour le menu traditionnel
  'traditionnel': {
    'Petit déjeuner': [
      {
        title: 'Œufs au plat jambon-fromage',
        description: 'Œufs sur le plat, jambon blanc et emmental fondu',
        image: '/images/oeuf-jambon.jpg',
        calories: 420,
        protein: 32,
        carbs: 12,
        fat: 28
      },
      {
        title: 'Croque-monsieur',
        description: 'Pain de mie, jambon, emmental et béchamel',
        image: '/images/croque-monsieur.jpg',
        calories: 480,
        protein: 28,
        carbs: 38,
        fat: 25
      }
    ],
    'Déjeuner': [
      {
        title: 'Pot-au-feu',
        description: 'Bœuf, légumes et bouillon traditionnel',
        image: '/images/pot-au-feu.jpg',
        calories: 580,
        protein: 48,
        carbs: 42,
        fat: 28
      },
      {
        title: 'Cassoulet toulousain',
        description: 'Haricots blancs, saucisse et confit de canard',
        image: '/images/cassoulet.jpg',
        calories: 680,
        protein: 38,
        carbs: 55,
        fat: 38
      }
    ],
    'Dîner': [
      {
        title: 'Choucroute garnie',
        description: 'Choucroute, saucisses et viandes variées',
        image: '/images/choucroute.jpg',
        calories: 720,
        protein: 42,
        carbs: 48,
        fat: 42
      },
      {
        title: 'Bouillabaisse',
        description: 'Soupe de poissons et fruits de mer',
        image: '/images/bouillabaisse.jpg',
        calories: 580,
        protein: 52,
        carbs: 32,
        fat: 28
      }
    ]
  },
  // Alternatives pour le menu italien
  'italien': {
    'Petit déjeuner': [
      {
        title: 'Brioche à la crème',
        description: 'Brioche fourrée à la crème pâtissière',
        image: '/images/italian-brioche.jpg',
        calories: 380,
        protein: 8,
        carbs: 58,
        fat: 14
      },
      {
        title: 'Focaccia aux olives',
        description: 'Pain italien aux olives et romarin',
        image: '/images/focaccia.jpg',
        calories: 320,
        protein: 8,
        carbs: 42,
        fat: 14
      }
    ],
    'Déjeuner': [
      {
        title: 'Lasagnes bolognaise',
        description: 'Pâtes fraîches, bœuf haché et béchamel',
        image: '/images/lasagna.jpg',
        calories: 680,
        protein: 38,
        carbs: 65,
        fat: 32
      },
      {
        title: 'Risotto aux fruits de mer',
        description: 'Riz arborio, fruits de mer et safran',
        image: '/images/seafood-risotto.jpg',
        calories: 580,
        protein: 42,
        carbs: 68,
        fat: 18
      }
    ],
    'Dîner': [
      {
        title: 'Saltimbocca alla romana',
        description: 'Escalopes de veau, jambon cru et sauge',
        image: '/images/saltimbocca.jpg',
        calories: 520,
        protein: 48,
        carbs: 12,
        fat: 32
      },
      {
        title: 'Parmigiana di melanzane',
        description: 'Aubergines, mozzarella et sauce tomate',
        image: '/images/parmigiana.jpg',
        calories: 480,
        protein: 22,
        carbs: 38,
        fat: 28
      }
    ]
  }
};

// Fonction pour générer des repas similaires
const generateSimilarMeals = (meal, index, menuId) => {
  if (!meal) return [];
  
  // Vérifier si on a des alternatives spécifiques pour ce menu et ce type de repas
  const themeAlternatives = menuThemes[menuId]?.[meal.meal] || [];
  
  // Si on a des alternatives spécifiques au thème, les utiliser
  if (themeAlternatives.length > 0) {
    const shuffledThemeAlternatives = [...themeAlternatives].sort(() => 0.5 - Math.random());
    // Si on n'a pas assez d'alternatives spécifiques, compléter avec des génériques
    if (shuffledThemeAlternatives.length >= 3) {
      return shuffledThemeAlternatives.slice(0, 3).map((alt, i) => ({
        ...alt,
        id: `${index}-${i}-${Date.now()}`
      }));
    } else {
      // Compléter avec des alternatives génériques si nécessaire
      const genericAlternatives = mealAlternatives[meal.meal] || [];
      const remaining = 3 - shuffledThemeAlternatives.length;
      const shuffledGenerics = [...genericAlternatives]
        .filter(g => !shuffledThemeAlternatives.some(t => t.title === g.title))
        .sort(() => 0.5 - Math.random())
        .slice(0, remaining);
      
      return [
        ...shuffledThemeAlternatives.map((alt, i) => ({
          ...alt,
          id: `${index}-t${i}-${Date.now()}`
        })),
        ...shuffledGenerics.map((alt, i) => ({
          ...alt,
          id: `${index}-g${i}-${Date.now()}`
        }))
      ].slice(0, 3);
    }
  }
  
  // Sinon, utiliser les alternatives génériques par type de repas
  const genericAlternatives = mealAlternatives[meal.meal] || [];
  
  if (genericAlternatives.length === 0) {
    return [1, 2].map((_, i) => ({
      id: `${index}-${i}-${Date.now()}`,
      title: `Alternative ${i + 1} à ${meal.title}`,
      description: `Une délicieuse alternative à ${meal.title.toLowerCase()}`,
      image: `/images/meal${i + 1}.jpg`,
      calories: Math.max(100, Math.floor(meal.calories * (0.8 + Math.random() * 0.4))),
      protein: Math.floor(meal.protein * (0.7 + Math.random() * 0.6)),
      carbs: Math.floor(meal.carbs * (0.7 + Math.random() * 0.6)),
      fat: Math.floor(meal.fat * (0.7 + Math.random() * 0.6))
    }));
  }
  
  // Mélanger les alternatives pour éviter toujours le même ordre
  const shuffledAlternatives = [...genericAlternatives].sort(() => 0.5 - Math.random());
  
  // Prendre 3 alternatives (ou moins si pas assez disponibles)
  return shuffledAlternatives.slice(0, 3).map((alt, i) => ({
    ...alt,
    id: `${index}-${i}-${Date.now()}`
  }));
};

// Données des menus (à remplacer par un appel API plus tard)
const menusData = {
  petit: {
    id: 'petit',
    title: 'Menu petit',
    description: 'Des repas légers et équilibrés pour une alimentation saine au quotidien.',
    image: '/images/menu.jpg',
    dailyPlan: [
      {
        meal: 'Petit déjeuner',
        time: '8h00',
        title: 'Omelette aux épinards et fromage de chèvre',
        description: 'Une omelette légère et protéinée avec des épinards frais et du fromage de chèvre',
        image: '/Omelette.jpg',
        calories: 350,
        protein: 28,
        carbs: 8,
        fat: 24,
        ingredients: [
          '2 œufs',
          '50g d\'épinards frais',
          '30g de fromage de chèvre',
          '1 c.à.s d\'huile d\'olive',
          'Sel et poivre au goût'
        ],
        preparation: [
          'Battre les œufs dans un bol avec du sel et du poivre.',
          'Faire chauffer l\'huile dans une poêle antiadhésive à feu moyen.',
          'Ajouter les épinards et les faire revenir 1-2 minutes jusqu\'à ce qu\'ils flétrissent.',
          'Verser les œufs battus dans la poêle et laisser cuire à feu doux.',
          'Ajouter le fromage de chèvre émietté sur la moitié de l\'omelette.',
          'Plier l\'omelette en deux et laisser cuire encore 1 minute.'
        ]
      },
      {
        meal: 'Déjeuner',
        time: '12h30',
        title: 'Salade César légère',
        description: 'Une version allégée de la classique salade César',
        image: '/images/salade-cesar.jpg',
        calories: 420,
        protein: 25,
        carbs: 30,
        fat: 12,
        ingredients: [
          '100g de poulet grillé',
          '1/2 laitue romaine',
          '30g de parmesan râpé',
          '1 tranche de pain complet',
          '1 c.à.s de sauce césar allégée',
          'Croûtons (optionnel)'
        ],
        preparation: [
          'Laver et essorer la laitue romaine, puis la déchirer en morceaux.',
          'Couper le poulet grillé en tranches.',
          'Dans un grand bol, mélanger la laitue, le poulet et les croûtons.',
          'Ajouter la sauce césar et bien mélanger pour enrober tous les ingrédients.',
          'Parsemer de parmesan râpé avant de servir.',
          'Servir avec une tranche de pain complet grillé.'
        ]
      },
      {
        meal: 'Collation',
        time: '16h00',
        title: 'Mélange de noix et fruits secs',
        description: 'Un en-cas sain et énergétique',
        image: '/images/fruits-secs.jpg',
        calories: 200,
        protein: 6,
        carbs: 15,
        fat: 14,
        ingredients: [
          '10 amandes',
          '2 noix',
          '1 c.à.s de raisins secs',
          '2 abricots secs',
          '1 c.à.c de graines de courge'
        ],
        preparation: [
          'Mélanger tous les ingrédients dans un petit bol.',
          'Conserver dans une boîte hermétique pour une collation pratique.'
        ]
      },
      {
        meal: 'Dîner',
        time: '19h30',
        title: 'Poulet rôti aux légumes',
        description: 'Un dîner léger et riche en protéines',
        image: '/images/poulet-roti.jpg',
        calories: 380,
        protein: 35,
        carbs: 25,
        fat: 15,
        ingredients: [
          '150g de blanc de poulet',
          '1 courgette',
          '1 poivron',
          '1 oignon',
          '1 c.à.s d\'huile d\'olive',
          'Herbes de Provence',
          'Sel et poivre au goût'
        ],
        preparation: [
          'Préchauffer le four à 200°C (thermostat 6-7).',
          'Couper les légumes en morceaux de taille similaire.',
          'Dans un grand plat de cuisson, mélanger les légumes avec l\'huile d\'olive, les herbes, le sel et le poivre.',
          'Déposer les blancs de poulet sur les légumes et assaisonner.',
          'Enfourner pendant 25-30 minutes jusqu\'à ce que le poulet soit cuit à cœur et les légumes tendres.',
          'Servir chaud avec un filet d\'huile d\'olive.'
        ]
      }
    ]
  },
  'petit-budget': {
    id: 'petit-budget',
    title: 'Menu petit budget',
    description: 'Des repas économiques tout en restant équilibrés et savoureux.',
    image: '/images/budget-meal.jpg',
    dailyPlan: [
      {
        meal: 'Petit déjeuner',
        time: '8h00',
        title: 'Porridge à la banane et cannelle',
        description: 'Flocons d\'avoine cuits avec du lait, banane écrasée et une touche de cannelle',
        image: '/images/porridge.jpg',
        calories: 320,
        protein: 12,
        carbs: 58,
        fat: 6,
        ingredients: [
          '50g de flocons d\'avoine',
          '200ml de lait écrémé',
          '1/2 banane mûre',
          '1 pincée de cannelle',
          '1 c.à.c de miel (optionnel)'
        ],
        preparation: [
          'Dans une casserole, porter le lait à ébullition.',
          'Ajouter les flocons d\'avoine et baisser le feu.',
          'Laisser cuire 5 minutes en remuant régulièrement.',
          'Écraser la banane et l\'incorporer au porridge.',
          'Ajouter la cannelle et bien mélanger.',
          'Verser dans un bol et ajouter un filet de miel si désiré.'
        ]
      },
      {
        meal: 'Déjeuner',
        time: '12h30',
        title: 'Riz aux œufs et légumes',
        description: 'Riz complet sauté avec œufs brouillés et légumes de saison',
        image: '/images/riz-oeufs.jpg',
        calories: 380,
        protein: 18,
        carbs: 65,
        fat: 8,
        ingredients: [
          '80g de riz complet cuit',
          '2 œufs',
          '1 carotte',
          '50g de petits pois',
          '1 oignon',
          '1 c.à.s d\'huile',
          'Sauce soja légère',
          'Poivre au goût'
        ],
        preparation: [
          'Faire cuire le riz selon les instructions du paquet.',
          'Dans une grande poêle, faire chauffer l\'huile à feu moyen.',
          'Faire revenir l\'oignon émincé jusqu\'à ce qu\'il devienne translucide.',
          'Ajouter les carottes et les petits pois, faire sauter 3-4 minutes.',
          'Pousser les légumes sur le côté et casser les œufs dans la poêle.',
          'Brouiller les œufs puis mélanger avec les légumes.',
          'Ajouter le riz cuit et la sauce soja, bien mélanger et laisser dorer légèrement.',
          'Poivrer au goût et servir chaud.'
        ]
      },
      {
        meal: 'Collation',
        time: '16h00',
        title: 'Yaourt nature avec miel',
        description: 'Yaourt nature allégé avec une cuillère à café de miel',
        image: '/images/yaourt-miel.jpg',
        calories: 120,
        protein: 8,
        carbs: 20,
        fat: 2,
        ingredients: [
          '1 yaourt nature allégé (125g)',
          '1 c.à.c de miel',
          '1 pincée de cannelle (optionnel)'
        ],
        preparation: [
          'Verser le yaourt dans un bol.',
          'Ajouter le miel et bien mélanger.',
          'Saupoudrer de cannelle si désiré.',
          'Déguster frais.'
        ]
      },
      {
        meal: 'Dîner',
        time: '19h30',
        title: 'Soupe de lentilles maison',
        description: 'Soupe réconfortante aux lentilles corail, carottes et oignons',
        image: '/images/soupe-lentilles.jpg',
        calories: 280,
        protein: 16,
        carbs: 45,
        fat: 4,
        ingredients: [
          '80g de lentilles corail sèches',
          '1 carotte',
          '1 oignon',
          '1 gousse d\'ail',
          '1 c.à.s d\'huile d\'olive',
          '1 cube de bouillon de légumes',
          '1 feuille de laurier',
          '1 pincée de cumin',
          'Sel et poivre au goût'
        ],
        preparation: [
          'Rincer les lentilles à l\'eau froide et les égoutter.',
          'Dans une grande casserole, faire chauffer l\'huile à feu moyen.',
          'Faire revenir l\'oignon émincé et l\'ail haché jusqu\'à ce qu\'ils soient tendres.',
          'Ajouter les carottes coupées en rondelles et faire revenir 2 minutes de plus.',
          'Ajouter les lentilles, le bouillon de légumes, la feuille de laurier et le cumin.',
          'Porter à ébullition puis réduire le feu et laisser mijoter à couvert pendant 20-25 minutes.',
          'Retirer la feuille de laurier, saler et poivrer à votre goût.',
          'Mixer une partie de la soupe pour l\'épaissir si désiré, puis servir chaud.'
        ]
      }
    ]
  },
  // Menu Gourmand
  'gourmand': {
    id: 'gourmand',
    title: 'Menu Gourmand',
    description: 'Des recettes savoureuses et généreuses pour les amateurs de bonne cuisine',
    image: '/images/gourmet-banner.jpg',
    dailyPlan: [
      {
        meal: 'Petit déjeuner',
        time: '8h30',
        title: 'Brunch gourmand à la française',
        description: 'Œufs brouillés truffés, avocat toasté, saumon fumé et pancakes sirop d\'érable',
        image: '/images/gourmet-breakfast.jpg',
        calories: 650,
        protein: 32,
        carbs: 45,
        fat: 38,
        ingredients: [
          '3 œufs bio',
          '50g de saumon fumé',
          '1/2 avocat',
          '2 tranches de pain de campagne',
          '1 c.à.s de crème fraîche',
          'Truffe en lamelles (optionnel)',
          'Beurre',
          'Sirop d\'érable',
          'Sel et poivre'
        ],
        preparation: [
          'Faire griller le pain de campagne.',
          'Écraser l\'avocat avec un filet de citron, sel et poivre.',
          'Battre les œufs avec la crème fraîche, sel et poivre.',
          'Faire fondre du beurre dans une poêle et cuire les œufs à feu doux en remuant.',
          'Ajouter les lamelles de truffe à la fin de la cuisson.',
          'Servir avec le saumon fumé, l\'avocat toasté et arroser de sirop d\'érable.'
        ]
      },
      {
        meal: 'Déjeuner',
        time: '13h00',
        title: 'Burger gourmet au bœuf wagyu',
        description: 'Pain brioché, steak wagyu, cheddar affiné, oignons caramélisés et sauce maison',
        image: '/images/gourmet-burger.jpg',
        calories: 850,
        protein: 48,
        carbs: 65,
        fat: 45,
        ingredients: [
          '1 pain brioché frais',
          '180g de bœuf wagyu haché',
          '2 tranches de cheddar affiné',
          '1 oignon rouge',
          '1 c.à.s de miel',
          'Feuilles de salade',
          '1 tomate',
          'Cornichons',
          'Sauce burger maison (mayonnaise, ketchup, cornichons hachés)'
        ],
        preparation: [
          'Émincer l\'oignon et le faire caraméliser avec le miel à feu doux.',
          'Former des steaks avec le bœuf haché, saler et poivrer.',
          'Cuire les steaks à la poêle ou au grill à feu vif.',
          'Ajouter le cheddar à la fin de la cuisson pour le faire fondre.',
          'Griller légèrement le pain brioché.',
          'Monter le burger avec la sauce, la salade, la tomate, le steak, les oignons caramélisés et les cornichons.'
        ]
      },
      {
        meal: 'Goûter',
        time: '16h30',
        title: 'Assiette de fromages affinés',
        description: 'Sélection de 3 fromages, confiture de figues et noix caramélisées',
        image: '/images/cheese-plate.jpg',
        calories: 400,
        protein: 18,
        carbs: 25,
        fat: 28,
        ingredients: [
          '60g de brie de Meaux',
          '60g de roquefort',
          '60g de comté affiné 24 mois',
          '2 c.à.s de confiture de figues',
          '20g de noix caramélisées',
          'Quelques raisins frais',
          'Pain aux noix'
        ],
        preparation: [
          'Sortir les fromages du réfrigérateur 1h avant dégustation.',
          'Disposer les fromages sur une planche en bois.',
          'Ajouter la confiture et les noix caramélisées dans des petits ramequins.',
          'Servir avec des tranches de pain aux noix et des raisins frais.'
        ]
      },
      {
        meal: 'Dîner',
        time: '20h00',
        title: 'Filet mignon en croûte de noix',
        description: 'Filet mignon de porc en croûte de noix, purée de pommes de terre truffée et légumes glacés',
        image: '/images/pork-fillet.jpg',
        calories: 780,
        protein: 52,
        carbs: 48,
        fat: 42,
        ingredients: [
          '400g de filet mignon de porc',
          '100g de noix de Grenoble',
          '2 c.à.s de moutarde à l\'ancienne',
          '2 c.à.s de miel',
          '800g de pommes de terre',
          '100ml de crème liquide',
          '50g de beurre',
          'Truffe en poudre',
          'Légumes de saison',
          'Sel et poivre'
        ],
        preparation: [
          'Préchauffer le four à 180°C (th.6).',
          'Hacher grossièrement les noix et les mélanger avec le miel.',
          'Saisir le filet mignon à la poêle sur toutes ses faces.',
          'Badigeonner de moutarde et enrober de la préparation aux noix.',
          'Enfourner pour 25 minutes.',
          'Pendant ce temps, faire cuire les pommes de terre à l\'eau.',
          'Écraser les pommes de terre avec la crème, le beurre, la truffe en poudre, sel et poivre.',
          'Servir avec les légumes de saison.'
        ]
      },
      {
        meal: 'Dessert',
        time: '21h30',
        title: 'Fondant au chocolat cœur coulant',
        description: 'Fondant au chocolat noir 70% avec cœur coulant et glace vanille',
        image: '/images/chocolate-fondant.jpg',
        calories: 520,
        protein: 8,
        carbs: 45,
        fat: 35,
        ingredients: [
          '200g de chocolat noir 70%',
          '150g de beurre',
          '3 œufs',
          '60g de sucre',
          '50g de farine',
          '1 gousse de vanille',
          'Glace vanille maison',
          'Framboises fraîches',
          'Feuilles de menthe'
        ],
        preparation: [
          'Préchauffer le four à 200°C (th.6-7).',
          'Faire fondre le chocolat et le beurre au bain-marie.',
          'Battre les œufs avec le sucre jusqu\'à ce que le mélange blanchisse.',
          'Incorporer le chocolat fondu, puis la farine.',
          'Verser dans des moules à fondants beurrés et farinés.',
          'Enfourner 8-10 minutes selon la taille des moules.',
          'Démouler délicatement et servir tiède avec une boule de glace vanille, des framboises et une feuille de menthe.'
        ]
      }
    ]
  },
  // Menu Végétarien
  'vegetarien': {
    id: 'vegetarien',
    title: 'Menu Végétarien',
    description: 'Une délicieuse sélection de plats végétariens équilibrés et savoureux',
    image: '/images/vegetarian-banner.jpg',
    dailyPlan: [
      {
        meal: 'Petit déjeuner',
        time: '8h00',
        title: 'Bowl petit déjeuner végétalien',
        description: 'Yaourt de coco, granola maison, fruits rouges et graines de chia',
        image: '/images/veggie-breakfast.jpg',
        calories: 380,
        protein: 12,
        carbs: 48,
        fat: 16,
        ingredients: [
          '150g de yaourt de coco',
          '50g de granola maison',
          '100g de mélange de fruits rouges',
          '1 c.à.s de graines de chia',
          '1 c.à.c de miel',
          'Quelques amandes effilées'
        ],
        preparation: [
          'Déposer le yaourt de coco au fond d\'un bol.',
          'Ajouter le granola par-dessus.',
          'Disposer les fruits rouges frais.',
          'Saupoudrer de graines de chia et d\'amandes effilées.',
          'Arroser légèrement de miel avant de servir.'
        ]
      },
      {
        meal: 'Déjeuner',
        time: '12h30',
        title: 'Buddha bowl protéiné',
        description: 'Quinoa, patate douce, houmous et légumes de saison',
        image: '/images/buddha-bowl.jpg',
        calories: 520,
        protein: 22,
        carbs: 75,
        fat: 18,
        ingredients: [
          '80g de quinoa cuit',
          '1 petite patate douce',
          '2 c.à.s de houmous',
          '50g de chou kale',
          '1/2 avocat',
          'Graines de courge',
          'Vinaigrette au citron',
          'Sel et poivre'
        ],
        preparation: [
          'Préchauffer le four à 200°C.',
          'Couper la patate douce en dés, arroser d\'huile d\'olive, saler et enfourner 25 minutes.',
          'Cuire le quinoa selon les instructions du paquet.',
          'Préparer une assiette avec le chou kale, le quinoa, les dés de patate douce.',
          'Ajouter l\'avocat coupé en lamelles et une cuillère de houmous.',
          'Parsemer de graines de courge et arroser de vinaigrette au citron.'
        ]
      },
      {
        meal: 'Goûter',
        time: '16h00',
        title: 'Smoothie vert énergisant',
        description: 'Épinards, banane, pomme et graines de lin',
        image: '/images/green-smoothie.jpg',
        calories: 220,
        protein: 5,
        carbs: 42,
        fat: 6,
        ingredients: [
          '1 banane mûre',
          '1 pomme',
          '2 poignées d\'épinards frais',
          '1 c.à.s de graines de lin moulues',
          '250ml de lait d\'amande',
          'Quelques glaçons'
        ],
        preparation: [
          'Éplucher et couper la banane en morceaux.',
          'Laver et couper la pomme en dés (sans les pépins).',
          'Mettre tous les ingrédients dans un blender.',
          'Mixer jusqu\'à obtenir une texture lisse.',
          'Servir frais avec quelques glaçons.'
        ]
      },
      {
        meal: 'Dîner',
        time: '19h30',
        title: 'Curry de lentilles corail et riz basmati',
        description: 'Lentilles corail au lait de coco et épices douces',
        image: '/images/lentil-curry.jpg',
        calories: 480,
        protein: 24,
        carbs: 68,
        fat: 14,
        ingredients: [
          '150g de lentilles corail',
          '200ml de lait de coco',
          '1 oignon',
          '2 gousses d\'ail',
          '1 c.à.c de curcuma',
          '1 c.à.c de cumin',
          '1 c.à.c de gingembre râpé',
          'Huile d\'olive',
          'Coriandre fraîche',
          '100g de riz basmati'
        ],
        preparation: [
          'Faire cuire le riz basmati selon les instructions du paquet.',
          'Dans une casserole, faire revenir l\'oignon émincé et l\'ail haché dans un peu d\'huile.',
          'Ajouter les épices et bien mélanger.',
          'Verser les lentilles rincées et couvrir d\'eau à hauteur.',
          'Laisser mijoter 15 minutes à feu doux.',
          'Ajouter le lait de coco et poursuivre la cuisson 5 minutes.',
          'Servir avec le riz basmati et parsemer de coriandre fraîche.'
        ]
      }
    ]
  },
  // Menu Traditionnel
  'traditionnel': {
    id: 'traditionnel',
    title: 'Menu Traditionnel',
    description: 'Les classiques de la cuisine traditionnelle revisitée',
    image: '/images/traditional-banner.jpg',
    dailyPlan: [
      {
        meal: 'Petit déjeuner',
        time: '7h30',
        title: 'Petit déjeuner français complet',
        description: 'Tartines, confiture maison, œuf à la coque et jus d\'orange pressé',
        image: '/images/french-breakfast.jpg',
        calories: 450,
        protein: 18,
        carbs: 55,
        fat: 16,
        ingredients: [
          '2 tranches de pain de campagne',
          'Beurre doux',
          'Confiture maison',
          '2 œufs frais',
          '1 verre de jus d\'orange pressé',
          'Fruits de saison',
          'Café ou thé'
        ],
        preparation: [
          'Faire griller le pain de campagne.',
          'Préparer les œufs à la coque (3 minutes dans l\'eau bouillante).',
          'Presser les oranges pour le jus.',
          'Beurrer les tartines et ajouter la confiture.',
          'Servir avec les œufs, les fruits et le jus d\'orange frais.'
        ]
      },
      {
        meal: 'Déjeuner',
        time: '12h30',
        title: 'Bœuf bourguignon',
        description: 'Bœuf mijoté au vin rouge, lardons et petits oignons',
        image: '/images/boeuf-bourguignon.jpg',
        calories: 650,
        protein: 48,
        carbs: 35,
        fat: 32,
        ingredients: [
          '600g de paleron de bœuf',
          '200g de lardons fumés',
          '200g de petits oignons grelots',
          '300g de champignons de Paris',
          '50cl de vin rouge corsé',
          '2 carottes',
          '2 gousses d\'ail',
          '2 c.à.s de farine',
          'Bouquet garni',
          'Huile d\'olive',
          'Sel et poivre'
        ],
        preparation: [
          'Découper la viande en gros cubes et les faire revenir à feu vif.',
          'Ajouter les lardons, les oignons et les carottes coupées en rondelles.',
          'Saupoudrer de farine et bien mélanger.',
          'Mouiller avec le vin rouge et ajouter le bouquet garni.',
          'Couvrir et laisser mijoter à feu doux pendant 3 heures.',
          'Ajouter les champignons émincés 30 minutes avant la fin de la cuisson.',
          'Servir avec des pommes de terre vapeur ou des pâtes fraîches.'
        ]
      },
      {
        meal: 'Goûter',
        time: '16h30',
        title: 'Pain perdu à la cannelle',
        description: 'Pain rassis trempé dans un mélange œuf-lait et poêlé',
        image: '/images/pain-perdu.jpg',
        calories: 280,
        protein: 10,
        carbs: 45,
        fat: 8,
        ingredients: [
          '4 tranches de pain de mie rassis',
          '2 œufs',
          '20cl de lait',
          '1 c.à.s de sucre',
          '1 c.à.c de cannelle',
          'Beurre pour la poêle',
          'Sucre glace pour décorer'
        ],
        preparation: [
          'Battre les œufs avec le lait, le sucre et la cannelle.',
          'Tremper les tranches de pain dans ce mélange.',
          'Faire chauffer une noix de beurre dans une poêle.',
          'Faire dorer les tranches de pain des deux côtés.',
          'Saupoudrer de sucre glace avant de servir.'
        ]
      },
      {
        meal: 'Dîner',
        time: '20h00',
        title: 'Blanquette de veau à l\'ancienne',
        description: 'Veau mijoté à la crème et aux champignons',
        image: '/images/blanquette-veau.jpg',
        calories: 580,
        protein: 52,
        carbs: 40,
        fat: 28,
        ingredients: [
          '800g d\'épaule de veau',
          '2 carottes',
           '1 oignon piqué de clous de girofle',
          '200g de champignons de Paris',
          '20cl de crème fraîche',
          '2 jaunes d\'œufs',
          '1 citron',
          'Bouquet garni',
          '20g de beurre',
          '2 c.à.s de farine',
          '1L de bouillon de volaille'
        ],
        preparation: [
          'Faire revenir la viande dans une cocotte avec le beurre.',
          'Ajouter les carottes coupées en rondelles et l\'oignon piqué.',
          'Saupoudrer de farine et bien mélanger.',
          'Mouiller avec le bouillon et ajouter le bouquet garni.',
          'Laisser mijoter à feu doux pendant 2h30.',
          'Ajouter les champignons émincés 30 minutes avant la fin.',
          'Hors du feu, lier la sauce avec les jaunes d\'œufs et la crème.',
          'Ajouter le jus d\'un demi-citron et rectifier l\'assaisonnement.',
          'Servir avec du riz blanc ou des pommes vapeur.'
        ]
      }
    ]
  },
  // Menu Italien
  'italien': {
    id: 'italien',
    title: 'Menu Italien',
    description: 'Un voyage culinaire à travers les saveurs de l\'Italie',
    image: '/images/italian-banner.jpg',
    dailyPlan: [
      {
        meal: 'Petit déjeuner',
        time: '8h00',
        title: 'Colazione all\'italiana',
        description: 'Cornetto, cappuccino et jus d\'orange pressé',
        image: '/images/italian-breakfast.jpg',
        calories: 380,
        protein: 10,
        carbs: 48,
        fat: 16,
        ingredients: [
          '2 cornetti (viennoiseries italiennes)',
          '1 cappuccino (espresso + lait mousseux)',
          '1 verre de jus d\'orange pressé',
          'Confiture d\'abricot',
          'Beurre'
        ],
        preparation: [
          'Préparer un cappuccino avec une machine à expresso.',
          'Chauffer légèrement les cornetti au four si désiré.',
          'Presser les oranges pour le jus.',
          'Servir avec de la confiture d\'abricot et du beurre à tartiner.'
        ]
      },
      {
        meal: 'Déjeuner',
        time: '13h00',
        title: 'Pasta alla carbonara originale',
        description: 'Spaghetti, œuf, guanciale et pecorino romano',
        image: '/images/carbonara.jpg',
        calories: 780,
        protein: 32,
        carbs: 85,
        fat: 35,
        ingredients: [
          '320g de spaghetti',
          '150g de guanciale (ou pancetta)',
          '4 jaunes d\'œufs',
          '80g de pecorino romano râpé',
          'Poivre noir fraîchement moulu',
          'Sel'
        ],
        preparation: [
          'Faire cuire les pâtes dans une grande quantité d\'eau salée.',
          'Pendant ce temps, couper le guanciale en petits dés et le faire dorer à feu doux.',
          'Battre les jaunes d\'œufs avec le pecorino et beaucoup de poivre.',
          'Égoutter les pâtes en gardant un peu d\'eau de cuisson.',
          'Hors du feu, mélanger rapidement les pâtes avec le guanciale, puis avec la préparation aux œufs en ajoutant un peu d\'eau de cuisson pour créer une crème onctueuse.',
          'Servir immédiatement avec un peu de pecorino râpé et de poivre.'
        ]
      },
      {
        meal: 'Goûter',
        time: '16h30',
        title: 'Tiramisu aux fruits rouges',
        description: 'Version légère avec framboises et mûres',
        image: '/images/tiramisu-fruits-rouges.jpg',
        calories: 320,
        protein: 8,
        carbs: 35,
        fat: 18,
        ingredients: [
          '250g de mascarpone',
          '3 œufs',
          '80g de sucre',
          'Biscuits à la cuillère',
          '200g de fruits rouges',
          'Jus d\'orange',
          'Cacao en poudre'
        ],
        preparation: [
          'Séparer les blancs des jaunes d\'œufs.',
          'Battre les jaunes avec le sucre jusqu\'à ce que le mélange blanchisse.',
          'Ajouter le mascarpone et bien mélanger.',
          'Monter les blancs en neige ferme et les incorporer délicatement à la préparation.',
          'Tremper rapidement les biscuits dans le jus d\'orange.',
          'Dans des verrines, alterner une couche de crème, une couche de biscuits et des fruits rouges.',
          'Terminer par une couche de crème et réserver au frais 4h minimum.',
          'Avant de servir, saupoudrer de cacao en poudre et décorer avec quelques fruits rouges.'
        ]
      },
      {
        meal: 'Dîner',
        time: '20h00',
        title: 'Osso bucco alla milanese',
        description: 'Jarret de veau braisé au vin blanc et gremolata',
        image: '/images/osso-bucco.jpg',
        calories: 620,
        protein: 58,
        carbs: 25,
        fat: 32,
        ingredients: [
          '4 tranches de jarret de veau épaisses',
          '1 oignon',
          '1 carotte',
          '1 branche de céleri',
          '2 gousses d\'ail',
          '25cl de vin blanc sec',
          '40cl de bouillon de volaille',
          '400g de tomates pelées',
          'Farine',
          'Huile d\'olive',
          'Sel et poivre',
          'Pour la gremolata: zeste de citron, ail haché et persil plat'
        ],
        preparation: [
          'Fariné les tranches de jarret et les faire dorer dans l\'huile chaude. Réserver.',
          'Dans la même cocotte, faire revenir l\'oignon, la carotte et le céleri coupés en dés.',
          'Ajouter l\'ail haché, puis déglacer avec le vin blanc.',
          'Laisser réduire de moitié, puis ajouter les tomates écrasées et le bouillon.',
          'Remettre la viande dans la cocotte, couvrir et laisser mijoter à feu doux pendant 2h30.',
          'Préparer la gremolata en mélangeant le zeste de citron, l\'ail et le persil hachés.',
          'Servir l\'osso bucco bien chaud, parsemé de gremolata, accompagné de risotto alla milanese ou de polenta crémeuse.'
        ]
      }
    ]
  }
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
          allSimilarMeals[index] = generateSimilarMeals(meal, index, menuId);
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
                    
                    {/* Section Ingrédients */}
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingrédients :</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {currentMeal.ingredients && currentMeal.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span className="text-gray-700">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Section Préparation */}
                    {currentMeal.preparation && currentMeal.preparation.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Préparation :</h3>
                        <ol className="space-y-2">
                          {currentMeal.preparation.map((step, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="bg-green-100 text-green-700 font-medium rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
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
