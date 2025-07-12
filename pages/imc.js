import React, { useState } from 'react';

export default function IMC() {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
  });
  const [imcResult, setImcResult] = useState(null);
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
      setError('Veuillez entrer une taille valide (en cm, supérieure à 0)');
      return false;
    }
    if (!formData.weight || formData.weight <= 0) {
      setError('Veuillez entrer un poids valide (en kg, supérieur à 0)');
      return false;
    }
    setError('');
    return true;
  };

  const calculateIMC = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const heightM = formData.height / 100;
      const imc = (formData.weight / (heightM * heightM)).toFixed(1);
      setImcResult(imc);
      setIsLoading(false);
    }, 500); // Simulate loading time
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      gender: '',
      age: '',
      height: '',
      weight: ''
    });
    setImcResult(null);
    setError('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4" dangerouslySetInnerHTML={{
        __html: '<font style="vertical-align: inherit;">Calcul IMC</font>'
      }} />
      <p className="text-center text-gray-600 mb-6">
        Pour effectuer un calcul exact, nous avons besoin de quelques infos basiques de votre part.
      </p>

      <div className="grid grid-cols-2 gap-6 border-2 p-4 rounded-lg border-[var(--success)]">
        <div>
          <h3 className="font-medium mb-2 text-gray-600">À quel genre appartenez-vous ?</h3>
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded ${formData.gender === 'homme' ? 'bg-[var(--success)] text-white' : 'bg-gray-200'}`}
              onClick={() => setFormData(prev => ({ ...prev, gender: 'homme' }))}
            >
              Un homme
            </button>
            <button 
              className={`px-4 py-2 rounded ${formData.gender === 'femme' ? 'bg-[var(--success)] text-white' : 'bg-gray-200'}`}
              onClick={() => setFormData(prev => ({ ...prev, gender: 'femme' }))}
            >
              Une femme
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2 text-gray-600">Quel âge avez-vous ?</h3>
          <input 
            type="number" 
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="21 ans" 
            className="w-full p-2 border rounded border-gray-300"
          />
        </div>

        <div>
          <h3 className="font-medium mb-2 text-gray-600">Combien mesurez-vous ?</h3>
          <input 
            type="number" 
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="170" 
            className="w-full p-2 border rounded border-gray-300"
          />
          <div className="mt-1 text-gray-600">cm</div>
        </div>

        <div>
          <h3 className="font-medium mb-2 text-gray-600">Combien pesez-vous ?</h3>
          <input 
            type="number" 
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="69" 
            className="w-full p-2 border rounded border-gray-300"
          />
          <div className="mt-1 text-gray-600">kg</div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--success)]"></div>
        </div>
      )}

      {imcResult && (
        <div className="bg-[var(--success)]/5 p-4 rounded-lg mt-6">
          <h3 className="font-medium text-[var(--success)] mb-2">Votre IMC est {imcResult}</h3>
          <p className="text-gray-600">
            {imcResult < 18.5 && 'Catégorie: Maigreur'}
            {imcResult >= 18.5 && imcResult < 25 && 'Catégorie: Poids normal'}
            {imcResult >= 25 && imcResult < 30 && 'Catégorie: Surpoids'}
            {imcResult >= 30 && 'Catégorie: Obésité'}
          </p>
        </div>
      )}

      {imcResult && (
        <div className="bg-green-50 p-4 rounded-lg mt-6">
          <h3 className="font-medium text-green-700 mb-2">Votre IMC est {imcResult}</h3>
          <p className="text-gray-600">
            {imcResult < 18.5 && 'Catégorie: Maigreur'}
            {imcResult >= 18.5 && imcResult < 25 && 'Catégorie: Poids normal'}
            {imcResult >= 25 && imcResult < 30 && 'Catégorie: Surpoids'}
            {imcResult >= 30 && 'Catégorie: Obésité'}
          </p>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button 
          onClick={calculateIMC}
          className="bg-[var(--success)] text-white px-6 py-2 rounded-full hover:bg-[var(--success)]/90 transition-colors"
        >
          Calculer votre IMC
        </button>
        <button 
          onClick={resetForm}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
