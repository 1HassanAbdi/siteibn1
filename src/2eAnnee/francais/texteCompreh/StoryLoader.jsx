import React, { useMemo, useEffect } from "react";
import { FileWarning, Loader2 } from "lucide-react";
import StoryPlayer from "./StoryPlayer";

// 🚀 CHARGEMENT DES FICHIERS (VITE)
const allJsons = import.meta.glob("./**/*.json", { eager: true });
const allAudio = import.meta.glob("./**/*.mp3", { eager: true });
const allImages = import.meta.glob("./**/*.{png,jpg,jpeg,gif}", { eager: true });

const StoryLoader = ({ storyFolder }) => {
  const { storyData, audioMap, imageMap, isLoading } = useMemo(() => {
    if (!storyFolder) return { storyData: null, audioMap: {}, imageMap: {}, isLoading: false };

    console.log(`📂 [StoryLoader] Chargement du dossier : ${storyFolder}`);

    // --- 1. CHARGEMENT DU JSON ---
    const jsonPath = Object.keys(allJsons).find((path) =>
      path.includes(`/${storyFolder}/`) && path.toLowerCase().includes("tex1.json")
    );
    const storyData = jsonPath ? (allJsons[jsonPath].default || allJsons[jsonPath]) : null;

    // --- 2. CHARGEMENT AUDIO ---
    const audioMap = {};
    Object.keys(allAudio).forEach((path) => {
      if (path.includes(`/${storyFolder}/`)) {
        const fileName = path.split("/").pop();
        const mod = allAudio[path];
        const url = (mod && mod.default) ? mod.default : mod;
        audioMap[fileName] = url;
      }
    });

    // --- 3. CHARGEMENT IMAGES ---
    const imageMap = {};
    Object.keys(allImages).forEach((path) => {
      if (path.includes(`/${storyFolder}/`)) {
        const fileName = path.split("/").pop();
        const mod = allImages[path];
        const url = (mod && mod.default) ? mod.default : mod;
        imageMap[fileName] = url;
      }
    });

    return { storyData, audioMap, imageMap, isLoading: false };
  }, [storyFolder]);

  // 🔍 DEBUGGING
  useEffect(() => {
    if (storyData) {
      console.log("✅ [StoryLoader] JSON chargé avec succès.");
      console.log("🎵 [StoryLoader] Audio:", Object.keys(audioMap).length, "fichiers");
    }
  }, [storyData, audioMap]);

  // --- ÉTAT DE CHARGEMENT (Optionnel mais propre) ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#0d6e52]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-bold text-sm uppercase tracking-widest">Chargement de l'histoire...</p>
      </div>
    );
  }

  // --- ÉTAT D'ERREUR HARMONISÉ ---
  if (!storyData) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center bg-rose-50 rounded-[40px] border-2 border-rose-100">
        <div className="bg-rose-100 p-4 rounded-full mb-4 text-rose-500">
          <FileWarning size={48} />
        </div>
        <h3 className="text-xl font-black text-rose-700 mb-2">Histoire Introuvable</h3>
        <p className="text-slate-600 max-w-md mb-6">
          Oups ! Nous n'avons pas trouvé le fichier de configuration pour cette histoire.
        </p>
        <div className="bg-white px-4 py-2 rounded-lg border border-rose-100 font-mono text-xs text-rose-500">
          Dossier recherché : <span className="font-bold">{storyFolder}</span>
        </div>
      </div>
    );
  }

  // --- RENDU DU LECTEUR ---
  return <StoryPlayer storyData={storyData} audioMap={audioMap} imageMap={imageMap} />;
};

export default StoryLoader;