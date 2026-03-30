export default function TakaApp() {
  const [page, setPage] = useState("menu");
  const [mode, setMode] = useState(""); // "etudier" ou "entrainement"
  const [verbeSel, setVerbeSel] = useState(null);

  return (
    <>
      {page === "menu" && <Menu onNavigate={(m) => { setMode(m); setPage("selection"); }} />}
      
      {page === "selection" && (
        <SelectionVerbe 
          listesVerbes={listesVerbes} 
          onChoisir={(v, g) => { 
            setVerbeSel({n: v, g: g, conj: genererToutesConjugaisons(v, g)}); 
            setPage(mode === "etudier" ? "etudier" : "selectionTemps"); 
          }} 
        />
      )}

      {page === "etudier" && (
        <ModeEtudier verbeNom={verbeSel.n} conjugaisons={verbeSel.conj} onBack={() => setPage("menu")} />
      )}

      {page === "selectionTemps" && (
        <SelectionTemps 
          tempsDisponibles={Object.keys(verbeSel.conj)} 
          onContinuer={(selection) => setPage("quiz")} 
          onBack={() => setPage("menu")} 
        />
      )}
    </>
  );
}