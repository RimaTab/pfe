import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const [showCalculatorMenu, setShowCalculatorMenu] = useState(false);
  const [showRecipesMenu, setShowRecipesMenu] = useState(false);
  const recettesMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);
  const calculatorMenuRef = useRef(null);

  // Fermer les menus lorsqu'on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target)) {
        setShowAboutMenu(false);
      }
      if (calculatorMenuRef.current && !calculatorMenuRef.current.contains(event.target)) {
        setShowCalculatorMenu(false);
      }
      if (recettesMenuRef.current && !recettesMenuRef.current.contains(event.target)) {
        setShowRecipesMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white px-6 py-4 shadow-md z-50 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-3xl font-bold text-rose-800">RASHAQA</Link>
        <div className="hidden md:flex space-x-7 text-sm text-gray-700">
          <Link href="/programme">Programme</Link>
          <Link href="/services">Services</Link>
          <div className="relative" ref={recettesMenuRef}>
            <button
              onClick={() => {
                setShowRecipesMenu(!showRecipesMenu);
                setShowAboutMenu(false);
                setShowCalculatorMenu(false);
              }}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              Recettes <ChevronDown size={16} className="ml-1" />
            </button>
            {showRecipesMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <div className="py-1">
                  <Link href="/recettes" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Toutes les recettes
                  </Link>
                  <Link href="/menu-plaisir" className="block px-4 py-2 text-green-600 hover:bg-gray-100 font-medium">
                    Menus Plaisir
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex space-x-4 items-center">
        <Link href="/conseil-ia" className="flex items-center text-gray-700 hover:text-green-700 px-3 py-2 rounded-md">
          <MessageSquare className="mr-1" size={18} /> Conseil IA
        </Link>
        <div className="relative" ref={aboutMenuRef}>
          <button
            onClick={() => {
              setShowAboutMenu(!showAboutMenu);
              setShowCalculatorMenu(false);
            }}
            className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
          >
            À propos de Rashaqa <ChevronDown size={16} className="ml-1" />
          </button>

          {showAboutMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
              <div className="py-1">
                <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  À propos de nous
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={calculatorMenuRef}>
          <button
            onClick={() => {
              setShowCalculatorMenu(!showCalculatorMenu);
              setShowAboutMenu(false);
            }}
            className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
          >
            Calculatrices <ChevronDown size={16} className="ml-1" />
          </button>

          {showCalculatorMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
              <div className="py-1">
                <Link href="/imc" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Calcul IMC
                </Link>
                <Link href="/poids-ideal" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Calcul poids idéal
                </Link>
                <Link href="/calories-journalieres" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Calcul des calories journalières
                </Link>
                <Link href="/calories-brulees" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Calcul des calories brûlées
                </Link>
                <Link href="#" className="block px-4 py-2 text-gray-500 cursor-not-allowed" onClick={(e) => e.preventDefault()}>
                  Calcul calories protéines (bientôt)
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link href="/signup" className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">S'inscrire</Link>
        <Link href="/login" className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">Se connecter</Link>
      </div>

      <button className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-white p-4 shadow-md z-50 flex flex-col space-y-4 md:hidden">
          <Link href="/conseil-ia" className="flex items-center py-2">
            <MessageSquare className="mr-2" size={18} /> Conseil IA
          </Link>
          <Link href="/programme">Programme</Link>
          <Link href="/services">Services</Link>
          <Link href="/conseils">Conseils</Link>
          <div className="border-t pt-2">
            <button
              onClick={() => setShowRecipesMenu(!showRecipesMenu)}
              className="flex items-center justify-between w-full py-2"
            >
              <span>Recettes</span>
              <ChevronDown size={16} className={`transition-transform ${showRecipesMenu ? 'transform rotate-180' : ''}`} />
            </button>
            {showRecipesMenu && (
              <div className="pl-4 mt-2 flex flex-col space-y-2">
                <Link href="/recettes">Toutes les recettes</Link>
                <Link href="/menu-plaisir" className="text-green-600 font-medium">Menus Plaisir</Link>
              </div>
            )}
          </div>

          <div className="border-t pt-2">
            <button
              onClick={() => setShowAboutMenu(!showAboutMenu)}
              className="flex items-center justify-between w-full py-2"
            >
              <span>À propos de Rashaqa</span>
              <ChevronDown size={16} />
            </button>

            {showAboutMenu && (
              <div className="pl-4 mt-2 flex flex-col space-y-2">
                <Link href="/about">À propos de nous</Link>
              </div>
            )}
          </div>

          <div className="border-t pt-2">
            <button
              onClick={() => setShowCalculatorMenu(!showCalculatorMenu)}
              className="flex items-center justify-between w-full py-2"
            >
              <span>Calculatrices</span>
              <ChevronDown size={16} />
            </button>

            {showCalculatorMenu && (
              <div className="pl-4 mt-2 flex flex-col space-y-2">
                <Link href="/imc">Calcul IMC</Link>
                <Link href="/poids-ideal">Calcul poids idéal</Link>
                <Link href="/calories-journalieres" className="text-gray-700">Calcul des calories journalières</Link>
                <Link href="/calories-brulees" className="text-gray-700">Calcul des calories brûlées</Link>
                <span className="text-gray-500">Calcul calories protéines (bientôt)</span>
              </div>
            )}
          </div>

          <Link href="/signup" className="bg-red-500 text-white px-4 py-2 rounded-full text-center">S'inscrire</Link>
          <Link href="/login" className="bg-red-500 text-white px-4 py-2 rounded-full text-center">Se connecter</Link>
        </div>
      )}
    </nav>
  );
}
