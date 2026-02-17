import React, { useState, useEffect } from 'react';
import { CheckCircle2, Trophy, Volume2, ArrowRight, CloudUpload, HelpCircle } from 'lucide-react';

export default function Evaluation({ data, onComplete, storyTitle, studentName, studentClass }) {
  const quizData = data || [];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [userHistory, setUserHistory] = useState([]);
  const [showResult, setShowResult] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [status, setStatus] = useState("idle");

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby5Gle2FKRO2hmI5-aU1odhSxK-R6ZDiJgyaouCLMZeU41UmnFWhkNKIScv3JdyTiAUXg/exec";

  const currentQuiz = quizData[currentStep];

  // Fonction d'envoi vers Google Sheets
  const sendDataToSheet = async (finalScore, history) => {
    setStatus("sending");
    
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: studentName || "Anonyme",
          studentClass: studentClass || "1A",
          story: storyTitle || "Inconnu",
          score: finalScore,
          total: quizData.length,
          // ON ENVOIE LE TABLEAU COMPLET pour l'analyse des erreurs
          details: history 
        })
      });
      setStatus("success");
    } catch (e) {
      console.error("Erreur d'envoi:", e);
      setStatus("error");
    }
  };

  const handleAnswer = (userAnswer) => {
    if (showResult || !currentQuiz) return;

    const isCorrect = userAnswer === currentQuiz.answer;
    
    // ON AJOUTE LE TEXTE DE LA QUESTION pour que Google Sheets sache laquelle compter
    const newHistory = [
      ...userHistory, 
      { 
        question: currentQuiz.question, 
        userAnswer: userAnswer.toString(), 
        isCorrect: isCorrect 
      }
    ];
    setUserHistory(newHistory);

    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);
    setShowResult(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      if (currentStep < quizData.length - 1) {
        setCurrentStep(currentStep + 1);
        setShowResult(null);
      } else {
        setIsFinished(true);
        sendDataToSheet(newScore, newHistory);
      }
    }, 1500);
  };

  // Lecture audio automatique
  useEffect(() => {
    if (!isFinished && currentQuiz?.question) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuiz.question);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  }, [currentStep, isFinished, currentQuiz]);

  if (quizData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 text-center">
        <HelpCircle size={64} className="mb-4 animate-pulse" />
        <p className="text-xl font-bold">Oups ! Les questions n'ont pas chargé.</p>
        <button onClick={onComplete} className="mt-4 text-blue-500 underline">Retourner au menu</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white h-full text-center">
        <Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" />
        <h2 className="text-4xl font-black text-slate-700 mb-2">Bravo {studentName} !</h2>
        <div className="text-7xl font-black text-purple-600 mb-4">{score} / {quizData.length}</div>
        
        <div className="mb-10 flex flex-col items-center gap-2">
          {status === "sending" && <span className="text-blue-500 animate-pulse font-bold">☁️ Enregistrement en cours...</span>}
          {status === "success" && <span className="text-green-500 font-bold flex items-center gap-2"><CheckCircle2 /> Enregistré avec succès !</span>}
          {status === "error" && <span className="text-red-500 font-bold">❌ Erreur lors de l'enregistrement</span>}
        </div>

        <button onClick={onComplete} className="bg-purple-600 text-white px-12 py-5 rounded-[2rem] font-black text-2xl shadow-[0_10px_0_#4c1d95] active:translate-y-2 active:shadow-none transition-all">
          MENU PRINCIPAL
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 w-full max-w-2xl mx-auto h-full justify-between gap-6">
      <div className="w-full">
        <div className="flex justify-between items-end mb-2 px-2 font-black text-slate-400">
          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm">ÉVALUATION - {studentClass}</span>
          <span>Question {currentStep + 1} / {quizData.length}</span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full border-2 overflow-hidden">
          <div className="h-full bg-purple-500 transition-all duration-700" style={{ width: `${((currentStep + 1) / quizData.length) * 100}%` }}></div>
        </div>
      </div>

      <div className={`w-full bg-white p-10 rounded-[3rem] shadow-2xl border-b-[12px] min-h-[350px] flex flex-col justify-center transition-all
        ${showResult === 'correct' ? 'border-green-400 bg-green-50/30' : showResult === 'wrong' ? 'border-red-400 bg-red-50/30' : 'border-slate-100'}`}>
        
        <h3 className="text-3xl font-black text-slate-700 text-center mb-10 leading-tight">
          {currentQuiz?.question}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {currentQuiz?.type === "qcm" ? (
            currentQuiz.options.map((opt, i) => (
              <button key={i} disabled={showResult} onClick={() => handleAnswer(opt)}
                className={`p-5 rounded-2xl text-xl font-bold border-4 transition-all
                ${showResult && opt === currentQuiz.answer ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-slate-100 text-slate-600'}`}>
                {opt}
              </button>
            ))
          ) : (
            <div className="flex gap-6">
              <button disabled={showResult} onClick={() => handleAnswer(true)} className="flex-1 p-10 rounded-[2rem] text-3xl font-black bg-green-500 text-white shadow-[0_8px_0_#15803d]">VRAI</button>
              <button disabled={showResult} onClick={() => handleAnswer(false)} className="flex-1 p-10 rounded-[2rem] text-3xl font-black bg-red-500 text-white shadow-[0_8px_0_#b91c1c]">FAUX</button>
            </div>
          )}
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
}