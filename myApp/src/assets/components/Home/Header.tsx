import { useState } from "react";
import { Link, Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-2xl font-bold text-blue-600">
            🎓 Campus Scolaire
          </div>

          <div className="hidden md:flex space-x-6">
            <Link to='/'>
            </Link>
            <a href="#" className="text-gray-700 hover:text-blue-600">Accueil</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Cours</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Résultats</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4">
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Accueil</a>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Cours</a>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Résultats</a>
          <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Header;
