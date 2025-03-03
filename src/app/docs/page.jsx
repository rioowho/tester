"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaChevronRight, FaChevronDown, FaExternalLinkAlt } from "react-icons/fa";
import swaggerConfig from "../swagger-config.json";

export default function Home() {
  const [endpointsByTag, setEndpointsByTag] = useState({});
  const [expandedTag, setExpandedTag] = useState(null);
  const [totalEndpoints, setTotalEndpoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inputFields, setInputFields] = useState({});
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [showFullResponse, setShowFullResponse] = useState(false);

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

  const handleInputSubmit = async () => {
    if (!selectedEndpoint) return;

    let finalUrl = selectedEndpoint.path;
    Object.keys(inputFields).forEach((param) => {
      finalUrl = finalUrl.replace(`{${param}}`, inputFields[param]);
    });

    try {
      const response = await fetch(finalUrl, { method: selectedEndpoint.method });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: "Gagal mengambil data. Periksa kembali input yang dimasukkan." });
    }

    // Setelah submit, tutup modal input
    setShowInput(false);
  };

  return (
    <>
      <Head>
        <title>VelynAPI</title>
      </Head>
      <main className="container">
        <h1 className="title">VelynAPI Documentation</h1>
        <p className="total-endpoints">Total API Endpoint: {totalEndpoints}</p>

        {loading ? (
          <p className="loading-text">Memuat kategori...</p>
        ) : (
          Object.keys(endpointsByTag).map((tag) => (
            <div key={tag} className="category-wrapper">
              <div className="api-category" onClick={() => toggleCategory(tag)}>
                <span>{tag.toUpperCase()}</span>
                <span className="category-count">{endpointsByTag[tag].length} endpoint</span>
                <span className="icon">
                  {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </div>

              {expandedTag === tag && (
                <div className="endpoints-container">
                  {endpointsByTag[tag].map((endpoint, index) => (
                    <div key={index} className="api-endpoint">
                      <div className="api-endpoint-header">
                        <span className={`api-endpoint-method ${endpoint.method}`}>
                          {endpoint.method}
                        </span>
                        <span className="endpoint-path">{endpoint.path}</span>
                        <span
                          className="endpoint-link"
                          onClick={() => openInputModal(endpoint)}
                          title="Masukkan data untuk endpoint ini"
                        >
                          <FaExternalLinkAlt />
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
              <h3>Masukkan Data untuk Endpoint</h3>
              {selectedEndpoint.parameters.length > 0 ? (
                selectedEndpoint.parameters.map((param) => (
                  <div key={param.name}>
                    <label>{param.name}:</label>
                    <input
                      type="text"
                      placeholder={`Masukkan ${param.name}`}
                      value={inputFields[param.name]}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <p>Endpoint ini tidak memerlukan input.</p>
              )}
              <button className="submit-btn" onClick={handleInputSubmit}>
                Kirim
              </button>
              <button className="close-btn" onClick={() => setShowInput(false)}>
                Tutup
              </button>
            </div>
          </div>
        )}

        {apiResponse && (
          <div className="api-response">
            <h3>Hasil API:</h3>
            <pre>
              {showFullResponse
                ? JSON.stringify(apiResponse, null, 2)
                : JSON.stringify(apiResponse, null, 2).slice(0, 200)}
            </pre>
            {JSON.stringify(apiResponse).length > 200 && (
              <button onClick={() => setShowFullResponse(!showFullResponse)}>
                {showFullResponse ? "Sembunyikan" : "Tampilkan Semua"}
              </button>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
        }

        .api-category {
          background: #1e1e40;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .endpoints-container {
          padding: 10px;
          background: #22224a;
          border-radius: 8px;
          margin-top: 5px;
        }

        .api-endpoint {
          background: #2c2c5a;
          border-radius: 10px;
          padding: 12px;
          margin-top: 10px;
        }
      `}</style>
    </>
  );
}