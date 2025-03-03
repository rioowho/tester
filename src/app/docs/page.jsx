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
    const categoryMap = {};

    if (swaggerConfig.paths) {
      Object.entries(swaggerConfig.paths).forEach(([_, path]) => {
        if (path.tags) {
          path.tags.forEach((tag) => {
            if (!categoryMap[tag]) {
              categoryMap[tag] = 0;
            }
            categoryMap[tag] += 1;
          });
        }
        count++;
      });
    }

    setTotalEndpoints(count);
    setCategories(Object.entries(categoryMap).map(([name, total]) => ({ name, total })));
  }, []);

  const filteredPaths = selectedCategory
    ? Object.fromEntries(
        Object.entries(swaggerConfig.paths).filter(([_, path]) =>
          path.tags && path.tags.includes(selectedCategory)
        )
      )
    : swaggerConfig.paths;

  return (
    <>
      <Head>
        <title>VelynAPI</title>
      </Head>

      <main className={`min-h-screen flex flex-col items-center ${inter.className}`} style={{ backgroundColor: "#0d0d1a", color: "white" }}>
        <Analytics />
        <SpeedInsights />

        <div className="container">
          <h1 className="title">Total Endpoints: {totalEndpoints}</h1>

          {/* Tombol Kategori API */}
          <div className="category-buttons">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-button ${selectedCategory === category.name ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name} ({category.total})
                </button>
              ))
            ) : (
              <p className="no-category">Tidak ada kategori tersedia</p>
            )}
          </div>

          {/* Swagger UI untuk kategori yang dipilih */}
          {selectedCategory && Object.keys(filteredPaths).length > 0 ? (
            <div className="swagger-container">
              <SwaggerUI spec={{ ...swaggerConfig, paths: filteredPaths }} />
            </div>
          ) : selectedCategory ? (
            <p className="no-api">Tidak ada API di kategori ini.</p>
          ) : null}
        </div>
      </main>

      <style jsx>{`
        .container {
          max-width: 1200px;
          padding: 20px;
          background-color: #111;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: white;
        }

        .category-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .category-button {
          background: #6a0dad;
          padding: 12px 20px;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: bold;
          box-shadow: 0 3px 5px rgba(255, 255, 255, 0.1);
        }

        .category-button.selected {
          background: #5a0ca3;
          box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .category-button:hover {
          background: #5a0ca3;
          transform: scale(1.05);
        }

        .swagger-container {
          width: 100%;
          margin-top: 20px;
          padding: 20px;
          border-radius: 10px;
          background-color: #1f1f2f;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }

        .no-category, .no-api {
          font-size: 18px;
          color: #ccc;
          margin-top: 10px;
        }
      `}</style>
    </>
  );
}