import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import styles from '../styles/Signup.module.css';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState(null);

  // Vérifier si l'utilisateur vient du quiz
  useEffect(() => {
    if (router.query.fromQuiz === 'true') {
      const savedQuizData = localStorage.getItem('quizAnswers');
      if (savedQuizData) {
        setQuizData(JSON.parse(savedQuizData));
      }
    }
  }, [router.query]);

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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      // Préparer les données utilisateur complètes
      const userProfileData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // Note: En production, ne stockez jamais le mot de passe en clair
        profileCompleted: true,
        quizCompleted: !!quizData,
        quizAnswers: quizData || null,
        justRegistered: true, // Marquer que l'utilisateur vient de s'inscrire
        // Ajoutez d'autres champs de profil par défaut si nécessaire
        weight: quizData?.weight || null,
        height: quizData?.height || null,
        goal: quizData?.objective || 'maintenir',
        activityLevel: quizData?.activity || 'modéré',
        dietaryRestrictions: quizData?.dietary_restrictions || []
      };
      
      // Ici, vous ajouterez l'appel à votre API d'inscription
      // Par exemple :
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     password: formData.password,
      //     quizData: quizData || null
      //   })
      // });
      // const data = await response.json();
      
      console.log('Données d\'inscription avec réponses du quiz:', userProfileData);
      
      // Sauvegarder les données utilisateur dans le localStorage
      localStorage.setItem('userData', JSON.stringify(userProfileData));
      
      // Nettoyer les données du quiz du localStorage après inscription réussie
      if (quizData) {
        localStorage.removeItem('quizAnswers');
      }
      
      // Rediriger vers le profil avec le paramètre registered
      router.push('/profile?registered=true');
      
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.formContent}>
            <h1 className={styles.title}>
              <span style={{ color: 'var(--primary)' }}>
                {quizData ? 'Finalisez votre inscription' : 'Créer un compte'}
              </span>
            </h1>
            <p className={styles.subtitle}>
              {quizData 
                ? 'Complétez votre inscription pour accéder à votre plan personnalisé' 
                : 'Rejoignez RASHAQA pour accéder à nos recettes et plans nutritionnels'}
            </p>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Entrez votre nom complet"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
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
                  placeholder="Créez un mot de passe"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <p className="text-xs text-gray-600">
                  En créant un compte, vous acceptez nos{" "}
                  <a href="#" style={{ color: 'var(--button-color)' }} className="underline">Conditions d'utilisation</a> et notre{" "}
                  <a href="#" style={{ color: 'var(--button-color)' }} className="underline">Politique de confidentialité</a>.
                </p>
              </div>
              
              <button type="submit" className={styles.button}>
                S'INSCRIRE
              </button>
            </form>
            
            <p className={styles.loginLink}>
              Vous avez déjà un compte ? <Link href="/login">Connexion</Link>
            </p>
          </div>
          
          {/* Image */}
          <div className={styles.imageContainer}>
            <img src="/login.webp" alt="Inscription" />
          </div>
        </div>
      </div>
    </>
  );
}