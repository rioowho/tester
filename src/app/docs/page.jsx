"use client";
import Head from "next/head";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import swaggerConfig from "../swagger-config.json";

export default function Home() {
  const [endpointsByTag, setEndpointsByTag] = useState({});
  const [expandedTag, setExpandedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const endpointsMap = calculateEndpointsByTag(swaggerConfig);
      setEndpointsByTag(endpointsMap);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateEndpointsByTag = (swaggerData) => {
    const tagEndpointMap = {};
    Object.keys(swaggerData.paths).forEach((path) => {
      Object.keys(swaggerData.paths[path]).forEach((method) => {
        const operation = swaggerData.paths[path][method];
        if (operation.tags) {
          operation.tags.forEach((tag) => {
            if (!tagEndpointMap[tag]) tagEndpointMap[tag] = [];
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
    return { ...swaggerConfig, paths: filteredPaths };
  };

useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        background-color: #191932; /* Lebih gelap agar teks lebih jelas */
        color: #ffffff;
        font-family: 'Inter', sans-serif;
      }

      .swagger-ui .info .title {
        color: #ffffff !important;
        font-size: 24px;
        font-weight: bold;
      }

      .swagger-ui .info p {
        color: #ffffff !important;
      }

      .swagger-ui .topbar {
        background: #22224a;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      }

      /* Kategori API */
      .api-category {
        background: #24244a;
        border: 1px solid #3c3c7a;
        padding: 16px;
        margin-bottom: 12px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .api-category:hover {
        background: #303060;
      }

      .api-category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
      }

      .api-category-content {
        display: none;
        padding-top: 10px;
      }

      .api-category.expanded .api-category-content {
        display: block;
      }

      /* Tombol */
      .swagger-ui button {
        background: #5f5fcd;
        color: white;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: bold;
        transition: all 0.3s ease;
      }

      .swagger-ui button:hover {
        background: #7676e0;
      }

      /* Input dan Textarea */
      .swagger-ui input, .swagger-ui textarea {
        background-color: #2d2d55;
        color: #fff;
        border: 1px solid #7777cc;
        border-radius: 8px;
        padding: 10px;
      }

      /* Endpoint Card */
      .api-endpoint {
        background: #29294d;
        border: 1px solid #4a4a8a;
        padding: 14px;
        border-radius: 10px;
        margin-bottom: 10px;
      }

      .api-endpoint:hover {
        border-color: #6c6cff;
      }

      .api-endpoint-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        color: #ffffff;
      }

      .api-endpoint-method {
        font-weight: bold;
        color: #32cd32;
        background: #3a5f3a;
        padding: 4px 8px;
        border-radius: 6px;
      }

      .api-endpoint-path {
        font-weight: 600;
        color: #f8f8ff;
      }

      /* Teks dalam API kategori */
      .api-category-content p {
        color: #ffffff !important;
      }

      /* Memperjelas teks di Swagger UI */
      .swagger-ui .opblock-summary-description {
        color: #ffffff !important;
      }

      .swagger-ui .opblock-summary-method {
        font-weight: bold;
        color: #ffffff !important;
      }

      .swagger-ui .opblock-summary-path {
        color: #f8f8ff !important;
      }

      .swagger-ui .response-col_status {
        color: #ffffff !important;
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
      </Head>
      <main className="p-6">
        <div className="shadow-lg rounded-lg p-4">
          {loading ? (
            <p>Memuat endpoint...</p>
          ) : (
            Object.keys(endpointsByTag).map((tag) => (
              <div
                key={tag}
                className={`api-category ${expandedTag === tag ? "expanded" : ""}`}
              >
                <div className="api-category-header" onClick={() => toggleCategory(tag)}>
                  <span>{`# ${tag.toUpperCase()}`}</span>
                  <span>{`${endpointsByTag[tag].length} endpoint`}</span>
                  <span className="icon">
                    {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>
                <div className="api-category-content">
                  {expandedTag === tag && (
                    <SwaggerUI key={tag} spec={getFilteredSpec(tag)} />
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