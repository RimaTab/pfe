
export default function Plans() {
  return (
    <section className="bg-gray-50 py-16 px-6 text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Nos Programmes</h2>
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        {/* Perte de poids */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-[#7A1723] mb-4">Perte de poids</h3>
          <p className="text-gray-700 mb-6">
            Un programme adapté pour brûler les graisses et retrouver une silhouette affinée.
          </p>
          <button className="bg-[#7A1723] text-white font-semibold px-6 py-3 rounded hover:bg-[#9E1F2F] transition">
            Découvrir
          </button>
        </div>

        {/* Prise de muscle */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-[#7A1723] mb-4">Prise de muscle</h3>
          <p className="text-gray-700 mb-6">
            Un plan personnalisé pour développer votre masse musculaire efficacement.
          </p>
          <button className="bg-[#7A1723] text-white font-semibold px-6 py-3 rounded hover:bg-[#9E1F2F] transition">
            Découvrir
          </button>
        </div>
      </div>
    </section>
  );
}
