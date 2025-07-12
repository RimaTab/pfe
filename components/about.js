
export default function About() {
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-6">À propos de nous</h2>
          <p className="text-gray-700 leading-relaxed">
            Rashaqua est une appli créée avec soin par une équipe motivée et enthousiaste, convaincue du fait qu’un
            changement alimentaire sain peut littéralement transformer la vie de ses utilisateurs. Grâce à Rashaqua, 
            nous aidons les gens à vivre plus sainement par la biais de la nutrition.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src="1.jpg"
            alt="Salade"
            className="rounded-xl shadow-lg w-full max-w-sm"
          />
        </div>
      </div>
    </section>
  );
}
