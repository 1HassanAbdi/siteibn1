import React from 'react';
import planData from './plan_oqre.json';

const ParentDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen font-sans">
      <header className="mb-8 border-b pb-6 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900">{planData.titre}</h1>
        <p className="text-blue-600 font-medium mt-2">{planData.eleve}</p>
      </header>

      {/* SECTION TERMINÉE */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-green-700 flex items-center mb-4">
          <span className="bg-green-100 p-2 rounded-full mr-3">✅</span>
          PARTIES TERMINÉES
        </h2>
        <div className="space-y-3">
          {planData.parties_terminees.map((item, index) => (
            <div key={index} className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-green-900">{item.domaine}</p>
                  <p className="text-sm text-green-800 italic">{item.sujets}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-green-600">LIVRE: P. {item.pages_livre}</p>
                   <p className="text-xs font-mono bg-white px-2 py-1 rounded mt-1 border border-green-200">IXL: {item.ixl}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALENDRIER HEBDOMADAIRE */}
      <section>
        <h2 className="text-xl font-bold text-blue-800 flex items-center mb-6">
          <span className="bg-blue-100 p-2 rounded-full mr-3">📅</span>
          PLANNING PAR SEMAINE
        </h2>
        <div className="grid gap-6">
          {planData.calendrier.map((semaine, index) => (
            <div key={index} className={`relative p-5 rounded-2xl border transition-all ${semaine.statut === 'En cours' ? 'border-blue-500 shadow-md bg-blue-50' : 'border-gray-200 bg-white'}`}>
              
              {semaine.statut === 'En cours' && (
                <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Semaine Actuelle
                </div>
              )}

              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <span className="text-lg font-bold text-blue-700">{semaine.dates}</span>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <span className="text-xs font-bold bg-white border border-blue-200 px-3 py-1 rounded-lg text-blue-800">
                    📖 LIVRE: Pages {semaine.pages_livre}
                  </span>
                  <span className="text-xs font-bold bg-blue-900 px-3 py-1 rounded-lg text-white font-mono">
                    IXL: {semaine.ixl}
                  </span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-blue-100">
                <h3 className="font-extrabold text-gray-900 mb-1">{semaine.domaine}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-bold text-gray-800">Objectif:</span> {semaine.attente}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t text-center text-gray-400 text-sm">
        Planification conforme aux exigences du Ministère de l'Éducation de l'Ontario (2020)
      </footer>
    </div>
  );
};

export default ParentDashboard;