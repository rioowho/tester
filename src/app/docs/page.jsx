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
        background-color: #0e0e0e;
        color: #ffffff;
      }

      .swagger-ui .info .title,
      .swagger-ui .scheme-container,
      .swagger-ui .model-title,
      .swagger-ui .opblock-summary-method,
      .swagger-ui .opblock-summary-path,
      .swagger-ui .response-col_status,
      .swagger-ui label,
      .swagger-ui .opblock-tag {
        color: #ffffff !important;
      }

      .swagger-ui .topbar {
        background-color: #1c1c1c;
      }

      .swagger-ui select,
      .swagger-ui textarea,
      .swagger-ui input[type="text"],
      .swagger-ui input[type="email"],
      .swagger-ui input[type="file"],
      .swagger-ui input[type="password"],
      .swagger-ui input[type="search"] {
        background-color: #2a2a2a;
        color: #ffffff;
        border-color: #444;
      }

      .swagger-ui .opblock:hover {
        border-color: #565656;
      }

      .api-category {
        background-color: #1a1a1a;
        border: 1px solid #444;
        padding: 12px;
        margin-bottom: 12px;
        border-radius: 8px;
        cursor: pointer;
        color: #ffffff;
      }

      .api-category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        color: #cccccc;
      }

      .api-category-content {
        display: none;
      }

      .api-category.expanded .api-category-content {
        display: block;
      }

      .api-category-header .icon {
        margin-left: 10px;
        cursor: pointer;
      }

      /* Pastikan Swagger UI tetap dapat di-interaksi */
      .swagger-ui {
        pointer-events: auto;
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