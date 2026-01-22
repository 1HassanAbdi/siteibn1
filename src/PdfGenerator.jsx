import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateStudySheet = (words, level, week) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('fr-FR');

  // --- ENTÊTE ---
  doc.setFontSize(22);
  doc.setTextColor(13, 110, 82); // Couleur émeraude de ton app
  doc.text(`Fiche de Révision : Semaine ${week}`, 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Niveau : ${level}e Année | Date : ${date}`, 14, 30);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(13, 110, 82);
  doc.line(14, 35, 196, 35);

  // --- ZONE ÉLÈVE ---
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Nom de l'élève : ___________________________", 14, 45);

  // --- TABLEAU DES MOTS ---
  const tableRows = words.map((w, index) => [
    index + 1,
    w.toUpperCase(),
    "[   ] Lu",
    "[   ] Écrit",
    "________________________" // Espace pour copier le mot
  ]);

  doc.autoTable({
    startY: 55,
    head: [['#', 'Mot à apprendre', 'Lecture', 'Mémorisation', 'Pratique (Écris le mot ici)']],
    body: tableRows,
    headStyles: { fillStyle: 'f', fillColor: [21, 162, 120], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 255, 250] },
    styles: { cellPadding: 5, fontSize: 10, valign: 'middle' },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 40, fontStyle: 'bold' },
      4: { cellWidth: 60 }
    }
  });

  // --- ZONE DE DICTÉE D'ENTRAÎNEMENT ---
  let finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setTextColor(13, 110, 82);
  doc.text("Dictée d'entraînement", 14, finalY);
  
  doc.setDrawColor(200);
  for (let i = 0; i < 6; i++) {
    doc.line(14, finalY + 10 + (i * 10), 196, finalY + 10 + (i * 10));
  }

  // --- PIED DE PAGE ---
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Objectif : Concours de Dictée Mai 2026 - Pratique quotidienne recommandée.", 14, 285);

  // Sauvegarde
  doc.save(`Revision_S${week}_Niveau${level}.pdf`);
};