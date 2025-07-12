import React, { useState } from 'react';
import Head from 'next/head';

export default function PoidsIdeal() {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    heightUnit: 'cm',
  });
  const [idealWeight, setIdealWeight] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!formData.gender) {
      setError('Veuillez sélectionner votre genre');
      return false;
    }
    if (!formData.age || formData.age <= 0) {
      setError('Veuillez entrer un âge valide (supérieur à 0)');
      return false;
    }
    if (!formData.height || formData.height <= 0) {
      setError('Veuillez entrer une taille valide');
      return false;
    }
    setError('');
    return true;
  };

  const calculateIdealWeight = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call or calculation
    setTimeout(() => {
      try {
        let heightInCm = formData.height;
        
        // Convert height to cm if it's in feet
        if (formData.heightUnit === 'ft') {
          // Convert feet and inches to cm
          const [feet, inches] = formData.height.split('\'');
          heightInCm = (parseInt(feet) * 30.48) + (parseInt(inches || 0) * 2.54);
        }
        
        // Simple ideal weight calculation (Lorentz formula)
        // For men: (height in cm - 100) - ((height in cm - 150)/4)
        // For women: (height in cm - 100) - ((height in cm - 150)/2.5)
        let weight;
        if (formData.gender === 'male') {
          weight = (heightInCm - 100) - ((heightInCm - 150) / 4);
        } else {
          weight = (heightInCm - 100) - ((heightInCm - 150) / 2.5);
        }
        
        setIdealWeight(weight.toFixed(1));
        setError('');
      } catch (err) {
        setError('Une erreur est survenue lors du calcul');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

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
      height: '' // Reset height when changing units
    }));
  };

  const resetForm = () => {
    setFormData({
      gender: '',
      age: '',
      height: '',
      heightUnit: 'cm',
    });
    setIdealWeight(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Calcul du Poids Idéal | RASHAQA</title>
        <meta name="description" content="Calculez votre poids idéal en fonction de votre taille, âge et sexe" />
      </Head>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calcul poids idéal</h1>
            <p className="text-gray-600">
              Pour calculer votre poids idéal, nous avons besoin de quelques informations de base.
            </p>
          </div>

          {/* Gender Selection */}
          <div className="mb-6 bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-medium text-gray-900 mb-4">À quel genre appartenez-vous ?</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange({ target: { name: 'gender', value: 'male' } })}
                className={`flex items-center justify-center p-4 rounded-lg border-2 ${
                  formData.gender === 'male' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">👨</span>
                  </div>
                  <span className="text-gray-700 font-medium">Un homme</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange({ target: { name: 'gender', value: 'female' } })}
                className={`flex items-center justify-center p-4 rounded-lg border-2 ${
                  formData.gender === 'female' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">👩</span>
                  </div>
                  <span className="text-gray-700 font-medium">Une femme</span>
                </div>
              </button>
            </div>
          </div>

          {/* Age Input */}
          <div className="mb-6 bg-gray-50 p-6 rounded-xl">
            <label htmlFor="age" className="block text-lg font-medium text-gray-900 mb-4">
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
          </div>

          {/* Height Input */}
          <div className="mb-8 bg-gray-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="height" className="block text-lg font-medium text-gray-900">
                Combien mesurez-vous ?
              </label>
              <button
                type="button"
                onClick={toggleHeightUnit}
                className="text-sm font-medium text-green-600 hover:text-green-700 focus:outline-none"
              >
                {formData.heightUnit === 'cm' ? 'Afficher en pieds/pouces' : 'Afficher en cm'}
              </button>
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
                    name="height"
                    value={formData.height ? formData.height.split("'")[0] || '' : ''}
                    onChange={(e) => {
                      const inches = formData.height.split("'");
                      setFormData(prev => ({
                        ...prev,
                        height: `${e.target.value}'${inches[1] || '0'}`
                      }));
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
                    value={formData.height ? formData.height.split("'")[1] || '' : ''}
                    onChange={(e) => {
                      const feet = formData.height ? formData.height.split("'")[0] || '0' : '0';
                      setFormData(prev => ({
                        ...prev,
                        height: `${feet}'${e.target.value}`
                      }));
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Result */}
          {idealWeight && (
            <div className="mb-6 p-6 bg-green-50 rounded-xl text-center">
              <h3 className="text-lg font-medium text-green-800 mb-2">Votre poids idéal est d'environ</h3>
              <p className="text-3xl font-bold text-green-600">{idealWeight} kg</p>
              <p className="text-sm text-gray-600 mt-2">
                Ceci est une estimation basée sur la formule de Lorentz
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={calculateIdealWeight}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calcul en cours...
                </>
              ) : (
                'Calculer votre poids idéal'
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
