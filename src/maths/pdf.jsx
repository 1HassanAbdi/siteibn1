import React, { useState } from "react";
//import MultipliDecrament from "./mutplicationjeuavectempsdecrementation";

const pdfList = [
  {
    category: "Multiplication",
    files: [
      { name: "Exercice 1", file: "/mutiplicationeng33.pdf" },
      { name: "Exercice 2", file: "/multiplication_ex2.pdf" },
      { name: "Exercice 3", file: "/multiplication_ex3.pdf" },
      { name: "Exercice 4", file: "/multiplication_ex4.pdf" },
    ]
  },
  {
    category: "Addition",
    files: [
      { name: "Exercice 1", file: "/addition_ex1.pdf" },
      { name: "Exercice 2", file: "/addition_ex2.pdf" },
    ]
  },
  {
    category: "Soustraction",
    files: [
      { name: "Exercice 1", file: "/soustraction_ex1.pdf" }
    ]
  },
  {
    category: "Division",
    files: [
      { name: "Exercice 1", file: "/division_ex1.pdf" },
      { name: "Exercice 2", file: "/division_ex2.pdf" }
    ]
  }
];

export default function PdfViewerMenu() {

  const [selectedPdf, setSelectedPdf] = useState("/mutiplicationeng33.pdf");

  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        flexDirection: "row",
        gap: "10px",
        padding: "10px",
      }}
    >

      {/* --- REND RESPONSIVE --- */}
      <style>
        {`
          @media (max-width: 768px) {
            #wrapper-container {
              flex-direction: column !important;
              height: auto !important;
            }

            #menu {
              width: 100% !important;
              border-right: none !important;
              border-bottom: 2px solid #ddd !important;
            }

            #pdf-viewer {
              height: 75vh !important;
            }
          }
        `}
      </style>

      <div
        id="wrapper-container"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          width: "100%",
        }}
      >

        {/* --- MENU GAUCHE (ou en haut sur petit écran) --- */}
        <div
          id="menu"
          style={{
            width: "260px",
            background: "#f4f4f4",
            padding: "15px",
            borderRight: "2px solid #ddd",
            overflowY: "auto",
            borderRadius: "10px"
          }}
        >
          <h2 style={{ color: "#3f51b5" }}>📘 Ressources</h2>

          {pdfList.map((section, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#444" }}>{section.category}</h3>

              {section.files.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPdf(f.file)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginBottom: "8px",
                    padding: "10px",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* --- PDF --- */}
        <div
          id="pdf-viewer"
          style={{
            flex: 1,
            padding: "10px",
            height: "100%",
          }}
        >
          <iframe
            src={selectedPdf}
            title="PDF Viewer"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)"
            }}
          />
        </div>
       

      </div>
    </div>
  );
}
