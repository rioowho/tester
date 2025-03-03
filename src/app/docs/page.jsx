"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
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

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        background-color: #191932;
        color: #ffffff;
        font-family: 'Inter', sans-serif;
      }

      .container {
        max-width: 600px;
        margin: auto;
        padding: 20px;
      }

      .api-category {
        background: #24244a;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        width: 100%;
      }

      .api-category span {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
      }

      .api-category .icon {
        font-size: 14px;
        color: #ffffff;
      }

      .api-endpoint {
        background: #29294d;
        border-radius: 10px;
        padding: 12px;
        margin-top: 8px;
        border: 1px solid #4a4a8a;
      }

      .api-endpoint-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #ffffff;
      }

      .api-endpoint-method {
        font-weight: bold;
        padding: 4px 8px;
        border-radius: 6px;
        text-transform: uppercase;
      }

      .api-endpoint-method.GET { background: #28a745; color: white; }
      .api-endpoint-method.POST { background: #007bff; color: white; }
      .api-endpoint-method.PUT { background: #ffc107; color: black; }
      .api-endpoint-method.DELETE { background: #dc3545; color: white; }
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
      <main className="container">
        {loading ? (
          <p>Memuat kategori...</p>
        ) : (
          Object.keys(endpointsByTag).map((tag) => (
            <div key={tag}>
              {/* Kategori API */}
              <div className="api-category" onClick={() => toggleCategory(tag)}>
                <div className="api-category-header">
                  <span>{tag.toUpperCase()}</span>
                  <span>{endpointsByTag[tag].length} endpoint</span>
                  <span className="icon">
                    {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>
              </div>

              {/* Daftar Endpoint (Tampil jika kategori diklik) */}
              {expandedTag === tag && (
                <div>
                  {endpointsByTag[tag].map((endpoint, index) => (
                    <div key={index} className="api-endpoint">
                      <div className="api-endpoint-header">
                        <span className={`api-endpoint-method ${endpoint.method}`}>
                          {endpoint.method}
                        </span>
                        <span>{endpoint.path}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#cccccc" }}>
                        {endpoint.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </>
  );
}