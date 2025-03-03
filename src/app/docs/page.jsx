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
        background-color: #0f0f1a;
        color: #e0e0e0;
        font-family: 'Inter', sans-serif;
      }

      .swagger-ui .info .title {
        color: #fff !important;
        font-size: 24px;
        font-weight: bold;
      }

      .swagger-ui .topbar {
        background: linear-gradient(135deg, #1a1b2f, #14152a);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      /* Kategori API */
      .api-category {
        background: #17172b;
        border: 1px solid #24243e;
        padding: 16px;
        margin-bottom: 12px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .api-category:hover {
        background: #202040;
      }

      .api-category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        color: #b0b0ff;
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
        background: linear-gradient(135deg, #6a5acd, #8a2be2);
        color: white;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: bold;
        transition: all 0.3s ease;
      }

      .swagger-ui button:hover {
        background: linear-gradient(135deg, #8a2be2, #9932cc);
      }

      /* Input dan Textarea */
      .swagger-ui input, .swagger-ui textarea {
        background-color: #1d1e33;
        color: #fff;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 10px;
      }

      /* Endpoint Card */
      .api-endpoint {
        background: #202040;
        border: 1px solid #2a2a4a;
        padding: 14px;
        border-radius: 10px;
        margin-bottom: 10px;
      }

      .api-endpoint:hover {
        border-color: #4c4cff;
      }

      .api-endpoint-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
      }

      .api-endpoint-method {
        font-weight: bold;
        color: #32cd32;
        background: #224422;
        padding: 4px 8px;
        border-radius: 6px;
      }

      .api-endpoint-path {
        font-weight: 600;
        color: #ffffff;
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