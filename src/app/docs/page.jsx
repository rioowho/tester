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
      background: linear-gradient(180deg, #0f0f10, #1a1a1e);
      color: #e0e0e0;
      font-family: 'Inter', sans-serif;
    }

    .swagger-ui {
      max-width: 900px;
      margin: auto;
      padding: 20px;
    }

    .swagger-ui .topbar {
      background: #111;
      border-bottom: 1px solid #222;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .swagger-ui .info {
      background: #1a1a1e;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    .swagger-ui .info .title {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }

    .api-category {
      background: #1e1e24;
      border: 1px solid #333;
      padding: 16px;
      margin-bottom: 16px;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .api-category:hover {
      background: #25252b;
    }

    .api-category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      cursor: pointer;
    }

    .api-category-content {
      padding-top: 12px;
    }

    .api-endpoint {
      background: #24242b;
      border: 1px solid #3a3a42;
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
      background: #008080;
      color: white;
      padding: 4px 10px;
      border-radius: 5px;
      text-transform: uppercase;
    }

    .api-endpoint-path {
      font-weight: 600;
      color: #ffffff;
    }

    .swagger-ui input[type="text"],
    .swagger-ui input[type="password"],
    .swagger-ui select,
    .swagger-ui textarea {
      background: #2a2a30;
      color: #ffffff;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 10px;
    }

    .swagger-ui button {
      background: #6d4aff;
      color: white;
      border-radius: 6px;
      padding: 10px 16px;
      font-weight: bold;
    }

    .swagger-ui button:hover {
      background: #7a5aff;
    }

    .swagger-ui .opblock {
      background: #1f1f24;
      border-radius: 10px;
      padding: 16px;
      border: 1px solid #292930;
    }

    .swagger-ui .opblock-summary {
      background: #252530;
      border-radius: 6px;
      padding: 12px;
      font-weight: bold;
    }

    .swagger-ui .response {
      background: #18181e;
      padding: 10px;
      border-radius: 8px;
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
      </Head>
      <main className="p-6">
        <div className="bg-black shadow-md rounded-lg p-4">
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