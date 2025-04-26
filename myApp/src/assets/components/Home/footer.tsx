
const Footer = () => {
  return (
    <footer className="bg-zinc-600 text-white ">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-lg mb-3">Campus Scolaire</h4>
          <p className="text-sm">Plateforme numérique pour la gestion scolaire : cours, emplois du temps, résultats et plus.</p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Liens utiles</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Accueil</a></li>
            <li><a href="#" className="hover:underline">Cours</a></li>
            <li><a href="#" className="hover:underline">Résultats</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Contact</h4>
          <p className="text-sm">📍 123 Campus, Ville Universitaire<br />
          📧 contact@campusscolaire.com<br />
          📞 +33 1 23 45 67 89</p>
        </div>
      </div>

      <div className="bg-blue-700 text-center text-sm py-4">
        &copy; {new Date().getFullYear()} Campus Scolaire. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
