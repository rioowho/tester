"use client";
import Head from "next/head";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import swaggerConfig from "../swagger-config.json";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalEndpoints, setTotalEndpoints] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let count = 0;
    const categoryCount = {};

    if (swaggerConfig.paths) {
      Object.entries(swaggerConfig.paths).forEach(([path, methods]) => {
        Object.values(methods).forEach((method) => {
          if (method.tags) {
            method.tags.forEach((tag) => {
              if (!categoryCount[tag]) {
                categoryCount[tag] = 0;
              }
              categoryCount[tag] += 1;
            });
          }
          count += 1;
        });
      });
    }

    setTotalEndpoints(count);
    setCategories(Object.entries(categoryCount).map(([name, count]) => ({ name, count })));
  }, []);

  return (
    <>
      <Head>
        <title>VelynAPI</title>
        <meta name="description" content="VelynApi is a free, simple REST API." />
      </Head>

      <main className={`min-h-screen flex flex-col items-center ${inter.className}`} style={{ backgroundColor: "#0d0d1a", color: "white" }}>
        <Analytics />
        <SpeedInsights />

        <div className="container">
          <h1 className="total-endpoints">Total Endpoints: {totalEndpoints}</h1>

          <div className="category-container">
  {categories.length > 0 ? (
    categories.map((category, index) => (
      <button
        key={index}
        className={`category-button ${selectedCategory === category.name ? "active" : ""}`}
        onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
        style={{
          width: "80%",
          background: selectedCategory === category.name ? "#251d6d" : "#181842",
          padding: "14px 18px",
          borderRadius: "8px",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          transform: selectedCategory === category.name ? "translateY(-5px)" : "none",
          boxShadow: selectedCategory === category.name 
            ? "0 8px 15px rgba(74, 12, 131, 0.5)" 
            : "0 4px 6px rgba(90, 12, 163, 0.4)",
        }}
      >
        {selectedCategory === category.name && (
          <span 
            style={{
              position: "absolute",
              left: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              color: "white",
            }}
          >
            ✖
          </span>
        )}
        {category.name} {category.count} endpoint
        <span style={{ fontSize: "16px", transition: "transform 0.3s ease-in-out" }}>
          {selectedCategory === category.name ? "▲" : "▶"}
        </span>
      </button>
    ))
  ) : (
    <p>Tidak ada kategori tersedia</p>
  )}
</div>
{selectedCategory && (
  <div 
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "1000px",
      height: "80vh", 
      background: "#220f40",
      borderRadius: "15px",
      padding: "20px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
      overflowY: "auto", // Tambahkan scroll jika konten terlalu panjang
      zIndex: 1000,
    }}
  >
    {/* Tombol silang untuk menutup */}
    <span 
      onClick={() => setSelectedCategory(null)} 
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        fontSize: "20px",
        fontWeight: "bold",
        cursor: "pointer",
        color: "white",
      }}
    >
      ✖
    </span>

    <SwaggerUI
      spec={{
        ...swaggerConfig,
        info: {},
        paths: Object.fromEntries(
          Object.entries(swaggerConfig.paths).filter(([_, value]) =>
            Object.values(value).some((method) => method.tags?.includes(selectedCategory))
          )
        ),
      }}
      docExpansion="none"
      defaultModelsExpandDepth={-1}
    />
  </div>
)}
        </div>
      </main>

      <style jsx>{`
  .container {
    width: 90%;
    max-width: 1200px;
    text-align: center;
    padding: 20px;
  }
  .total-endpoints {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2px; /* Lebih dekat ke kategori */
  }
  .category-container {
    display: flex;
    flex-direction: column;
    gap: 6px; /* Sedikit jarak antar kategori */
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 0px; 
  }
  .category-button {
    width: 80%;
    background: #181842;
    padding: 14px 18px;
    border-radius: 8px;
    color: white;
    font-size: 18px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px rgba(90, 12, 163, 0.4);
  }
  .category-button:hover {
    background: #20205a;
    transform: scale(1.05);
  }
  .category-button.active {
    background: #251d6d;
    box-shadow: 0 6px 10px rgba(74, 12, 131, 0.5);
  }
        .arrow {
          font-size: 20px;
          font-weight: bold;
        }
        .swagger-container {
          margin-top: 20px;
          padding: 20px;
          background: #1a1a2e;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
        }

        /* Styling Swagger UI */
        :global(.swagger-ui) {
          background: #1a1a2e !important;
          color: white !important;
          border-radius: 10px;
          padding: 15px;
        }
        :global(.swagger-ui .topbar) {
          display: none;
        }
        :global(.swagger-ui .info) {
          color: #e0e0ff !important;
        }
        :global(.swagger-ui .opblock) {
          border-radius: 8px !important;
          background: #2a2a3a !important;
        }
        :global(.swagger-ui .opblock-summary-method) {
          color: white !important;
          font-weight: bold;
          padding: 8px;
          border-radius: 5px;
        }
        :global(.swagger-ui .opblock-summary-method-get) {
          background: #4a90e2 !important;
        }
        :global(.swagger-ui .opblock-summary-method-post) {
          background: #2ecc71 !important;
        }
        :global(.swagger-ui .opblock-summary-path) {
          color: #e0e0ff !important;
        }
        :global(.swagger-ui .btn) {
          background: #5a0ca3 !important;
          color: white !important;
          border-radius: 5px !important;
        }
        :global(.swagger-ui .btn:hover) {
          background: #6a0dad !important;
        }
      `}</style>
    </>
  );
}