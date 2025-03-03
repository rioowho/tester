"use client";
import swaggerConfig from "../swagger-config.json";
import React, { useState, useEffect } from "react";
import axios from "axios";

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
    const calculateEndpointsByTag = (swaggerData) => {
      const tagEndpointMap = {};
      if (!swaggerData?.paths) return tagEndpointMap;

      Object.entries(swaggerData.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, operation]) => {
          if (!operation?.tags) return;

          operation.tags.forEach((tag) => {
            if (!tagEndpointMap[tag]) tagEndpointMap[tag] = [];
            tagEndpointMap[tag].push({
              method: method.toUpperCase(),
              path,
              description: operation?.description || "Deskripsi tidak tersedia",
              parameters: operation?.parameters || [],
              serverUrl: swaggerData.servers?.[0]?.url || "",
            });
          });
        });
      });

      return tagEndpointMap;
    };

    const endpointsMap = calculateEndpointsByTag(swaggerConfig);
    setEndpointsByTag(endpointsMap);

    const total = Object.values(endpointsMap).reduce(
      (sum, endpoints) => sum + endpoints.length,
      0
    );
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
    setApiResponse(null);
  };

  const closeModal = () => {
    setInputFields({});
    setApiResponse(null);
    setShowInput(false);
  };

  const handleApiRequest = async () => {
    if (!selectedEndpoint) return;
    let baseUrl = selectedEndpoint.serverUrl.replace(/\/$/, "");
    let endpointPath = selectedEndpoint.path.replace(/^\//, "");
    let finalUrl = selectedEndpoint.path.startsWith("http")
      ? selectedEndpoint.path
      : `${baseUrl}/${endpointPath}`;

    // Menangani parameter path
    Object.keys(inputFields).forEach((param) => {
      finalUrl = finalUrl.replace(`{${param}}`, encodeURIComponent(inputFields[param] || ""));
    });

    // Menangani parameter query
    const queryParams = [];
    Object.keys(inputFields).forEach((param) => {
      if (!finalUrl.includes(`{${param}}`)) {
        queryParams.push(`${param}=${encodeURIComponent(inputFields[param] || "")}`);
      }
    });

    if (queryParams.length > 0) {
      finalUrl += (finalUrl.includes("?") ? "&" : "?") + queryParams.join("&");
    }

    if (/\{.*?\}/.test(finalUrl)) {
      setApiResponse({ error: "Ada parameter dalam URL yang belum diisi." });
      return;
    }

    setApiResponse({ debugUrl: finalUrl, status: "Fetching..." });

    try {
      const response = await axios.get(finalUrl, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      setApiResponse(response.data);
    } catch (error) {
      console.error("API Request Error:", error);
      setApiResponse({ error: error.message || "Gagal mengambil data dari API." });
    }
    setInputFields({});
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(apiResponse.data, null, 2))
      .then(() => alert("Data berhasil disalin!"))
      .catch((err) => console.error("Gagal menyalin: ", err));
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(apiResponse.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "api-response.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Your JSX Structure */}
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>Total Endpoints: {totalEndpoints}</h2>
            <div>
              {Object.entries(endpointsByTag).map(([tag, endpoints]) => (
                <div key={tag}>
                  <button onClick={() => toggleCategory(tag)}>
                    {tag}
                  </button>
                  {expandedTag === tag && (
                    <div>
                      {endpoints.map((endpoint, index) => (
                        <div key={index}>
                          <button onClick={() => openInputModal(endpoint)}>
                            {endpoint.method} {endpoint.path}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showInput && selectedEndpoint && (
        <div>
          <h3>Input Parameters for {selectedEndpoint.method} {selectedEndpoint.path}</h3>
          <form>
            {selectedEndpoint.parameters.map((param) => (
              <div key={param.name}>
                <label>{param.name}</label>
                <input
                  type="text"
                  value={inputFields[param.name] || ""}
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      [param.name]: e.target.value
                    })
                  }
                />
              </div>
            ))}
          </form>
          <button onClick={handleApiRequest}>Kirim</button>
          <button onClick={closeModal}>Tutup</button>
        </div>
      )}

      {apiResponse && (
  <div>
    {apiResponse?.debugUrl && (
      <p>
        <strong>Debug URL:</strong> {apiResponse.debugUrl}
      </p>
    )}
    {apiResponse?.status && <p>{apiResponse.status}</p>}
    {apiResponse?.error && <p style={{ color: "red" }}>{apiResponse.error}</p>}
    {apiResponse?.data && (
      <div>
        <pre>{JSON.stringify(apiResponse.data, null, 2)}</pre>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    )}
  </div>
)}

<style jsx>{`
  /* =============================
      STYLING UNTUK ENDPOINT 
  ============================= */
  .endpoint {
    background: #2d1b55;
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
    background: #007bff;
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

  /* =============================
      MODAL INPUT STYLING
  ============================= */
  .floating-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(45, 27, 85, 0.95);
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

  /* =============================
      HASIL API RESPONSE 
  ============================= */
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
