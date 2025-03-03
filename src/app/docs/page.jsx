"use client";
import Head from "next/head";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // Import icon dari react-icons
import swaggerConfig from "../swagger-config.json"; // Sesuaikan path ini dengan file swagger-config.json Anda

export default function Home() {
  const [endpointsByTag, setEndpointsByTag] = useState({});
  const [expandedTag, setExpandedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateEndpointsByTag = (swaggerData) => {
    const tagEndpointMap = {};
    Object.keys(swaggerData.paths).forEach((path) => {
      Object.keys(swaggerData.paths[path]).forEach((method) => {
        const operation = swaggerData.paths[path][method];
        if (operation.tags) {
          operation.tags.forEach((tag) => {
            if (!tagEndpointMap[tag]) {
              tagEndpointMap[tag] = [];
            }
            tagEndpointMap[tag].push({
              method: method.toUpperCase(),
              path,
              description: operation.summary || "Deskripsi tidak tersedia",
            });
          });
        }
      });
    });
    return tagEndpointMap;
  };

  useEffect(() => {
    setTimeout(() => {
      const endpointsMap = calculateEndpointsByTag(swaggerConfig);
      setEndpointsByTag(endpointsMap);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleCategory = (tag) => {
    setExpandedTag(expandedTag === tag ? null : tag);
  };

  const getFilteredSpec = (tag) => {
    const filteredPaths = {};
    Object.keys(swaggerConfig.paths).forEach((path) => {
      const pathData = swaggerConfig.paths[path];
      Object.keys(pathData).forEach((method) => {
        const operation = pathData[method];
        if (operation.tags && operation.tags.includes(tag)) {
          filteredPaths[path] = pathData;
        }
      });
    });

    return {
      ...swaggerConfig,
      paths: filteredPaths,
    };
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        background-color: #181818;
        color: #e0e0e0;
        font-family: 'Roboto', sans-serif;
      }

      .swagger-ui .info .title,
      .swagger-ui .opblock-summary-method,
      .swagger-ui .opblock-summary-path,
      .swagger-ui .model-title {
        color: #ffffff !important;
      }

      .swagger-ui .topbar {
        background-color: #242424;
        padding: 10px 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      /* API Category Styling */
      .api-category {
        background-color: #1e1e1e;
        border: 1px solid #444;
        padding: 16px;
        margin-bottom: 16px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .api-category:hover {
        background-color: #2a2a2a;
        border-color: #555;
      }

      .api-category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        color: #f0f0f0;
      }

      .api-category-content {
        display: none;
        padding-top: 12px;
      }

      .api-category.expanded .api-category-content {
        display: block;
      }

      .api-category-header .icon {
        margin-left: 10px;
        font-size: 20px;
        color: #cccccc;
        transition: transform 0.3s ease;
      }

      .api-category.expanded .api-category-header .icon {
        transform: rotate(180deg);
      }

      /* Card-like API endpoint */
      .api-endpoint {
        background-color: #242424;
        border: 1px solid #333;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      }

      .api-endpoint:hover {
        border-color: #555;
      }

      .api-endpoint-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
      }

      .api-endpoint-method {
        font-weight: bold;
        color: #ffa500; /* Or your preferred primary color */
      }

      .api-endpoint-path {
        font-weight: 600;
        color: #ffffff;
      }

      /* Adjust input and button styling for dark theme */
      .swagger-ui input[type="text"],
      .swagger-ui input[type="password"],
      .swagger-ui select,
      .swagger-ui textarea {
        background-color: #2a2a2a;
        color: #ffffff;
        border-color: #444;
        border-radius: 6px;
      }

      .swagger-ui button {
        background-color: #ff7f50; /* Button color */
        color: white;
        border-radius: 6px;
      }

      .swagger-ui button:hover {
        background-color: #ff9c68; /* Hover state */
      }

      /* Adjust footer or extra info */
      .swagger-ui .info .base-url {
        color: #cccccc;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Head>
        <title>VelynAPI</title>
        <meta name="title" content="VelynAPI - Dokumentasi" />
        <meta
          name="description"
          content="VelynApi adalah REST API gratis dan sederhana yang dibuat oleh ErerexIDChx untuk kebaikan bersama. Silakan gunakan, tapi hindari serangan DDoS."
        />
        <meta
          name="keywords"
          content="REST API, KyuuRzy, Siputzx, Qanypaw, Nawdev, Itzpire API, free API, dokumentasi API, bot wa, REST API gratis"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English, Indonesian" />
        <meta property="og:title" content="VelynAPI - Dokumentasi" />
        <meta
          property="og:description"
          content="VelynApi adalah REST API gratis dan sederhana yang dibuat oleh ErerexIDChx untuk kebaikan bersama. Silakan gunakan, tapi hindari serangan DDoS."
        />
        <meta property="og:url" content="https://kyuubeyours.us.kg" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://files.catbox.moe/962uqd.jpg" />
        <meta name="twitter:title" content="VelynAPI - Dokumentasi" />
        <meta
          name="twitter:description"
          content="VelynApi adalah REST API gratis dan sederhana yang dibuat oleh ErerexIDChx untuk kebaikan bersama. Silakan gunakan, tapi hindari serangan DDoS."
        />
        <meta name="twitter:image" content="https://files.catbox.moe/962uqd.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className={`p-6`}>
        <div className="bg-black shadow-md rounded-lg p-4">
          {loading ? (
            <p>Memuat endpoint...</p>
          ) : (
            Object.keys(endpointsByTag).map((tag) => (
              <div
                key={tag}
                className={`api-category ${expandedTag === tag ? "expanded" : ""}`}
              >
                <div className="api-category-header">
                  <span>{`# ${tag.toUpperCase()}`}</span>
                  <span>{`${endpointsByTag[tag].length} endpoint`}</span>
                  <span
                    className="icon"
                    onClick={(e) => {
                      // Hentikan propagasi event untuk menghentikan interaksi dengan SwaggerUI
                      e.stopPropagation();
                      toggleCategory(tag);
                    }}
                  >
                    {expandedTag === tag ? (
                      <FaChevronDown /> // Ikon ketika diperluas
                    ) : (
                      <FaChevronRight /> // Ikon ketika dilipat
                    )}
                  </span>
                </div>
                <div className="api-category-content">
                  {expandedTag === tag && (
                    <SwaggerUI
                      key={tag} // Menggunakan tag sebagai key untuk memastikan render ulang
                      spec={getFilteredSpec(tag)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}