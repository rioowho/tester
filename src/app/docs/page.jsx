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

  const calculateEndpointsByTag = (swaggerData) => {
    const tagEndpointMap = {};
    if (!swaggerData?.paths) return tagEndpointMap;

    Object.keys(swaggerData.paths).forEach((path) => {
      Object.keys(swaggerData.paths[path]).forEach((method) => {
        const operation = swaggerData.paths[path][method];

        if (!operation?.tags) return;

        operation.tags.forEach((tag) => {
          if (!tagEndpointMap[tag]) tagEndpointMap[tag] = [];
          tagEndpointMap[tag].push({
            method: method.toUpperCase(),
            path,
            description: operation?.summary || "Deskripsi tidak tersedia",
            parameters: operation?.parameters || [],
          });
        });
      });
    });

    return tagEndpointMap;
  };

  useEffect(() => {
    const endpointsMap = calculateEndpointsByTag(swaggerConfig);
    setEndpointsByTag(endpointsMap);
    const total = Object.values(endpointsMap).reduce(
      (sum, endpoints) => sum + endpoints.length);
    setTotalEndpoints(total);

    setLoading(false);
  }, []);

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
  setApiResponse(null); 
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
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    setApiResponse(data);
  } catch (error) {
    setApiResponse({ error: error.message || "Gagal mengambil data." });
  }

  setInputFields({});
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
                <div className="endpoint">
                  {endpointsByTag[tag].map((endpoint, index) => (
                    <div key={index} className="api-endpoint">
                      <div className="endpoint-header">
                        <span className={`api-method ${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <span className="endpoint-path">{endpoint.path}</span>
                        <button className="endpoint-btn" onClick={() => openInputModal(endpoint)}>
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
      <button className="close-btn" onClick={closeModal}>✖</button>
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

{apiResponse !== null && (
  <div className="api-result">
    <h3>Response Body</h3>
    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2))}>
      Copy
    </button>
    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
    <button className="download-btn" onClick={() => {
      const blob = new Blob([JSON.stringify(apiResponse, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "api_response.json";
      a.click();
      URL.revokeObjectURL(url);
    }}>
      <i className="fas fa-download"></i> Download
    </button>
    <button className="clear-btn" onClick={clearApiResponse}>Hapus Result</button>
  </div>
)}
      </main>
<style jsx>{`
.endpoint {
    background: #2D1B55;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    color: white;
}

.api-endpoint {
    background: rgba(255, 255, 255, 0.1); 
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    color: white;
}

.api-endpoint:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.endpoint-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
}

.api-method {
    font-size: 0.9rem;
    font-weight: bold;
    padding: 0.3rem 0.6rem;
    border-radius: 0.5rem;
    text-transform: uppercase;
}

.api-method.get {
    background: #007bff; l
    color: white;
}

.api-method.post {
    background: #28a745;
    color: white;
}

.endpoint-path {
    flex-grow: 1;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.endpoint-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
}

.endpoint-btn:hover {
    color: white;
}

.endpoint-description {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
}

.floating-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(45, 27, 85, 0.95); /* Ungu gelap dengan transparansi */
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 500px;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -55%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}

.modal-content {
    text-align: center;
    color: white;
}

.modal-content h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
}

.input-group {
    margin-bottom: 1rem;
    text-align: left;
}

.input-group label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    color: rgba(255, 255, 255, 0.8);
}

.input-group input {
    width: 100%;
    padding: 0.8rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s ease-in-out;
}

.input-group input:focus {
    border-color: #a67aff;
    box-shadow: 0 0 8px rgba(166, 122, 255, 0.5);
}

.no-input {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
}

.floating-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}

.bubble-button {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    border: none;
    color: white;
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    border-radius: 2rem;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
    outline: none;
}

.bubble-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(106, 17, 203, 0.4);
}

.bubble-button:active {
    transform: scale(0.95);
    box-shadow: 0 4px 10px rgba(106, 17, 203, 0.4);
}

.bubble-button::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.bubble-button:hover::before {
    opacity: 1;
}

@media (max-width: 500px) {
    .floating-modal {
        width: 95%;
        padding: 1.5rem;
    }

    .bubble-button {
        font-size: 0.9rem;
        padding: 0.6rem 1.2rem;
    }
}
.loading-text {
    text-align: center;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 1rem 0;
    animation: fadeIn 0.5s ease-in-out infinite alternate;
}

@keyframes fadeIn {
    from {
        opacity: 0.5;
    }
    to {
        opacity: 1;
    }
}

.category-wrapper {
    margin-bottom: 1rem;
}

.api-category {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 0.75rem;
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background 0.2s ease-in-out, transform 0.2s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.api-category:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
}

.category-count {
    font-size: 0.9rem;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.8);
}

.icon {
    font-size: 1.2rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
    transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
}

.api-category:hover .icon {
    color: white;
}

@media (max-width: 500px) {
    .api-category {
        padding: 0.8rem;
    }
    
    .category-count {
        font-size: 0.8rem;
    }

    .icon {
        font-size: 1rem;
    }
}
.api-result {
  background-color: #1e1e1e;
  color: #dcdcdc;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
  overflow-x: auto;
  font-family: monospace;
  position: relative;
}

.copy-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 3px;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  margin-top: 10px;
  width: 100%;
}

.download-btn i {
  margin-right: 5px;
}

.copy-btn:hover {
  background: #0056b3;
}

.download-btn:hover {
  background: #218838;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.api-result h3 {
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: bold;
    color: #a67aff; 
}

.result-content {
    white-space: pre-wrap; 
    word-break: break-word;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    max-height: 300px; 
    overflow-y: auto;
}

.result-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 600px) {
    .api-result {
        padding: 1rem;
    }

    .result-content {
        font-size: 0.9rem;
        max-height: 250px;
    }
}
      `}</style>
    </>
  );
}
