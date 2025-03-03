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

          {/* Tombol kategori API */}
          <div className="category-container">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-button ${selectedCategory === category.name ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name} {category.count} endpoint
                  <span className="arrow">{selectedCategory === category.name ? "▲" : "▶"}</span>
                </button>
              ))
            ) : (
              <p>Tidak ada kategori tersedia</p>
            )}
          </div>

          {/* Swagger UI hanya muncul jika kategori dipilih */}
          {selectedCategory && (
            <div className="swagger-container">
              <SwaggerUI
                spec={{
                  ...swaggerConfig,
                  paths: Object.fromEntries(
                    Object.entries(swaggerConfig.paths).filter(([_, value]) =>
                      Object.values(value).some((method) => method.tags?.includes(selectedCategory))
                    )
                  ),
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Styling */}
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
          margin-bottom: 20px;
        }
        .category-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .category-button {
          width: 80%;
          background: #181842;
          padding: 15px 20px;
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