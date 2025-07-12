
export default function Features() {
  const features = [
    {
      title: "Compteur de calories",
      desc: "Profitez du compteur de calories le plus rapide et pratique que vous ayez jamais téléchargé.",
      image: "3.png",
    },
    {
      title: "Recettes personnalisées",
      desc: "Accédez à plus de 2 500 recettes adaptées à vos préférences personnelles.",
      image: "4.png",
    },
    {
      title: "Suivi automatique",
      desc: "Connectez votre fitness tracker pour enregistrer automatiquement vos activités et repas.",
      image: "2.png",
    },
  ];

  return (
    <section className="bg-white py-16 px-6 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-12">
        Découvrez RASHAQA
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-45 h-45 object-contain mx-auto "
            />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
