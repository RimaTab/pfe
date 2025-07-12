import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import styles from '../styles/Login.module.css';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation simple
    if (!formData.email || !formData.password) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    
    try {
      // Simulation d'envoi au backend
      console.log('Données de connexion:', formData);
      
      // Simuler une réponse réussie du serveur
      const mockUserData = {
        id: '123',
        email: formData.email,
        name: 'Utilisateur',
        // Autres données utilisateur factices pour le test
      };
      
      // Sauvegarder les données utilisateur dans le localStorage
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      // Vérifier s'il y a un quiz en cours
      const hasQuizInProgress = localStorage.getItem('quizAnswers') !== null;
      
      // Rediriger vers le profil après connexion réussie
      if (hasQuizInProgress) {
        // Si l'utilisateur a un quiz en cours, le rediriger pour le terminer
        router.push('/welcome');
      } else {
        // Sinon, le rediriger vers son profil
        router.push('/profile');
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <div className={styles.formContent}>
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: '<font style="vertical-align: inherit;">Connexion</font>' }}></h1>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Entrez votre email"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Entrez votre mot de passe"
                  className={styles.input}
                />
              </div>
              
              <button type="submit" className={styles.button}>
                CONNEXION
              </button>
            </form>
            
            <p className={styles.signupLink}>
              Vous n'avez pas de compte? <Link href="/signup">Créer un compte</Link>
            </p>
          </div>
          
          <div className={styles.imageContainer}>
            <img src="/login.webp" alt="Alimentation saine" />
          </div>
        </div>
      </div>
    </>
  );
}
