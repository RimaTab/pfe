import { useState, useEffect } from 'react';
import styles from '../styles/RecipeCarousel.module.css';

export default function RecipeCarousel() {
  // Images array
  const images = [
    { src: "/1.jpg", alt: "Plat équilibré avec poulet et légumes" },
    { src: "/menu.webp", alt: "Salade fraîche avec avocat" },
    { src: "/1.jpg", alt: "Bol de légumes et protéines" },
    { src: "/menu.webp", alt: "Plat de poisson et légumes verts" },
    { src: "/1.jpg", alt: "Salade verte avec œuf" },
  ];

  // State to track current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation functions
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.recipeCarousel}>
      <h2 className={styles.sectionTitle}>À chacun ses goûts, à chacun ses repas !</h2>
      <p className={styles.sectionSubtitle} dangerouslySetInnerHTML={{ __html: '<font style="vertical-align: inherit; color: #666666;">Choisissez parmi nos 100 recettes gourmandes et équilibrées</font>' }}></p>
      
      <div className={styles.carouselContainer}>
        <button className={`${styles.carouselArrow} ${styles.prevArrow}`} onClick={prevSlide}>
          &lt;
        </button>
        
        <div className={styles.carouselImageContainer}>
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt} 
            className={styles.carouselImage}
          />
        </div>
        
        <button className={`${styles.carouselArrow} ${styles.nextArrow}`} onClick={nextSlide}>
          &gt;
        </button>
      </div>
      
      <div className={styles.carouselDots}>
        {images.map((_, index) => (
          <button 
            key={index} 
            className={`${styles.carouselDot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
// Données des recettes (à remplacer par un appel API plus tard)
export const recipesData = [
  {
    id: 1,
    title: 'Pâtes Carbonara',
    category: 'plaisir',
    time: '30 min',
    difficulty: 'Moyen',
    rating: 4.8,
    favorite: true,
    image: 'http://localhost:3000/PâtesCarbonara.jpg',
    tags: ['italien', 'fromage', 'pâtes'],
    servings: 2,
    description: 'Un classique de la cuisine italienne, crémeux et savoureux.',
    ingredients: [
      '300g de pâtes',
      '200g de lardons',
      '3 œufs',
      '50g de parmesan râpé',
      'Poivre noir',
      'Sel'
    ],
    instructions: [
      'Faire cuire les pâtes dans une grande casserole d\'eau bouillante salée selon les instructions du paquet.',
      'Pendant ce temps, faire revenir les lardons à la poêle sans ajout de matière grasse.',
      'Dans un bol, battre les œufs avec le parmesan, du poivre et un peu de sel.',
      'Égoutter les pâtes en gardant un peu d\'eau de cuisson.',
      'Hors du feu, ajouter les pâtes égouttées dans la poêle avec les lardons.',
      'Ajouter le mélange œufs-parmesan et bien mélanger pour créer une sauce onctueuse.',
      'Si nécessaire, ajouter un peu d\'eau de cuisson pour détendre la sauce.',
      'Servir immédiatement avec un peu de parmesan râpé et de poivre noir fraîchement moulu.'
    ]
  },
  {
    id: 2,
    title: 'Salade César',
    category: 'sante',
    time: '20 min',
    difficulty: 'Facile',
    rating: 4.5,
    favorite: false,
    image: 'http://localhost:3000/SaladeCésarlégère.jpg',
    tags: ['légumes', 'poulet', 'salade'],
    servings: 2,
    description: 'Une salade fraîche et croquante avec une sauce césar maison.',
    ingredients: [
      '1 laitue romaine',
      '1 blanc de poulet',
      '50g de parmesan en copeaux',
      '2 tranches de pain de mie',
      '1 gousse d\'ail',
      '2 c. à soupe d\'huile d\'olive',
      '2 c. à soupe de jus de citron',
      '1 c. à café de moutarde',
      '1 jaune d\'œuf',
      'Sel et poivre'
    ],
    instructions: [
      'Faire griller le poulet à la poêle avec un peu d\'huile d\'olive, sel et poivre. Réserver.',
      'Couper le pain en petits dés, les faire dorer à la poêle avec un peu d\'huile d\'olive et l\'ail haché.',
      'Laver et essorer la laitue, la couper en morceaux.',
      'Préparer la sauce en mélangeant le jaune d\'œuf, la moutarde, le jus de citron, et en ajoutant l\'huile d\'olive en filet tout en fouettant.',
      'Dans un grand saladier, mélanger la laitue avec la sauce, ajouter les croûtons, le poulet coupé en dés et les copeaux de parmesan.',
      'Servir immédiatement.'
    ]
  },
  {
    id: 3,
    title: 'Bowl Buddha',
    category: 'vege',
    time: '25 min',
    difficulty: 'Facile',
    rating: 4.7,
    favorite: true,
    image: 'http://localhost:3000/BowlBuddha.jpg',
    tags: ['végétarien', 'healthy', 'légumes'],
    servings: 2,
    description: 'Un repas équilibré et coloré, riche en nutriments.',
    ingredients: [
      '100g de quinoa',
      '1 patate douce',
      '1 avocat',
      '100g de chou rouge',
      '1 carotte',
      '50g de pousses d\'épinards',
      '2 c. à soupe d\'huile d\'olive',
      '1 c. à café de cumin',
      'Sel et poivre',
      'Graines de sésame pour la décoration'
    ],
    instructions: [
      'Préchauffer le four à 200°C.',
      'Éplucher et couper la patate douce en dés, les arroser d\'huile d\'olive, de cumin, de sel et de poivre. Enfourner pour 20 minutes.',
      'Faire cuire le quinoa comme indiqué sur l\'emballage.',
      'Émincer finement le chou rouge et râper la carotte.',
      'Couper l\'avocat en tranches.',
      'Dans un grand bol, disposer le quinoa cuit, les dés de patate douce, le chou rouge, la carotte râpée, l\'avocat et les pousses d\'épinards.',
      'Saupoudrer de graines de sésame et servir avec une vinaigrette de votre choix.'
    ]
  },
  {
    id: 4,
    title: 'Poulet Tikka Masala',
    category: 'mondial',
    time: '45 min',
    difficulty: 'Intermédiaire',
    rating: 4.9,
    favorite: false,
    image: 'http://localhost:3000/PouletTikkaMasala.jpg',
    tags: ['indien', 'épicé', 'riz'],
    servings: 4,
    description: 'Un plat indien crémeux et parfumé, légèrement épicé.',
    ingredients: [
      '600g de blanc de poulet',
      '1 yaourt nature',
      '2 oignons',
      '2 gousses d\'ail',
      '1 morceau de gingembre frais',
      '1 boîte de tomates concassées',
      '20cl de crème fraîche',
      '2 c. à café de garam masala',
      '1 c. à café de curcuma',
      '1 c. à café de piment en poudre',
      'Huile d\'olive',
      'Coriandre fraîche',
      'Riz basmati pour servir'
    ],
    instructions: [
      'Couper le poulet en morceaux et les faire mariner 1h dans le yaourt avec la moitié des épices, du sel et du poivre.',
      'Faire revenir les oignons émincés dans l\'huile d\'olive jusqu\'à ce qu\'ils soient tendres.',
      'Ajouter l\'ail et le gingembre hachés, faire revenir 1 minute.',
      'Ajouter les épices restantes et les tomates concassées. Laisser mijoter 15 minutes.',
      'Faire griller les morceaux de poulet au four ou à la poêle, puis les ajouter à la sauce.',
      'Ajouter la crème fraîche et laisser mijoter 10 minutes à feu doux.',
      'Parsemer de coriandre fraîche et servir avec du riz basmati.'
    ]
  },
  {
    id: 5,
    title: 'Soupe Miso',
    category: 'rapide',
    time: '15 min',
    difficulty: 'Facile',
    rating: 4.6,
    favorite: false,
    image: 'http://localhost:3000/SoupeMiso.jpg',
    tags: ['japonais', 'soupe', 'tofu'],
    servings: 2,
    description: 'Une soupe japonaise traditionnelle, légère et réconfortante.',
    ingredients: [
      '1 litre d\'eau',
      '4 c. à soupe de pâte de miso',
      '100g de tofu ferme',
      '2 champignons shiitaké frais',
      '1 oignon vert',
      '1 feuille d\'algue nori',
      '1 c. à soupe de sauce soja'
    ],
    instructions: [
      'Porter l\'eau à ébullition dans une casserole.',
      'Couper le tofu en petits dés et émincer finement les champignons et l\'oignon vert.',
      'Diluer la pâte de miso dans un peu d\'eau chaude pour éviter les grumeaux.',
      'Ajouter le miso dilué dans l\'eau bouillante, bien mélanger.',
      'Ajouter le tofu, les champignons et la sauce soja. Laisser mijoter 5 minutes à feu doux sans faire bouillir.',
      'Couper l\'algue nori en fines lanières.',
      'Servir la soupe bien chaude, parsemer d\'oignon vert et de lamelles d\'algue nori.'
    ]
  },
  {
    id: 6,
    title: 'Burger Végétarien',
    category: 'vege',
    time: '30 min',
    difficulty: 'Moyen',
    rating: 4.4,
    favorite: true,
    image: 'http://localhost:3000/BurgerVégétarien.jpg',
    tags: ['végétarien', 'burger', 'patates'],
    servings: 4,
    description: 'Un burger gourmand et végétarien à base de haricots rouges et de patates douces.',
    ingredients: [
      '400g de patates douces',
      '1 boîte de haricots rouges',
      '1 oignon',
      '2 gousses d\'ail',
      '50g de chapelure',
      '1 œuf',
      '1 c. à café de cumin',
      '1 c. à café de paprika',
      'Huile d\'olive',
      '4 pains à burger',
      'Feuilles de salade, tomate, oignon rouge pour la garniture',
      'Sauce au choix (ketchup, moutarde, mayonnaise)'
    ],
    instructions: [
      'Éplucher et couper les patates douces en dés, les faire cuire à l\'eau bouillante salée jusqu\'à ce qu\'elles soient tendres. Égoutter et écraser à la fourchette.',
      'Égoutter et rincer les haricots rouges, les écraser grossièrement à la fourchette.',
      'Hacher finement l\'oignon et l\'ail, les faire revenir dans une poêle avec un peu d\'huile d\'olive jusqu\'à ce qu\'ils soient tendres.',
      'Dans un grand saladier, mélanger la purée de patates douces, les haricots rouges écrasés, l\'oignon et l\'ail revenus, la chapelure, l\'œuf et les épices. Bien mélanger.',
      'Former 4 galettes avec les mains légèrement farinées.',
      'Faire chauffer un peu d\'huile dans une poêle et faire dorer les galettes 4-5 minutes de chaque côté.',
      'Griller légèrement les pains à burger, les garnir de salade, de rondelles de tomate, d\'oignon rouge, de la galette de légumes et de la sauce de votre choix.',
      'Servir avec des frites ou une salade verte.'
    ]
  }
];
