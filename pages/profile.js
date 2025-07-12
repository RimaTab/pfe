import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Camera, User, Mail, Phone, Calendar, MapPin, Lock, Edit, Settings, Bell, CreditCard, Heart, LogOut, Loader2, UserPlus } from 'lucide-react';
import styles from '../styles/Profile.module.css';

// Fonction utilitaire pour formater la date au format JJ/MM/AAAA
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'tunisie',
  });
  const [showWelcome, setShowWelcome] = useState(false);

  // Charger les données utilisateur depuis le localStorage au montage du composant
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log('Données utilisateur chargées:', parsedData);
        
        // Vérifier si l'utilisateur vient de s'inscrire
        if (router.query.registered === 'true' || parsedData.justRegistered) {
          setShowWelcome(true);
          // Mettre à jour le statut pour ne plus afficher le message au prochain chargement
          const updatedUserData = { ...parsedData, justRegistered: false };
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          // Supprimer le paramètre de l'URL sans recharger la page
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
        
        // Extraire le prénom et le nom du champ name si nécessaire
        const nameParts = parsedData.name ? parsedData.name.split(' ') : [];
        const firstName = parsedData.firstName || (nameParts.length > 0 ? nameParts[0] : '');
        const lastName = parsedData.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
        
        // Mettre à jour le formulaire avec les données de l'utilisateur
        setFormData(prev => ({
          ...prev,
          firstName: firstName,
          lastName: lastName,
          email: parsedData.email || '',
          phone: parsedData.phone || '',
          birthDate: parsedData.birthDate ? formatDate(parsedData.birthDate) : '',
          address: parsedData.address || '',
          city: parsedData.city || '',
          zipCode: parsedData.zipCode || '',
          country: parsedData.country || 'tunisie',
          // Ajout des champs du quiz s'ils existent
          weight: parsedData.weight || '',
          height: parsedData.height || '',
          goal: parsedData.goal || '',
          activityLevel: parsedData.activityLevel || '',
          dietaryRestrictions: Array.isArray(parsedData.dietaryRestrictions) 
            ? parsedData.dietaryRestrictions.join(', ') 
            : (parsedData.dietaryRestrictions || '')
        }));
      } else {
        console.log('Aucune donnée utilisateur trouvée dans le localStorage');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données utilisateur:', err);
      setError('Impossible de charger les données du profil. Veuillez rafraîchir la page.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const tabs = [
    { id: 'profile', label: 'Profil', icon: <User size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'payment', label: 'Paiement', icon: <CreditCard size={20} /> },
    { id: 'favorites', label: 'Favoris', icon: <Heart size={20} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Valider les champs requis
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('Les champs Nom, Prénom et Email sont obligatoires');
        return;
      }

      // Préparer les données à sauvegarder
      const userData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      };

      // Sauvegarder dans le localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Afficher un message de succès (vous pourriez utiliser un toast ou une notification)
      alert('Profil mis à jour avec succès !');
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError('Une erreur est survenue lors de la mise à jour du profil');
    }
  };

  const handleLogout = () => {
    try {
      // Supprimer les données utilisateur du localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('quizAnswers');
      
      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      setError('Une erreur est survenue lors de la déconnexion');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      </div>
    );
  }

  // Afficher le message de bienvenue
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000); // Le message disparaît après 5 secondes
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  return (
    <div className="min-h-screen bg-gray-50">
      {showWelcome && (
        <div className="bg-green-600 text-white p-4 text-center animate-fade-in">
          <p className="font-medium">Bienvenue sur votre espace personnel ! Votre profil a été créé avec succès.</p>
        </div>
      )}
      <div className={styles.profileContainer}>
        <Head>
          <title>Mon Profil - RASHAQA</title>
          <meta name="description" content="Gérez votre profil RASHAQA" />
        </Head>

        <div className={styles.profileHeader}>
          <button 
            onClick={() => router.back()}
            className={styles.backButton}
            aria-label="Retour"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Mon Profil</h1>
          <div className={styles.profileActions}>
            <button className={styles.editButton}>
              <Edit size={18} />
            </button>
          </div>
        </div>

      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>
          <User size={48} className={styles.avatarIcon} />
        </div>
        <button className={styles.cameraButton}>
          <Camera size={20} />
        </button>
      </div>
      <h2 className={styles.userName}>
        {formData.firstName || 'Utilisateur'} {formData.lastName}
      </h2>
      {formData.email && <p className={styles.userEmail}>{formData.email}</p>}
      <button 
        onClick={() => setActiveTab('profile')} 
        className={styles.editProfileButton}
      >
        <Edit size={16} /> Modifier le profil
      </button>
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'profile' && (
          <div className={styles.profileTab}>
            <div className={styles.infoCard}>
              <h3>Informations personnelles</h3>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel} htmlFor="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.infoInput}
                  placeholder="Votre prénom"
                />
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel} htmlFor="lastName">Nom</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={styles.infoInput}
                  placeholder="Votre nom"
                />
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel} htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.infoInput}
                  placeholder="votre@email.com"
                />
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel} htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.infoInput}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel} htmlFor="birthDate">Date de naissance</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={styles.infoInput}
                />
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>Adresse</h3>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel} htmlFor="address">Adresse</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={styles.infoInput}
                  placeholder="Votre adresse"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel} htmlFor="city">Ville</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={styles.infoInput}
                    placeholder="Votre ville"
                  />
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel} htmlFor="zipCode">Code postal</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={styles.infoInput}
                    placeholder="Code postal"
                  />
                </div>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel} htmlFor="country">Pays</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={styles.infoInput}
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Canada">Canada</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="mt-6 space-y-4">
                <button 
                  type="button" 
                  onClick={handleSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Enregistrer les modifications
                </button>
                <button 
                  type="button"
                  onClick={() => router.push('/quiz')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <UserPlus size={18} className="mr-2" />
                  Compléter mon profil
                </button>
              </div>
            </div>
            
            {/* Section des informations du quiz */}
            {(formData.weight || formData.height || formData.goal || formData.activityLevel || formData.dietaryRestrictions) && (
              <div className={styles.infoCard}>
                <h3>Informations de santé</h3>
                {formData.weight && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Poids</span>
                    <span className={styles.infoValue}>{formData.weight} kg</span>
                  </div>
                )}
                {formData.height && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Taille</span>
                    <span className={styles.infoValue}>{formData.height} cm</span>
                  </div>
                )}
                {formData.goal && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Objectif</span>
                    <span className={styles.infoValue}>
                      {formData.goal === 'Perdre du poids' ? 'Perte de poids' : 
                       formData.goal === 'Prendre du muscle' ? 'Prise de muscle' :
                       formData.goal === 'maintenir' ? 'Maintien du poids' :
                       formData.goal}
                    </span>
                  </div>
                )}
                {formData.activityLevel && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Niveau d'activité</span>
                    <span className={styles.infoValue}>
                      {formData.activityLevel === 'sédentaire' ? 'Sédentaire' :
                       formData.activityLevel === 'légèrement actif' ? 'Légèrement actif' :
                       formData.activityLevel === 'modéré' ? 'Modérément actif' :
                       formData.activityLevel === 'très actif' ? 'Très actif' :
                       formData.activityLevel}
                    </span>
                  </div>
                )}
                {formData.dietaryRestrictions && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Régime alimentaire</span>
                    <div className="mt-2">
                      {formData.dietaryRestrictions.split(', ').map((restriction, index) => (
                        <span key={index} className={styles.tag}>
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className={styles.notificationsTab}>
            <h3>Notifications</h3>
            <p>Gérez vos préférences de notification ici.</p>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className={styles.paymentTab}>
              <h3>Méthodes de paiement</h3>
              <p>Gérez vos méthodes de paiement ici.</p>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className={styles.favoritesTab}>
              <h3>Vos favoris</h3>
              <p>Retrouvez vos recettes et articles préférés ici.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsTab}>
              <h3>Paramètres du compte</h3>
              <p>Gérez les paramètres de votre compte ici.</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className={`${styles.logoutButton} hover:bg-red-50`}
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
