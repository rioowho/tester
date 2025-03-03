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

      .swagger-ui {
        background-color: #1e1e1e;
        padding: 20px;
        border-radius: 8px;
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

      .api-category {
        background-color: #242424;
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
        padding-top: 12px;
        animation: fadeIn 0.3s ease-in-out;
      }

      .icon {
        font-size: 20px;
        color: #cccccc;
        transition: transform 0.3s ease;
      }

      .api-category.expanded .icon {
        transform: rotate(180deg);
      }

      .api-endpoint {
        background-color: #2a2a2a;
        border: 1px solid #444;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 10px;
        transition: all 0.3s ease-in-out;
      }

      .api-endpoint:hover {
        background-color: #333;
        border-color: #666;
      }

      .api-endpoint-method {
        font-weight: bold;
        color: #ffa500;
      }

      .api-endpoint-path {
        font-weight: 600;
        color: #ffffff;
      }

      .swagger-ui input,
      .swagger-ui select,
      .swagger-ui textarea {
        background-color: #2a2a2a;
        color: #ffffff;
        border: 1px solid #444;
        border-radius: 6px;
      }

      .swagger-ui button {
        background-color: #ff7f50;
        color: white;
        border-radius: 6px;
        transition: background 0.3s ease;
      }

      .swagger-ui button:hover {
        background-color: #ff9c68;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
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
        <meta name="description" content="VelynAPI - Dokumentasi API yang keren dengan tampilan dark mode." />
      </Head>
      <main className="p-6">
        <div className="bg-black shadow-md rounded-lg p-4">
          {loading ? (
            <p className="text-center text-white">Memuat endpoint...</p>
          ) : (
            Object.keys(endpointsByTag).map((tag) => (
              <div key={tag} className={`api-category ${expandedTag === tag ? "expanded" : ""}`}>
                <div className="api-category-header" onClick={() => toggleCategory(tag)}>
                  <span>{`# ${tag.toUpperCase()}`}</span>
                  <span>{`${endpointsByTag[tag].length} endpoint`}</span>
                  <span className="icon">
                    {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>
                {expandedTag === tag && (
                  <div className="api-category-content">
                    <SwaggerUI key={tag} spec={getFilteredSpec(tag)} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}