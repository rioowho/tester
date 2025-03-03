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
      background-color: #0d1117;
      color: #c9d1d9;
      font-family: 'Inter', sans-serif;
    }

    .swagger-ui .info .title,
    .swagger-ui .opblock-summary-method,
    .swagger-ui .opblock-summary-path,
    .swagger-ui .model-title {
      color: #ffffff !important;
    }

    .swagger-ui .topbar {
      background-color: #161b22;
      padding: 12px 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
    }

    .swagger-ui .topbar a {
      color: #58a6ff;
      font-weight: bold;
      text-decoration: none;
    }

    .api-category {
      background-color: #161b22;
      border: 1px solid #30363d;
      padding: 16px;
      margin-bottom: 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .api-category:hover {
      background-color: #21262d;
      border-color: #484f58;
    }

    .api-category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #f0f6fc;
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
      color: #8b949e;
      transition: transform 0.3s ease;
    }

    .api-category.expanded .api-category-header .icon {
      transform: rotate(180deg);
    }

    .api-endpoint {
      background-color: #0d1117;
      border: 1px solid #30363d;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }

    .api-endpoint:hover {
      border-color: #484f58;
    }

    .api-endpoint-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
    }

    .api-endpoint-method {
      font-weight: bold;
      color: #ff7b72;
    }

    .api-endpoint-path {
      font-weight: 600;
      color: #f0f6fc;
    }

    .swagger-ui input[type="text"],
    .swagger-ui input[type="password"],
    .swagger-ui select,
    .swagger-ui textarea {
      background-color: #161b22;
      color: #f0f6fc;
      border-color: #30363d;
      border-radius: 6px;
    }

    .swagger-ui button {
      background-color: #238636;
      color: white;
      border-radius: 6px;
    }

    .swagger-ui button:hover {
      background-color: #2ea043;
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
        <title>VelynAPI - Dokumentasi</title>
        <meta name="title" content="VelynAPI - Dokumentasi" />
        <meta name="description" content="Dokumentasi lengkap VelynAPI yang menyediakan berbagai layanan API gratis." />
        <meta name="keywords" content="API, VelynAPI, Dokumentasi API, Free API, AI API" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English, Indonesian" />
        <meta property="og:title" content="VelynAPI - Dokumentasi" />
        <meta property="og:description" content="Dokumentasi lengkap VelynAPI yang menyediakan berbagai layanan API gratis." />
        <meta property="og:url" content="https://velynapi.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://your-image-url.com/logo.png" />
      </Head>

      <main className={`p-6`}>
        <div className="bg-black shadow-md rounded-lg p-4">
          {loading ? (
            <p>Memuat endpoint...</p>
          ) : (
            Object.keys(endpointsByTag).map((tag) => (
              <div key={tag} className={`api-category ${expandedTag === tag ? "expanded" : ""}`}>
                <div className="api-category-header" onClick={() => toggleCategory(tag)}>
                  <span>{`# ${tag.toUpperCase()}`}</span>
                  <span className="icon">
                    {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>
                <div className="api-category-content">
                  {expandedTag === tag && <SwaggerUI key={tag} spec={getFilteredSpec(tag)} />}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}