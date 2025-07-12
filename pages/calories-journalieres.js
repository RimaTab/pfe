import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { ArrowLeft, Menu } from 'lucide-react';

export default function CaloriesJournalieres() {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    activityLevel: ''
  });

  const activityLevels = [
    {
      id: 'sedentary',
      label: 'Peu actif',
      description: 'Assis la plupart du temps (par ex : travail de bureau)',
      icon: '💺'
    },
    {
      id: 'light',
      label: 'Moyennement actif',
      description: 'Debout la plupart du temps (par ex : professeur, caissier)',
      icon: '🧍'
    },
    {
      id: 'moderate',
      label: 'Actif',
      description: 'Marche la plupart du temps (par ex : serveur, vendeur)',
      icon: '🚶'
    },
    {
      id: 'very_active',
      label: 'Très actif',
      description: 'Activité très physique (par ex : ouvrier)',
      icon: '🏋️'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleHeightUnit = () => {
    setFormData(prev => ({
      ...prev,
      heightUnit: prev.heightUnit === 'cm' ? 'ft' : 'cm',
      height: ''
    }));
  };

  const toggleWeightUnit = () => {
    setFormData(prev => ({
      ...prev,
      weightUnit: prev.weightUnit === 'kg' ? 'lb' : 'kg',
      weight: ''
    }));
  };

  const [result, setResult] = useState(null);
  const resultsRef = useRef(null);

  const calculateCalories = () => {
    // Validation des champs obligatoires
    if (!formData.gender || !formData.age || !formData.height || !formData.weight || !formData.activityLevel) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Conversion des unités si nécessaire
    let heightCm = parseFloat(formData.height);
    let weightKg = parseFloat(formData.weight);
    const age = parseInt(formData.age, 10);

    // Conversion des unités impériales en métriques si nécessaire
    if (formData.heightUnit === 'ft') {
      // Convertir pieds/pouces en cm
      const [feet, inches] = formData.height.split("'").map(Number);
      heightCm = (feet * 30.48) + (inches * 2.54);
    }

    if (formData.weightUnit === 'lb') {
      // Convertir livres en kg
      weightKg = weightKg * 0.453592;
    }

    // Calcul du métabolisme de base (BMR) avec la formule de Mifflin-St Jeor
    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Facteur d'activité physique
    const activityFactors = {
      sedentary: 1.2,      // Peu ou pas d'exercice
      light: 1.375,       // Exercice léger (1-3 jours/semaine)
      moderate: 1.55,     // Exercice modéré (3-5 jours/semaine)
      very_active: 1.725  // Exercice intense (6-7 jours/semaine)
    };

    // Calcul des besoins caloriques journaliers
    const tdee = Math.round(bmr * activityFactors[formData.activityLevel]);
    
    // Calcul pour la perte de poids (déficit de 500 kcal/jour)
    const weightLoss = Math.max(1200, tdee - 500); // Minimum 1200 kcal/jour pour la sécurité
    
    // Calcul pour la prise de poids (surplus de 500 kcal/jour)
    const weightGain = tdee + 500;

    // Mise à jour de l'état avec les résultats
    setResult({
      maintenance: tdee,
      weightLoss,
      weightGain,
      bmr: Math.round(bmr)
    });

    // Faire défiler jusqu'aux résultats
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Calcul des calories journalières | RASHAQA</title>
        <meta name="description" content="Calculez vos besoins quotidiens en calories" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 flex items-center justify-between sticky top-0 z-10">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Calcul des calories journalières</h1>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Menu size={24} className="text-gray-700" />
        </button>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-md">
        <p className="text-gray-600 mb-8 text-center">
          Pour effectuer un calcul exact, nous avons besoin de quelques infos basiques de votre part.
        </p>

        {/* Gender Selection */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">À quel genre appartenez-vous ?</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleInputChange({ target: { name: 'gender', value: 'male' } })}
              className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                formData.gender === 'male' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl mb-2">👨</span>
              <span className="font-medium">Un homme</span>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange({ target: { name: 'gender', value: 'female' } })}
              className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                formData.gender === 'female' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl mb-2">👩</span>
              <span className="font-medium">Une femme</span>
            </button>
          </div>
        </section>

        {/* Age Input */}
        <section className="mb-8">
          <label htmlFor="age" className="block text-lg font-medium text-gray-900 mb-2">
            Quel âge avez-vous ?
          </label>
          <div className="relative">
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="21"
              min="1"
              max="120"
              className="w-full px-4 py-3 text-lg text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
              <span className="text-gray-500">ans</span>
            </div>
          </div>
        </section>

        {/* Height Input */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="height" className="block text-lg font-medium text-gray-900">
              Combien mesurez-vous ?
            </label>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={toggleHeightUnit}
                className={`px-3 py-1 rounded-full text-sm ${formData.heightUnit === 'cm' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                cm
              </button>
              <button
                type="button"
                onClick={toggleHeightUnit}
                className={`px-3 py-1 rounded-full text-sm ${formData.heightUnit === 'ft' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                ft/in
              </button>
            </div>
          </div>
          
          {formData.heightUnit === 'cm' ? (
            <div className="relative">
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="170"
                min="1"
                max="300"
                className="w-full px-4 py-3 text-lg text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <span className="text-gray-500">cm</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="number"
                  name="heightFeet"
                  value={formData.height?.split('\'')[0] || ''}
                  onChange={(e) => {
                    const inches = formData.height?.split('\'')[1] || '0';
                    handleInputChange({
                      target: { 
                        name: 'height', 
                        value: `${e.target.value}'${inches}` 
                      }
                    });
                  }}
                  placeholder="5"
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 text-lg text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <span className="text-gray-500">ft</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="heightInches"
                  value={formData.height?.split('\'')[1] || ''}
                  onChange={(e) => {
                    const feet = formData.height?.split('\'')[0] || '0';
                    handleInputChange({
                      target: { 
                        name: 'height', 
                        value: `${feet}'${e.target.value}` 
                      }
                    });
                  }}
                  placeholder="7"
                  min="0"
                  max="11"
                  className="w-full px-4 py-3 text-lg text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <span className="text-gray-500">in</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Weight Input */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="weight" className="block text-lg font-medium text-gray-900">
              Combien pesez-vous ?
            </label>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={toggleWeightUnit}
                className={`px-3 py-1 rounded-full text-sm ${formData.weightUnit === 'kg' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                kg
              </button>
              <button
                type="button"
                onClick={toggleWeightUnit}
                className={`px-3 py-1 rounded-full text-sm ${formData.weightUnit === 'lb' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
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
              placeholder="69"
              min="1"
              max="500"
              step="0.1"
              className="w-full px-4 py-3 text-lg text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
              <span className="text-gray-500">{formData.weightUnit}</span>
            </div>
          </div>
        </section>

        {/* Activity Level */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Évaluez votre activité journalière
          </h2>
          <div className="space-y-3">
            {activityLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => handleInputChange({ target: { name: 'activityLevel', value: level.id } })}
                className={`w-full text-left p-4 rounded-xl border-2 ${
                  formData.activityLevel === level.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{level.icon}</span>
                  <div>
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-gray-500">{level.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Calculate Button */}
        <button
          onClick={calculateCalories}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg text-lg transition-colors mb-8"
        >
          Calculer mes besoins caloriques
        </button>

        {/* Résultats */}
        {result && (
          <div ref={resultsRef} className="bg-white rounded-xl shadow-md p-6 mt-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vos besoins caloriques</h2>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">Métabolisme de base (BMR)</h3>
                <p className="text-2xl font-bold text-green-600">{result.bmr} kcal</p>
                <p className="text-sm text-gray-500">Calories nécessaires au repos complet</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800">Maintien du poids</h3>
                <p className="text-2xl font-bold text-blue-600">{result.maintenance} kcal/jour</p>
                <p className="text-sm text-gray-500">Pour maintenir votre poids actuel</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800">Perte de poids</h3>
                <p className="text-2xl font-bold text-yellow-600">{result.weightLoss} kcal/jour</p>
                <p className="text-sm text-gray-500">Pour perdre environ 0.5 kg par semaine</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800">Prise de masse</h3>
                <p className="text-2xl font-bold text-purple-600">{result.weightGain} kcal/jour</p>
                <p className="text-sm text-gray-500">Pour prendre environ 0.5 kg par semaine</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Conseils :</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>Ces valeurs sont des estimations et peuvent varier selon votre métabolisme</li>
                <li>Pour des résultats optimaux, combinez alimentation équilibrée et activité physique</li>
                <li>Consultez un professionnel de santé avant de commencer un régime</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
