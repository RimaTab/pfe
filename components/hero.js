import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
<section className="h-screen bg-white flex items-center justify-center px-6">    
      <div className="max-w-xl space-y-6">
        <h1 className="text-6xl font-bold text-gray-800">Bienvenue Dans Une Vie Plus Saine.</h1>
        <ul className="text-lg text-gray-700 space-y-4">
          <li><input type="checkbox" checked readOnly className="mr-2" />Perdre du poids</li>
          <li><input type="checkbox" checked readOnly className="mr-2" />Prendre du muscle</li>
          <li><input type="checkbox" checked readOnly className="mr-2" />Manger plus sainement</li>
        </ul>
        <Link href="/quiz">
          <button className="bg-rose-500 hover:bg-rose-500 text-white font-semibold px-6 py-2 rounded-full shadow">
            FAITES LE QUIZ  →
          </button>
        </Link>
      </div>

      {/* Image à droite */}
      <div className="mt-10 md:mt-0">
        <img
        src="menu.webp"
        alt="Plat sain"
        width="400"
        height="350"
        className="rounded-lg"
        />
      </div>
    </section>
  );
}