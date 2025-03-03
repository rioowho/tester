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

  // Create categories dynamically from swaggerConfig tags and calculate total endpoints per category
  const categories = Object.keys(swaggerConfig.tags || {}).map((tag) => {
    const categoryEndpoints = Object.values(swaggerConfig.paths).filter((path) =>
      path.tags.includes(tag)
    ).length;

    return {
      name: tag,
      total: categoryEndpoints,
    };
  });

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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
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
            <div className="card">
              <SwaggerUI
                spec={{
                  ...swaggerConfig,
                  paths: Object.fromEntries(
                    Object.entries(swaggerConfig.paths).filter(([_, value]) =>
                      value.tags.includes(selectedCategory)
                    )
                  ),
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* CSS Styling for Category Buttons */}
      <style jsx>{`
        .category-button {
          background-color: #6a0dad;
          padding: 12px 20px;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s, transform 0.3s;
        }

        .category-button:hover {
          background-color: #5a0ca3;
          transform: scale(1.05);
        }

        .category-button.selected {
          background-color: #5a0ca3;
        }

        .card {
          width: 100%;
          margin-top: 20px;
        }
      `}</style>
    </>
  );
}