import React from 'react';
import { Printer, X, BookOpen, AlertCircle } from 'lucide-react';

const PrintableParentPack = ({ data, type = "activity", onClose, monthName }) => {
  
  if (!data) return null;

  const handlePrint = () => {
    // 1. Calcul dynamique des points
    const totalPoints = data.noteTotale || 25;
    let pointsAuto = 0; // Points QCM/Vrai-Faux/Vocab
    let pointsRedac = 0; // Points Questions Ouvertes

    data.sections.forEach(sec => {
        if(sec.type === 'open') pointsRedac += sec.pointsTotaux;
        else pointsAuto += sec.pointsTotaux;
    });

    // 2. Génération du HTML
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Devoir - ${data.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&family=Roboto:wght@300;400;500&display=swap');
            
            body { 
                font-family: 'Roboto', sans-serif; 
                margin: 0; 
                padding: 10mm 15mm; 
                color: #1a202c;
                font-size: 10pt; /* Taille compacte */
            }

            /* --- EN-TÊTE --- */
            .header {
                display: flex; justify-content: space-between; align-items: flex-end;
                border-bottom: 2px solid #2d3748; padding-bottom: 15px; margin-bottom: 20px;
            }
            h1 { font-family: 'Roboto Slab', serif; font-size: 18pt; margin: 0; color: #2d3748; text-transform: uppercase; line-height: 1.1; }
            .subtitle { font-style: italic; color: #718096; margin-top: 5px; font-size: 9pt; }
            
            .student-info { display: flex; gap: 20px; font-size: 10pt; font-weight: bold; }
            .field { display: flex; align-items: baseline; }
            .dots { border-bottom: 1px dotted #2d3748; width: 150px; height: 1em; margin-left: 5px; }

            /* --- TEXTE DE LECTURE (Fond gris) --- */
            .reading-text {
                background-color: #f7fafc; 
                padding: 15px; 
                border-radius: 8px; 
                border-left: 4px solid #4a5568;
                text-align: justify; 
                line-height: 1.4; 
                margin-bottom: 25px;
                font-family: 'Roboto Slab', serif;
                font-size: 10.5pt;
            }

            /* --- SYSTÈME DE COLONNES (Le secret du gain de place) --- */
            .columns-container {
                column-count: 2; 
                column-gap: 1cm;
                column-fill: balance;
            }
            
            /* Bloc d'une section (Vrai/Faux, QCM) */
            .section-block {
                break-inside: avoid; /* Ne pas couper un exercice au milieu */
                margin-bottom: 20px;
            }

            /* Section Rédaction (Traverse les colonnes) */
            .full-width-section {
                column-span: all;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dashed #cbd5e0;
            }

            h2 {
                font-size: 11pt; 
                background: #2d3748; color: white; 
                padding: 4px 10px; 
                border-radius: 4px; 
                margin: 0 0 10px 0;
                display: flex; justify-content: space-between; align-items: center;
            }
            .pts { font-size: 8pt; opacity: 0.9; font-weight: normal; }

            /* --- QUESTIONS --- */
            .question-item { margin-bottom: 8px; break-inside: avoid; }
            .q-text { font-weight: 500; margin-bottom: 3px; }

            /* Options QCM / VF */
            .options-grid { margin-left: 5px; }
            .opt-row { display: flex; align-items: center; margin-bottom: 2px; font-size: 9.5pt; }
            .checkbox { width: 12px; height: 12px; border: 1px solid #4a5568; margin-right: 8px; display: inline-block; }

            /* --- LIGNES D'ÉCRITURE (Pour la rédaction) --- */
            .lines-box { width: 100%; margin-top: 5px; }
            .line { border-bottom: 1px solid #cbd5e0; height: 28px; width: 100%; }

            /* --- TABLEAU DE NOTES FINAL --- */
            .score-table {
                margin-top: 30px;
                border: 2px solid #2d3748;
                break-inside: avoid;
                page-break-inside: avoid;
            }
            .score-header { background: #2d3748; color: white; text-align: center; font-weight: bold; padding: 5px; text-transform: uppercase; font-size: 10pt; }
            .score-row { display: flex; border-bottom: 1px solid #cbd5e0; }
            .score-label { flex: 1; padding: 8px 15px; font-weight: bold; font-size: 9pt; display: flex; align-items: center; background: #edf2f7; }
            .score-cell { width: 100px; border-left: 1px solid #cbd5e0; padding: 8px; text-align: center; font-size: 12pt; font-weight: bold; color: #718096; }
            
            .prof-zone { background: #fffaf0; color: #c05621; } /* Zone Prof en orange clair */
            .total-row { border-top: 2px solid #2d3748; }
            .total-label { background: #2d3748; color: white; justify-content: flex-end; padding-right: 20px; }
            .total-cell { color: black; }

            /* NOTE D'INFORMATION */
            .info-note {
                margin-top: 20px;
                padding: 10px;
                background-color: #ebf8ff;
                border: 1px solid #bee3f8;
                color: #2c5282;
                font-size: 9pt;
                border-radius: 6px;
                text-align: center;
                break-inside: avoid;
            }

            @media print {
                body { margin: 0; }
                .reading-text, .score-label, h2, .info-note { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>

          <div class="header">
            <div>
                <h1>${data.title}</h1>
                <div class="subtitle">${data.level} • ${data.typeTexte || 'Évaluation'}</div>
            </div>
            <div class="student-info">
                <div class="field">Nom : <div class="dots"></div></div>
                <div class="field">Date : <div class="dots"></div></div>
            </div>
          </div>

          ${data.text ? `
            <div class="reading-text">
                <strong>📖 LECTURE : </strong> ${data.text.replace(/\n/g, '<br>')}
            </div>
          ` : ''}

          <div class="columns-container">
            
            ${data.sections.map((sec, idx) => {
                const isLong = sec.type === 'open';
                
                return `
                <div class="${isLong ? 'full-width-section' : 'section-block'}">
                    <h2>
                        <span>${idx + 1}. ${sec.label}</span>
                        <span class="pts">${sec.pointsTotaux} pts</span>
                    </h2>

                    ${sec.questions.map((q, qIdx) => `
                        <div class="question-item">
                            <div class="q-text">${qIdx + 1}. ${q.q || q}</div>

                            ${isLong ? `
                                <div class="lines-box">
                                    <div class="line"></div>
                                    <div class="line"></div>
                                    <div class="line"></div>
                                </div>
                            ` : `
                                <div class="options-grid">
                                    ${(q.options || ['Vrai', 'Faux']).map(opt => `
                                        <div class="opt-row"><span class="checkbox"></span> ${opt}</div>
                                    `).join('')}
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
                `;
            }).join('')}

          </div> 
          <div class="score-table">
            <div class="score-header">Résultats de l'évaluation</div>
            
            <div class="score-row">
                <div class="score-label">1. PARTIE AUTOMATIQUE (À remplir par l'élève)</div>
                <div class="score-cell">___ / ${pointsAuto}</div>
            </div>

            <div class="score-row">
                <div class="score-label prof-zone">✒️ 2. PARTIE RÉDACTION (Réservé à l'enseignant)</div>
                <div class="score-cell prof-zone">___ / ${pointsRedac}</div>
            </div>

            <div class="score-row total-row">
                <div class="score-label total-label">NOTE FINALE</div>
                <div class="score-cell total-cell">___ / ${totalPoints}</div>
            </div>
          </div>

          <div class="info-note">
            ℹ️ <strong>Information :</strong> Vous pouvez imprimer ce document pour travailler sur papier. La partie "Rédaction" (questions ouvertes) devra être corrigée par votre enseignant.
          </div>

        </body>
      </html>
    `;

    // Ouverture de la fenêtre d'impression propre
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write(content);
    printWindow.document.close();

    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen size={32} className="text-blue-600" />
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-2">Devoir Prêt à Imprimer</h2>
        
        {/* --- NOUVEAU MESSAGE D'INFORMATION --- */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
                <p className="font-bold mb-1">Mode d'emploi :</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Imprimez cette feuille pour l'élève.</li>
                    <li>Les questions à choix multiples peuvent être auto-corrigées.</li>
                    <li><strong>La partie rédaction (écrite) doit être corrigée par l'enseignant.</strong></li>
                </ul>
            </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg transition-colors">
            Annuler
          </button>
          <button onClick={handlePrint} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
            <Printer size={18} /> Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintableParentPack;