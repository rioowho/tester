"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import swaggerConfig from "../swagger-config.json";

export default function Home() {
  const [endpointsByTag, setEndpointsByTag] = useState({});
  const [expandedTag, setExpandedTag] = useState(null);
  const [totalEndpoints, setTotalEndpoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [inputFields, setInputFields] = useState({});

  useEffect(() => {
    setTimeout(() => {
      const endpointsMap = calculateEndpointsByTag(swaggerConfig);
      setEndpointsByTag(endpointsMap);
      setTotalEndpoints(
        Object.values(endpointsMap).reduce((sum, endpoints) => sum + endpoints.length, 0)
      );
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
              parameters: operation.parameters || [],
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

  const openInputModal = (endpoint) => {
    const defaultInputs = {};
    endpoint.parameters.forEach((param) => {
      defaultInputs[param.name] = "";
    });
    setInputFields(defaultInputs);
    setSelectedEndpoint(endpoint);
    setShowInput(true);
  };

  const handleInputChange = (param, value) => {
    setInputFields((prev) => ({ ...prev, [param]: value }));
  };

  return (
    <>
      <Head>
        <title>VelynAPI</title>
      </Head>
      <main className="container">
        <h1 className="title">VelynAPI Documentation</h1>
        <p className="total-endpoints">Total API Endpoints: {totalEndpoints}</p>

        {loading ? (
          <p className="loading-text">Memuat kategori...</p>
        ) : (
          Object.keys(endpointsByTag).map((tag) => (
            <div key={tag} className="category-wrapper">
              <div className="api-category" onClick={() => toggleCategory(tag)}>
                <span>{tag.toUpperCase()}</span>
                <span className="category-count">{endpointsByTag[tag].length} endpoints</span>
                <span className="icon">{expandedTag === tag ? "<" : ">"}</span>
              </div>

              {expandedTag === tag && (
                <div className="endpoints-container">
                  {endpointsByTag[tag].map((endpoint, index) => (
                    <div key={index} className="api-endpoint">
                      <div className="api-endpoint-header">
                        <span className={`api-endpoint-method ${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <span className="endpoint-path">{endpoint.path}</span>
                        <span
                          className="endpoint-icon"
                          onClick={() => openInputModal(endpoint)}
                          title="Masukkan data untuk endpoint ini"
                        >
                          {">"}
                        </span>
                      </div>
                      <p className="endpoint-description">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {showInput && selectedEndpoint && (
          <div className="modal">
            <div className="modal-content">
              <h3>Masukkan Data</h3>
              {selectedEndpoint.parameters.length > 0 ? (
                selectedEndpoint.parameters.map((param) => (
                  <div key={param.name} className="input-group">
                    <label>{param.name}</label>
                    <input
                      type="text"
                      placeholder={`Masukkan ${param.name}`}
                      value={inputFields[param.name]}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <p className="no-input">Endpoint ini tidak memerlukan input.</p>
              )}
              <div className="button-group">
                <button className="close-btn" onClick={() => setShowInput(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          max-width: 700px;
          margin: auto;
          padding: 20px;
        }

        .api-category {
          background: #1e1e40;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .endpoints-container {
          padding: 15px;
          background: #22224a;
          border-radius: 8px;
          margin-top: 10px;
        }

        .api-endpoint {
          background: #2c2c5a;
          border-radius: 10px;
          padding: 12px;
          margin-top: 15px;
        }

        .api-endpoint-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
        }

        .api-endpoint-method {
          font-weight: bold;
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
        }

        .api-endpoint-method.get { background: #28a745; }
        .api-endpoint-method.post { background: #007bff; }
        .api-endpoint-method.put { background: #ffc107; color: black; }
        .api-endpoint-method.delete { background: #dc3545; }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: #1e1e40;
          padding: 20px;
          border-radius: 10px;
          width: 90%;
          max-width: 400px;
          text-align: center;
        }

        .input-group {
          margin-bottom: 12px;
          text-align: left;
        }

        .input-group label {
          display: block;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .input-group input {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          background: #3a2351; /* Warna ungu gelap */
          color: white;
        }

        .close-btn {
          background: #dc3545;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}