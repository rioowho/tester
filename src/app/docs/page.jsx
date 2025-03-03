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

  return (
    <>
      <Head>
        <title>VelynAPI</title>
      </Head>
      <main className="container">
        <h1 className="title">VelynAPI Documentation</h1>
        
        {loading ? (
          <p className="loading-text">Memuat kategori...</p>
        ) : (
          Object.keys(endpointsByTag).map((tag) => (
            <div key={tag} className="category-wrapper">
              {/* Kategori API */}
              <div className="api-category" onClick={() => toggleCategory(tag)}>
                <div className="api-category-header">
                  <span>{tag.toUpperCase()}</span>
                  <span className="icon">
                    {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>
              </div>

              {/* Daftar Endpoint (Tampil jika kategori diklik) */}
              {expandedTag === tag && (
                <div className="endpoints-container">
                  {endpointsByTag[tag].map((endpoint, index) => (
                    <div key={index} className="api-endpoint">
                      <div className="api-endpoint-header">
                        <span className={`api-endpoint-method ${endpoint.method}`}>
                          {endpoint.method}
                        </span>
                        <span className="endpoint-path">{endpoint.path}</span>
                      </div>
                      <p className="endpoint-description">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </main>

      {/* CSS Styling */}
      <style jsx>{`
        body {
          background-color: #0d0d1f;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
        }

        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
        }

        .loading-text {
          text-align: center;
          font-size: 16px;
          color: #cccccc;
        }

        .category-wrapper {
          margin-bottom: 16px;
        }

        .api-category {
          background: #16163a;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .api-category:hover {
          background: #21214d;
        }

        .api-category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .api-category .icon {
          font-size: 18px;
          color: #ffffff;
        }

        .endpoints-container {
          padding: 10px 15px;
          background: #1e1e40;
          border-radius: 8px;
          margin-top: 5px;
          animation: fadeIn 0.3s ease-in-out;
        }

        .api-endpoint {
          background: #22224a;
          border-radius: 10px;
          padding: 12px;
          margin-top: 10px;
          border: 1px solid #4a4a8a;
          transition: all 0.3s ease;
        }

        .api-endpoint:hover {
          background: #29295b;
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
          padding: 5px 10px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .api-endpoint-method.GET { background: #28a745; color: white; }
        .api-endpoint-method.POST { background: #007bff; color: white; }
        .api-endpoint-method.PUT { background: #ffc107; color: black; }
        .api-endpoint-method.DELETE { background: #dc3545; color: white; }

        .endpoint-path {
          font-size: 14px;
          font-weight: bold;
        }

        .endpoint-description {
          font-size: 12px;
          color: #cccccc;
          margin-top: 5px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}