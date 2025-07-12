import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Menu, X, Clock, Activity, Flame, Zap, Droplet, Coffee, Apple, Carrot, Drumstick, Utensils } from 'lucide-react';

export default function CaloriesBrulees() {
  const [formData, setFormData] = useState({
    activity: '',
    duration: '30',
    gender: '',
    age: '',
    weight: '',
    weightUnit: 'kg'
  });

  const [showResult, setShowResult] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  const activities = [
    { 
      id: 'course', 
      name: 'Course à pied', 
      met: 8.0, 
      icon: '🏃',
      color: 'bg-red-100',
      textColor: 'text-red-600'
    },
    { 
      id: 'velo', 
      name: 'Vélo', 
      met: 7.5, 
      icon: '🚴',
      color: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      id: 'natation', 
      name: 'Natation', 
      met: 6.0, 
      icon: '🏊',
      color: 'bg-cyan-100',
      textColor: 'text-cyan-600'
    },
    { 
      id: 'marche', 
      name: 'Marche rapide', 
      met: 4.5, 
      icon: '🚶',
      color: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      id: 'muscu', 
      name: 'Musculation', 
      met: 6.0, 
      icon: '💪',
      color: 'bg-amber-100',
      textColor: 'text-amber-600'
    },
    { 
      id: 'yoga', 
      name: 'Yoga', 
      met: 3.0, 
      icon: '🧘',
      color: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
  ];

  const equivalentActivities = [
    { 
      icon: '🏀', 
      label: 'Basketball', 
      description: '30 minutes de match',
      color: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    { 
      icon: '⚽', 
      label: 'Football', 
      description: '25 minutes de jeu',
      color: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      icon: '🎾', 
      label: 'Tennis', 
      description: '20 minutes en simple',
      color: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    { 
      icon: '🏓', 
      label: 'Tennis de table', 
      description: '35 minutes de jeu',
      color: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleWeightUnit = () => {
    setFormData(prev => ({
      ...prev,
      weightUnit: prev.weightUnit === 'kg' ? 'lb' : 'kg',
      weight: ''
    }));
  };

  const calculateCaloriesBurned = () => {
    // Basic validation
    if (!formData.activity || !formData.duration || !formData.gender || !formData.age || !formData.weight) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Get MET value for the selected activity
    const activity = activities.find(a => a.id === formData.activity);
    const met = activity ? activity.met : 5.0; // Default MET value
    
    // Convert weight to kg if in lbs
    const weightKg = formData.weightUnit === 'kg' 
      ? parseFloat(formData.weight) 
      : parseFloat(formData.weight) * 0.453592;
    
    // Simple calorie calculation: MET * weight in kg * time in hours
    const hours = parseInt(formData.duration) / 60;
    const calories = met * weightKg * hours;
    
    setCaloriesBurned(Math.round(calories));
    setShowResult(true);
  };

  const resetForm = () => {
    setFormData({
      activity: '',
      duration: '30',
      gender: '',
      age: '',
      weight: '',
      weightUnit: 'kg'
    });
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Calcul des calories brûlées | RASHAQA</title>
        <meta name="description" content="Calculez les calories brûlées pendant vos activités physiques" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Calcul des calories brûlées</h1>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Menu size={24} className="text-gray-700" />
        </button>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-md">
        <p className="text-gray-600 mb-8 text-center">
          Entrez les détails de votre activité pour calculer les calories brûlées.
        </p>

        <div className="space-y-6">
          {/* Activity Selection */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Choisissez une activité
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'activity', value: activity.id } })}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all duration-200 ${
                    formData.activity === activity.id
                      ? `border-green-500 bg-white shadow-md scale-105 ${activity.textColor}`
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`w-12 h-12 ${activity.color} rounded-full flex items-center justify-center mb-2`}>
                    <span className="text-2xl">{activity.icon}</span>
                  </div>
                  <span className="text-sm font-medium">{activity.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Input */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <label htmlFor="duration" className="block text-lg font-medium text-gray-900 mb-2">
              Durée de l'activité
            </label>
            <div className="relative">
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                max="600"
                className="w-full px-4 py-3 text-lg text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <span className="text-gray-500">minutes</span>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            {/* Gender Selection */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Votre genre
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'gender', value: 'male' } })}
                  className={`p-4 rounded-lg border-2 flex items-center justify-center ${
                    formData.gender === 'male'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl mr-2">👨</span>
                  <span>Homme</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'gender', value: 'female' } })}
                  className={`p-4 rounded-lg border-2 flex items-center justify-center ${
                    formData.gender === 'female'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl mr-2">👩</span>
                  <span>Femme</span>
                </button>
              </div>
            </div>

            {/* Age Input */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <label htmlFor="age" className="block text-lg font-medium text-gray-900 mb-2">
                Votre âge
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="30"
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 text-lg text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <span className="text-gray-500">ans</span>
                </div>
              </div>
            </div>

            {/* Weight Input */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="weight" className="block text-lg font-medium text-gray-900">
                  Votre poids
                </label>
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    type="button"
                    onClick={toggleWeightUnit}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.weightUnit === 'kg' ? 'bg-white shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={toggleWeightUnit}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.weightUnit === 'lb' ? 'bg-white shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    lb
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder={formData.weightUnit === 'kg' ? '70' : '154'}
                  min="1"
                  step="0.1"
                  className="w-full px-4 py-3 text-lg text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateCaloriesBurned}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-xl text-lg transition-colors mt-6"
          >
            Calculer les calories brûlées
          </button>
        </div>
      </main>

      {/* Results Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowResult(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Résultats</h2>
              <p className="text-gray-600">Vous avez brûlé environ</p>
              <div className="text-5xl font-bold text-red-600 my-4">{caloriesBurned} <span className="text-2xl">kcal</span></div>
              <p className="text-gray-600">pendant votre activité</p>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">C'est l'équivalent de :</h3>
              <div className="grid grid-cols-2 gap-4">
                {equivalentActivities.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-xl ${item.color} ${item.textColor} flex flex-col items-center`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-50 flex items-center justify-center text-2xl mb-2">
                      {item.icon}
                    </div>
                    <span className="font-medium text-center">{item.label}</span>
                    <span className="text-xs text-center opacity-80">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg text-lg transition-colors"
            >
              Faire un nouveau calcul
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
