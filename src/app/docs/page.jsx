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
  const [inputData, setInputData] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showInput, setShowInput] = useState(false);

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

  const handleInputSubmit = async () => {
    if (!inputData || !selectedEndpoint) return;

    const finalUrl = selectedEndpoint.path.replace("{input}", inputData); // Ganti {input} dengan data user

    try {
      const response = await fetch(finalUrl, { method: selectedEndpoint.method });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: "Gagal mengambil data. Periksa kembali input yang dimasukkan." });
    }
  };

  return (
    <>
      <Head>
        <title>VelynAPI</title>
      </Head>
      <main className="container">
        <h1 className="title">VelynAPI Documentation</h1>

        {/* Menampilkan total endpoint */}
        <p className="total-endpoints">Total API Endpoint: {totalEndpoints}</p>

        {loading ? (
          <p className="loading-text">Memuat kategori...</p>
        ) : (
          Object.keys(endpointsByTag).map((tag) => (
            <div key={tag} className="category-wrapper">
              {/* Kategori API */}
              <div className="api-category" onClick={() => toggleCategory(tag)}>
                <div className="api-category-header">
                  <span>{tag.toUpperCase()}</span>
                  <span className="category-count">{endpointsByTag[tag].length} endpoint</span>
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
                        <span
                          className="endpoint-link"
                          onClick={() => {
                            setShowInput(true);
                            setSelectedEndpoint(endpoint);
                          }}
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

        {/* Form Input Data */}
        {showInput && (
          <div className="modal">
            <div className="modal-content">
              <h3>Masukkan Data untuk Endpoint</h3>
              <input
                type="text"
                placeholder="Masukkan teks atau parameter"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
              <button onClick={handleInputSubmit}>Kirim</button>
              <button onClick={() => setShowInput(false)}>Tutup</button>
            </div>
          </div>
        )}

        {/* Menampilkan hasil API */}
        {apiResponse && (
          <div className="api-response">
            <h3>Hasil API:</h3>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
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
          margin-bottom: 10px;
        }

        .total-endpoints {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          color: #dddddd;
          margin-bottom: 20px;
        }

        .loading-text {
          text-align: center;
          font-size: 16px;
          color: #cccccc;
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
        }

        .api-category:hover {
          background: #21214d;
        }

        .endpoints-container {
          padding: 10px 15px;
          background: #1e1e40;
          border-radius: 8px;
          margin-top: 5px;
        }

        .api-endpoint {
          background: #22224a;
          border-radius: 10px;
          padding: 12px;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
        }

        .endpoint-link {
          color: #00bfff;
          cursor: pointer;
          margin-left: 10px;
          font-size: 14px;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: #22224a;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }

        .api-response {
          margin-top: 20px;
          background: #1e1e40;
          padding: 10px;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}