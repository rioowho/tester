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

  useEffect(() => {
    let count = 0;
    if (swaggerConfig.paths) {
      count = Object.keys(swaggerConfig.paths).length;
    }
    setTotalEndpoints(count);
  }, []);

  const categories = Object.keys(swaggerConfig.tags || {}).map((tag) => {
    const categoryEndpoints = Object.values(swaggerConfig.paths).filter((path) =>
      path.tags.includes(tag)
    ).length;

    return {
      name: tag,
      total: categoryEndpoints,
    };
  });

  const filteredPaths = selectedCategory
    ? Object.fromEntries(
        Object.entries(swaggerConfig.paths).filter(([_, path]) =>
          path.tags.includes(selectedCategory)
        )
      )
    : swaggerConfig.paths;

  return (
    <>
      <Head>
        <title>VelynAPI</title>
        <meta name="title" content="VelynAPI - Documentation" />
        <meta name="description" content="VelynApi is a free, simple REST API created by ErerexIDChx for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta name="keywords" content="REST API, KyuuRzy, Siputzx, Qanypaw, Nawdev, Itzpire API, free API, API documentation, bot wa, free REST API" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English, Indonesian" />
        <meta property="og:title" content="VelynAPI - Documentation" />
        <meta property="og:description" content="VelynApi is a free, simple REST API created by ErerexIDChx for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta property="og:url" content="https://kyuubeyours.us.kg" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://files.catbox.moe/962uqd.jpg" />
        <meta name="twitter:title" content="VelynAPI - Documentation" />
        <meta name="twitter:description" content="VelynApi is a free, simple REST API created by ErerexIDChx for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta name="twitter:image" content="https://files.catbox.moe/962uqd.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className={`min-h-screen flex flex-col items-center justify-center ${inter.className}`} style={{ backgroundColor: "#0d0d1a", color: "white" }}>
        <Analytics />
        <SpeedInsights />

        <div className="container">
          <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>
            Total Endpoints: {totalEndpoints}
          </h1>

          {/* Category Buttons */}
          <div className="category-buttons-container">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`category-button ${selectedCategory === category.name ? 'selected' : ''}`}
              >
                {category.name} ({category.total})
              </button>
            ))}
          </div>

          {/* Display Swagger UI for the selected category */}
          {selectedCategory && (
            <div className="swagger-ui-container">
              <SwaggerUI
                spec={{
                  ...swaggerConfig,
                  paths: filteredPaths,
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Additional CSS Enhancements */}
      <style jsx>{`
        .category-buttons-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .category-button {
          background-color: #6a0dad;
          padding: 14px 24px;
          border-radius: 10px;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
          min-width: 150px;
          text-align: center;
        }

        .category-button:hover {
          background-color: #5a0ca3;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .category-button.selected {
          background-color: #5a0ca3;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .swagger-ui-container {
          width: 100%;
          margin-top: 20px;
          padding: 20px;
          border-radius: 10px;
          background-color: #1f1f2f;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Container Styling */
        .container {
          max-width: 1200px;
          width: 100%;
          padding: 25px;
          margin: 0 auto;
          background-color: #111;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        h1 {
          color: #fff;
        }

        /* Making the layout responsive */
        @media (max-width: 768px) {
          .category-button {
            padding: 10px 18px;
            font-size: 14px;
            min-width: 120px;
          }

          h1 {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
}