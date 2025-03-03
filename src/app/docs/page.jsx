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
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const endpointsMap = calculateEndpointsByTag(swaggerConfig);
    setEndpointsByTag(endpointsMap);
    setTotalEndpoints(
      Object.values(endpointsMap).reduce((sum, endpoints) => sum + endpoints.length, 0)
    );
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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

  const closeModal = () => {
    setInputFields({});
    setShowInput(false);
  };

  const handleInputChange = (param, value) => {
    setInputFields((prev) => ({ ...prev, [param]: value }));
  };

  const handleApiRequest = async () => {
    if (!selectedEndpoint) return;

    let finalUrl = selectedEndpoint.path;
    Object.keys(inputFields).forEach((param) => {
      finalUrl = finalUrl.replace(`{${param}}`, inputFields[param]);
    });

    const options = {
      method: selectedEndpoint.method,
      headers: { "Content-Type": "application/json" },
    };

    if (selectedEndpoint.method === "POST") {
      options.body = JSON.stringify(inputFields);
    }

    try {
      const response = await fetch(finalUrl, options);
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: "Gagal mengambil data. Periksa kembali input yang dimasukkan." });
    }

    setInputFields({});
    setShowInput(false);
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
                <span className="icon">{expandedTag === tag ? "▼" : ">"}</span>
              </div>

              {expandedTag === tag && (
                <div className="endpoints-container">
                  {endpointsByTag[tag].map((endpoint, index) => (
                    <div key={index} className="api-endpoint">
                      <div className="api-endpoint-header">
                        <span className={`api-method ${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <span className="endpoint-path">📌 {endpoint.path}</span>
                        <button
                          className="endpoint-btn"
                          onClick={() => openInputModal(endpoint)}
                        >
                          ➜
                        </button>
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
          <div className="floating-modal">
            <div className="modal-content">
              <h3>Masukkan Data</h3>
              {selectedEndpoint.parameters.length > 0 ? (
                selectedEndpoint.parameters.map((param) => (
                  <div key={param.name} className="input-group">
                    <label>{param.name}</label>
                    <input
                      type="text"
                      placeholder={`Masukkan ${param.name}`}
                      value={inputFields[param.name] || ""}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <p className="no-input">Endpoint ini tidak memerlukan input.</p>
              )}
              <div className="floating-buttons">
                <button className="bubble-button" onClick={closeModal}>Tutup</button>
                <button className="bubble-button" onClick={handleApiRequest}>Kirim</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .api-endpoint {
          background: #3b0971;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 15px;
          transition: all 0.3s ease-in-out;
        }

        .api-method.get {
          color: #1e90ff;
        }

        .api-method.post {
          color: #32cd32;
        }

        .bubble-button {
          background: #5a189a;
          color: white;
          padding: 12px 20px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease-in-out;
        }

        .bubble-button:hover {
          transform: scale(1.05);
        }

        .floating-modal {
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .modal-content {
          background: #3a0ca3;
          padding: 20px;
          border-radius: 12px;
          animation: bubble 0.5s ease-out;
        }

        @keyframes bubble {
          from {
            transform: scale(0.8);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}