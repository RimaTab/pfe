import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import styles from '../styles/Programme.module.css';

export default function Programme() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  const menuOptions = [
    { id: 'petit', label: 'Menu petit' },
    { id: 'petit-budget', label: 'Menu petit budget' },
    { id: 'gourmand', label: 'Menu gourmand' },
    { id: 'vegetarien', label: 'Menu végétarien' },
    { id: 'traditionnel', label: 'Menu traditionnel' },
    { id: 'italien', label: 'Menu italien' }
  ];
  
  const router = useRouter();

  const handleMenuSelect = (menuId) => {
    router.push(`/menu/${menuId}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.programmeHeader}>
          <h1 className={styles.title}>Je choisis mon menu</h1>
          <p className={styles.subtitle}>
            Choisir un menu, c'est choisir une catégorie de repas. 
            Choisissez le profil de recettes qui correspond au maximum 
            à vos goûts, adaptés à votre style de vie.
          </p>
        </div>

        <div className={styles.menuGrid}>
          {menuOptions.map((menu) => (
            <button
              key={menu.id}
              className={`${styles.menuButton} ${selectedMenu === menu.id ? styles.selected : ''}`}
              onClick={() => handleMenuSelect(menu.id)}
            >
              {menu.label}
            </button>
          ))}
        </div>

        <div className={styles.customizationSection}>
          <div className={styles.imageContainer}>
            <img src="/ppp.webp" alt="Aperçu du menu" className={styles.menuImage} />
            <div className={styles.imageDimensions}>566 × 666</div>
          </div>

          <div className={styles.customizationText}>
            <h2 className={styles.customizationTitle}>Je personnalise mes repas</h2>
            <p className={styles.customizationDescription}>
              Vous aimez la cuisine, vous êtes plutôt sans gluten, vous avez toutes les recettes 
              que vous aimez. Découvrez le menu qui vous plait dans les prochains 
              jours et personnalisez-le selon vos préférences.
            </p>
            <button className={styles.customizeButton}>
              Je découvre mon menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
