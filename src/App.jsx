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
import AppSyllabes from "./1eAnnee/AppSyllabes";
import MathExerciseApp from "./6eAnnee/ex";
import MathEvaluator from "./OQRE/MATHS/MathEvaluator";
import OQREHub from "./OQRE/oqr";
import MainApp from "./6eAnnee/MainApp";
import YearlyNavigator2e from "./2eAnnee/francais/texteCompreh/WeeklyNavigator";
import ApprentissageLecture from "./1eAnnee/lecture";
import DictationApp from "./1eAnnee/1/dictations";
import LecteurInteractif from "./1eAnnee/1/lecture";
import ReadingApp from "./1eAnnee/repas";
import ReadingAppee from "./1eAnnee/Lecture/app";
import SentenceBuilder from "./Cahier/SentenceBuilder";
import TeacherDashboard from "./Dictee/TeacherDashboard";


function App() {
  
  return (
    <div className="App">
      <Router>
        <Header />      
          <Routes>
            <Route path="/" element={<Accueil></Accueil>} />
            <Route path="/test" element={<OQREHub></OQREHub>} />
            <Route path="/ens" element={<TeacherDashboard/> }/>
          
            
            <Route path="/Multiplication" element={<MultiplicationChallengeOK></MultiplicationChallengeOK>} />
                    {/* Page des activités pour chaque année */}

         <Route path="/Concours3" element={<DictationApp1></DictationApp1>} />
         <Route path="/Concours2" element={<DictationAppcka></DictationAppcka>} />
         <Route path="/activites/:annee" element={<Activite></Activite> } />


          <Route path="/activites/51e Année/Francais" element={<YearlyNavigator5e />} />
          <Route path="/activites/1re Année/Francais" element={<ReadingAppee></ReadingAppee>} />
          <Route path="/activites/1re Année/Mathematiques" element={<ReadingApp></ReadingApp>} />
          <Route path="/activites/1re Année/Sciences" element={<DictationApp></DictationApp>} />
          
           

          <Route path="/activites/31e Année/Francais" element={<YearlyNavigator />} />
          <Route path="/activites/3e Année/Francais" element={<EvaluationGame />} />
          <Route path="/activites/2e Année/Francais" element={<YearlyNavigator2e />} />
          <Route path="/activites/7e Année/Francais" element={<SentenceBuilder></SentenceBuilder>} />

          <Route path="/activites/3e Année/Mathematiques" element={<MathEvaluator></MathEvaluator> } />
          <Route path="/activites/6e Année/Francais" element={<Exercice63></Exercice63>} />
          <Route path="/activites/6e Année/Mathematiques" element={<MainApp></MainApp>} />
            
           
            
            
            

            

           


         

          </Routes>
       

        <Footer />
      </Router>
    </div>
  );
}

export default App;
