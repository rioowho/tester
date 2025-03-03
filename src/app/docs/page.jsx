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
                        <span className={`api-endpoint-method ${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <span className="endpoint-path">{endpoint.path}</span>
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
                      value={inputFields[param.name] || ""}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <p className="no-input">Endpoint ini tidak memerlukan input.</p>
              )}
              <div className="modal-buttons">
                <button className="transparent-btn" onClick={() => setShowInput(false)}>Tutup</button>
                <button className="transparent-btn" onClick={handleApiRequest}>Kirim</button>
              </div>
            </div>
          </div>
        )}

        {apiResponse && (
          <div className="response-box">
            <h3>Hasil Response</h3>
            <pre className="response-text">{JSON.stringify(apiResponse, null, 2)}</pre>
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
          background: linear-gradient(135deg, #4c6ef5, #6574cd);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          margin-bottom: 10px;
          transition: all 0.3s ease-in-out;
          color: white;
        }

        .api-category:hover {
          background: #5050a1;
        }

        .response-text {
          word-wrap: break-word;
          white-space: pre-wrap;
          max-width: 100%;
          overflow-x: auto;
        }

        .modal-content .input-group {
          margin-bottom: 12px;
        }

        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .transparent-btn {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 10px 15px;
          cursor: pointer;
          border-radius: 8px;
        }

        .transparent-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}