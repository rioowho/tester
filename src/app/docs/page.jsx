"use client";
import Head from "next/head";
import Script from "next/script";
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
    // Menghitung total endpoint dari swaggerConfig
    let count = 0;
    if (swaggerConfig.paths) {
      count = Object.keys(swaggerConfig.paths).length;
    }
    setTotalEndpoints(count);
  }, []);

  const categories = Object.keys(swaggerConfig.tags || {}).map((tag) => ({
    name: tag,
  }));

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

          {/* Tombol kategori API */}  
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>  
            {categories.map((category, index) => (  
              <button  
                key={index}  
                className="category-button"  
                onClick={() => setSelectedCategory(category.name)}  
                style={{  
                  background: selectedCategory === category.name ? "#5a0ca3" : "#6a0dad",  
                  padding: "10px 20px",  
                  borderRadius: "8px",  
                  color: selectedCategory === category.name ? "#5a0ca3" : "#f0f0f0",  // Dark purple when selected
                  fontSize: "16px",  
                  border: "none",  
                  cursor: "pointer",  
                  transition: "0.3s",  
                }}  
              >  
                {category.name}  
              </button>  
            ))}  
          </div>  

          {/* Swagger UI hanya muncul jika kategori dipilih */}  
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

      {/* CSS-in-JS for category-button */}
      <style jsx>{`
        .category-button {
          transition: background-color 0.3s, color 0.3s;
        }

        .category-button:hover {
          background-color: #5a0ca3;
          color: white;
        }
      `}</style>
    </>
  );
}