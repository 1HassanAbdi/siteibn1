// --- À ajouter dans ton fichier App.js ---

if (page === "bilan") {
  const { bilan, score } = resultatsDetaillés;
  const pourcentage = Math.round((score / 6) * 100);

  return (
    <div className="min-h-screen bg-[#d9e8b5] flex flex-col font-sans">
      {/* Header Resultat */}
      <div className="bg-[#7db9c2] p-6 text-white flex justify-between items-center shadow-lg">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Bilan : {verbeSel.n}</h2>
        <div className="bg-white text-[#2d5a61] px-6 py-2 rounded-full text-3xl font-black">
          {score} / 6
        </div>
      </div>

      <div className="flex-1 bg-white mx-4 mt-2 rounded-t-3xl p-8 shadow-inner">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-center text-3xl font-bold text-gray-700 mb-6">
            {pourcentage === 100 ? "🌟 Parfait ! Tu es un champion !" : "Continue tes efforts !"}
          </h3>

          {/* Table des résultats */}
          <div className="border-2 border-blue-100 rounded-2xl overflow-hidden">
            <table className="w-full text-2xl">
              <thead className="bg-blue-50 text-blue-800">
                <tr>
                  <th className="p-4 text-left">Pronom</th>
                  <th className="p-4 text-left">Ta réponse</th>
                  <th className="p-4 text-left">Correction</th>
                </tr>
              </thead>
              <tbody>
                {bilan.map((ligne, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="p-4 font-medium text-gray-400">{ligne.pronom}</td>
                    <td className={`p-4 font-bold ${ligne.estCorrect ? 'text-green-500' : 'text-red-500 line-through'}`}>
                      {ligne.saisie || "---"}
                    </td>
                    <td className="p-4 font-bold text-blue-600">
                      {ligne.estCorrect ? "✅" : ligne.solution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Graphique de progression simple */}
          <div className="mt-8 bg-gray-100 h-8 rounded-full overflow-hidden border-2 border-gray-200">
            <div 
              className={`h-full transition-all duration-1000 ${pourcentage > 50 ? 'bg-green-500' : 'bg-orange-500'}`} 
              style={{ width: `${pourcentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-[#0099cc] p-6 flex justify-around text-white font-bold text-2xl">
        <button 
          onClick={() => { setPage("selection"); setReponses(Array(6).fill("")); }} 
          className="flex items-center gap-2 hover:scale-110 transition"
        >
          <Home /> Autre verbe
        </button>
        <button 
          onClick={() => { setPage("quiz"); setReponses(Array(6).fill("")); }} 
          className="bg-yellow-400 text-blue-900 px-8 py-2 rounded-full hover:bg-yellow-300 shadow-md"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}