import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Check, X, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Quiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize selected option from answers if it exists
  useEffect(() => {
    if (answers[currentQuestion] !== undefined) {
      setSelectedOption(answers[currentQuestion]);
    } else {
      setSelectedOption(questions[currentQuestion].type === 'number' ? '' : null);
    }
  }, [currentQuestion, answers]);

  const questions = [
    {
      id: 'objective',
      type: 'objective',
      question: "Quel est votre objectif principal ?",
      options: [
        "Perdre du poids",
        "Prendre du muscle",
        "Être en meilleure santé",
        "Améliorer mes performances sportives",
        "Maintenir mon poids actuel"
      ],
      description: "Choisissez l'objectif qui vous correspond le mieux"
    },
    {
      id: 'gender',
      type: 'gender',
      question: "Quel est votre sexe ?",
      options: ["Homme", "Femme", "Autre"],
      description: "Cette information nous aide à personnaliser vos recommandations"
    },
    {
      id: 'age',
      type: 'number',
      inputType: 'number',
      question: "Quel est votre âge ?",
      placeholder: "30",
      min: 1,
      max: 120,
      description: "Votre âge nous aide à calculer vos besoins nutritionnels"
    },
    {
      id: 'height',
      type: 'number',
      inputType: 'number',
      question: "Quelle est votre taille ?",
      placeholder: "175",
      min: 100,
      max: 250,
      unit: 'cm',
      description: "Votre taille en centimètres"
    },
    {
      id: 'weight',
      type: 'number',
      inputType: 'number',
      question: "Quel est votre poids actuel ?",
      placeholder: "70",
      min: 30,
      max: 300,
      unit: 'kg',
      description: "Votre poids actuel en kilogrammes"
    },
    {
      id: 'activity',
      type: 'activity',
      question: "Quel est votre niveau d'activité physique ?",
      options: [
        "Sédentaire (peu ou pas d'exercice)",
        "Légèrement actif (1-3 jours/semaine)",
        "Modérément actif (3-5 jours/semaine)",
        "Très actif (6-7 jours/semaine)",
        "Extrêmement actif (sportif professionnel ou travail physique)"
      ],
      description: "Sélectionnez le niveau qui correspond le mieux à votre routine"
    },
    {
      id: 'dietary_restrictions',
      type: 'multiple',
      question: "Avez-vous des restrictions alimentaires ?",
      options: [
        "Végétarien",
        "Végétalien",
        "Sans gluten",
        "Sans lactose",
        "Sans œufs",
        "Sans arachides",
        "Sans fruits de mer",
        "Aucune de ces réponses"
      ],
      description: "Sélectionnez toutes les options qui s'appliquent",
      multiple: true
    },
    {
      id: 'meals_per_day',
      type: 'number',
      inputType: 'number',
      question: "Combien de repas par jour préférez-vous ?",
      placeholder: "3",
      min: 1,
      max: 8,
      description: "Nombre de repas que vous prenez habituellement chaque jour"
    },
    {
      id: 'cooking_skills',
      type: 'cooking',
      question: "Comment décririez-vous vos compétences en cuisine ?",
      options: [
        "Débutant (je cuisine rarement)",
        "Intermédiaire (je cuisine des plats simples)",
        "Avancé (je suis à l'aise en cuisine)",
        "Expert (je maîtrise les techniques complexes)"
      ],
      description: "Cela nous aide à adapter la complexité des recettes"
    },
    {
      id: 'allergies',
      type: 'text',
      question: "Avez-vous des allergies alimentaires ?",
      placeholder: "Ex: Fruits à coque, crustacés, etc.",
      description: "Listez vos allergies séparées par des virgules",
      optional: true
    }
  ];

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Pre-fill the previous question's answer if it exists
      setSelectedOption(answers[currentQuestion - 1] !== undefined ? answers[currentQuestion - 1] : null);
    }
  };

  const handleNext = async () => {
    // Sauvegarder la réponse actuelle
    const updatedAnswers = {
      ...answers,
      [currentQuestion]: selectedOption
    };
    setAnswers(updatedAnswers);

    // Passer à la question suivante ou rediriger
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Pré-remplir la réponse de la question suivante si elle existe
      setSelectedOption(answers[currentQuestion + 1] !== undefined ? answers[currentQuestion + 1] : null);
    } else {
      // Dernière question atteinte
      try {
        setIsSubmitting(true);
        // Créer un objet avec toutes les réponses
        const formData = {
          ...updatedAnswers,
          [currentQuestion]: selectedOption
        };
        
        // Vérifier si l'utilisateur est déjà connecté
        const userData = localStorage.getItem('userData');
        
        if (userData) {
          // Si l'utilisateur est connecté, mettre à jour son profil avec les réponses
          const user = JSON.parse(userData);
          const updatedUser = {
            ...user,
            quizCompleted: true,
            quizAnswers: formData,
            profileCompleted: true
          };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          
          // Rediriger vers le profil
          router.push('/profile');
        } else {
          // Sinon, rediriger vers l'inscription
          localStorage.setItem('quizAnswers', JSON.stringify(formData));
          router.push('/signup?fromQuiz=true');
        }
      } catch (error) {
        console.error('Erreur lors de la redirection:', error);
        setError('Une erreur est survenue. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswers({});
    setShowResult(false);
    setError('');
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Résultats du Quiz</h1>
          <div className="text-5xl font-bold text-green-600 mb-6">
            {score} / {questions.length}
          </div>
          <p className="text-gray-600 mb-8">
            {score === questions.length 
              ? 'Félicitations ! Vous avez répondu correctement à toutes les questions !' 
              : score > questions.length / 2 
                ? 'Bon travail ! Vous avez une bonne connaissance de la nutrition.'
                : 'Continuez à apprendre ! Vous pouvez faire mieux la prochaine fois.'}
          </p>
          <button
            onClick={restartQuiz}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
          >
            Recommencer le quiz
          </button>
        </div>
      </div>
    );
  }

  const calculateResults = () => {
    // Récupération des réponses
    const weight = parseFloat(answers[2] || 0); // Poids (question 3)
    const height = parseFloat(answers[3] || 170) / 100; // Taille en mètres (question 4)
    const age = parseInt(answers[1] || 30); // Âge (question 2)
    const gender = questions[1].options[answers[1]] || 'Homme';
    const activityLevel = answers[4] || 2; // Niveau d'activité (question 5)
    
    // Calcul de l'IMC
    const bmi = weight / (height * height);
    
    // Calcul du métabolisme de base (BMR) avec la formule de Mifflin-St Jeor
    let bmr;
    if (gender === 'Femme') {
      bmr = 10 * weight + 6.25 * (height * 100) - 5 * age - 161;
    } else {
      bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5;
    }
    
    // Facteur d'activité physique
    const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const activityMultiplier = activityMultipliers[activityLevel] || 1.55;
    
    // Dépense énergétique journalière (TDEE)
    const tdee = Math.round(bmr * activityMultiplier);
    
    // Objectif calorique basé sur l'objectif
    let goalCalories = tdee;
    let goalDescription = "Maintien du poids";
    
    if (answers[0] === 0) { // Perte de poids
      goalCalories = Math.round(tdee * 0.85); // -15% pour la perte de poids
      goalDescription = "Perte de poids progressive";
    } else if (answers[0] === 1) { // Prise de muscle
      goalCalories = Math.round(tdee * 1.1); // +10% pour la prise de muscle
      goalDescription = "Prise de masse musculaire";
    } else if (answers[0] === 2 || answers[0] === 3) { // Santé ou performance
      goalCalories = tdee;
      goalDescription = "Maintien et performance";
    }
    
    // Besoin en protéines (1.6-2.2g/kg pour la musculation, 0.8-1g/kg pour sédentaire)
    const proteinPerKg = activityLevel >= 2 ? 1.8 : 1.2;
    const proteinGrams = Math.round(weight * proteinPerKg);
    
    // Besoin en eau (35ml/kg de poids corporel)
    const waterIntake = Math.round(weight * 35);
    
    return {
      bmi: bmi.toFixed(1),
      goalCalories,
      goalDescription,
      proteinGrams,
      waterIntake,
      bmr: Math.round(bmr)
    };
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    if (['objective', 'activity', 'gender', 'cooking', 'multiple'].includes(question.type)) {
      return (
        <div className="space-y-4 mb-8">
          {question.description && (
            <p className="text-gray-500 text-center mb-6">{question.description}</p>
          )}
          {question.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedOption === index 
                  ? 'border-green-500 bg-green-50 shadow-sm' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 transition-colors ${
                  selectedOption === index 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedOption === index && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-gray-800">{option}</span>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (question.type === 'text') {
      return (
        <div className="mb-8">
          {question.description && (
            <p className="text-gray-500 text-center mb-6">{question.description}</p>
          )}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={selectedOption || ''}
              onChange={(e) => handleOptionSelect(e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-white text-black"
              placeholder={question.placeholder || 'Votre réponse...'}
            />
          </div>
        </div>
      );
    } else if (question.inputType === 'number' || question.type === 'number') {
      return (
        <div className="mb-8">
          {question.description && (
            <p className="text-gray-500 text-center mb-6">{question.description}</p>
          )}
          <div className="relative max-w-xs mx-auto">
            <input
              type="number"
              value={selectedOption || ''}
              onChange={(e) => handleOptionSelect(e.target.value)}
              className="w-full p-4 text-3xl text-center border-b-2 border-gray-300 focus:border-green-500 outline-none bg-transparent text-black"
              placeholder={question.placeholder}
              min={question.min}
              max={question.max}
              step={question.type === 'age' ? '1' : '0.1'}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
              {question.unit || ''}
            </span>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>{question.min}+</span>
            <span>max {question.max}</span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderResults = () => {
    const results = calculateResults();
    const objective = questions[0].options[answers[0]] || "Votre objectif";
    const activity = questions[4].options[answers[4]] || "Votre niveau d'activité";
    
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Votre plan personnalisé</h1>
            <p className="text-gray-600">Basé sur vos réponses, voici nos recommandations</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Profil complet</h2>
                <p className="text-gray-600">
                  Voici vos recommandations personnalisées
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Vos objectifs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Objectif principal</p>
                      <p className="font-medium">{objective}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Niveau d'activité</p>
                      <p className="font-medium">{activity}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Vos besoins nutritionnels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <p className="text-sm text-gray-500">Calories quotidiennes</p>
                      <p className="text-2xl font-bold text-blue-600">{results.goalCalories}</p>
                      <p className="text-xs text-gray-500">{results.goalDescription}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <p className="text-sm text-gray-500">Protéines (quotidien)</p>
                      <p className="text-2xl font-bold text-blue-600">{results.proteinGrams}g</p>
                      <p className="text-xs text-gray-500">Recommandé pour votre poids</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <p className="text-sm text-gray-500">Eau (quotidien)</p>
                      <p className="text-2xl font-bold text-blue-600">{results.waterIntake}ml</p>
                      <p className="text-xs text-gray-500">Soit {Math.round(results.waterIntake / 250)} verres</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Votre IMC</h3>
                  <div className="text-center">
                    <div className="inline-flex items-baseline">
                      <span className="text-4xl font-bold text-yellow-600">{results.bmi}</span>
                      <span className="ml-2 text-gray-500">kg/m²</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {results.bmi < 18.5 ? 'Poids insuffisant' : 
                       results.bmi < 25 ? 'Poids normal' :
                       results.bmi < 30 ? 'Surpoids' : 'Obésité'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors flex items-center mx-auto"
                >
                  Commencer mon parcours
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                
                <button
                  onClick={restartQuiz}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center mx-auto"
                >
                  <ArrowLeft className="mr-1 w-4 h-4" />
                  Modifier mes réponses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showResult) {
    return renderResults();
  }

  // Show loading state if submitting
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Création de votre plan personnalisé...</p>
        </div>
      </div>
    );
  }

  // Render the quiz UI
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Profil | RASHAQA</title>
        <meta name="description" content="Créez votre profil personnalisé" />
      </Head>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Étape {currentQuestion + 1} sur {questions.length}</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {questions[currentQuestion].question}
            </h2>

            {renderQuestion()}
            
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">
                {error}
              </div>
            )}

            <div className="flex justify-between items-center mt-10">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-full font-medium ${
                  currentQuestion > 0 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                ← Précédent
              </button>
              
              <button
                onClick={handleNext}
                disabled={isSubmitting || selectedOption === null || selectedOption === ''}
                className={`px-6 py-3 rounded-full font-medium flex items-center ${
                  !isSubmitting && selectedOption !== null && selectedOption !== ''
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } transition-colors`}
              >
                {isSubmitting ? (
                  'Chargement...'
                ) : currentQuestion === questions.length - 1 ? (
                  'Voir mes résultats'
                ) : (
                  'Suivant'
                )}
                {!isSubmitting && currentQuestion < questions.length - 1 && (
                  <ChevronRight className="ml-1 w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

