import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./HeaderFooter/header1";
import Footer from "./HeaderFooter/footer";
import "./App.css";
import Accueil from "./Acueil_Activite/Accueil";
import DictationApp1 from "./Dictee/dictationApp";
import Activite from "./Acueil_Activite/Activites";
import YearlyNavigator5e from "./5eAnnee/francais/texteCompreh/WeeklyNavigator5";
import YearlyNavigator from "./3eAnnee/francais/texteCompreh/WeeklyNavigator";
import PiqueNiqueApp from "./tex";
import DictationAppcka from "./DicteeCka/dictationApp";
import MultiplicationChallengeOK from "./maths/concourMathsOK";
import EvaluationGame from "./Dictee/EvaluationGame";
import Exercice63 from "./EXR_6_3/exercice";




function App() {
  
  return (
    <div className="App">
      <Router>
        <Header />      
          <Routes>
            <Route path="/" element={<Accueil></Accueil>} />
            <Route path="/test" element={<PiqueNiqueApp></PiqueNiqueApp>} />
            <Route path="/Multiplication" element={<MultiplicationChallengeOK></MultiplicationChallengeOK>} />
                    {/* Page des activités pour chaque année */}

         <Route path="/Concours3" element={<DictationApp1></DictationApp1>} />
         <Route path="/Concours2" element={<DictationAppcka></DictationAppcka>} />
         <Route path="/activites/:annee" element={<Activite></Activite> } />


          <Route path="/activites/51e Année/Francais" element={<YearlyNavigator5e />} />
          <Route path="/activites/31e Année/Francais" element={<YearlyNavigator />} />
          <Route path="/activites/3e Année/Francais" element={<EvaluationGame />} />
          <Route path="/activites/6e Année/Francais" element={<Exercice63></Exercice63>} />
            
           
            
            
            

            

           


         

          </Routes>
       

        <Footer />
      </Router>
    </div>
  );
}

export default App;
