"use client";
import Head from "next/head";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // Ikon dari react-icons
import swaggerConfig from "../swagger-config.json"; // Sesuaikan path ini

export default function Home() {
  const [endpointsByTag, setEndpointsByTag] = useState({});
  const [expandedTag, setExpandedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk membagi endpoint berdasarkan tag
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

      /* Warna tombol dan elemen interaksi */
      .swagger-ui .btn {
        background-color: #3b82f6;
        color: white;
      }

      .badge-status {
        background-color: #00ff00;
        color: black;
        padding: 0.25em 0.5em;
        border-radius: 0.25em;
      }

      .badge-version {
        background-color: #3b82f6;
        color: white;
        padding: 0.25em 0.5em;
        border-radius: 0.25em;
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
          content="VelynApi adalah REST API gratis dan sederhana yang dibuat oleh ErerexIDChx untuk kebaikan bersama."
        />
        <meta property="og:title" content="VelynAPI - Dokumentasi" />
        <meta
          property="og:description"
          content="VelynApi adalah REST API gratis dan sederhana yang dibuat oleh ErerexIDChx untuk kebaikan bersama."
        />
      </Head>

      <main className={`p-6`}>
        <div className="bg-black shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Mistra API</h1>
            <div className="flex space-x-4">
              <span className="badge-status">200</span>
              <span className="badge-version">v1.0</span>
            </div>
          </div>
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
                      e.stopPropagation();
                      toggleCategory(tag);
                    }}
                  >
                    {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>
                <div className="api-category-content">
                  {expandedTag === tag && (
                    <SwaggerUI
                      key={tag}
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