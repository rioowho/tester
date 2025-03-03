"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaChevronRight, FaChevronDown, FaExternalLinkAlt } from "react-icons/fa";
import swaggerConfig from "../swagger-config.json";

export default function Home() {
  const [endpointsByTag, setEndpointsByTag] = useState({});
  const [expandedTag, setExpandedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalEndpoints, setTotalEndpoints] = useState(0);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [apiResult, setApiResult] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const endpointsMap = calculateEndpointsByTag(swaggerConfig);
      
      if (Object.keys(endpointsMap).length > 0) {
        const total = Object.values(endpointsMap).reduce(
          (sum, endpoints) => sum + endpoints.length,
          0
        );
        setTotalEndpoints(total);
      } else {
        setTotalEndpoints(0);
      }

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

  const handleInputSubmit = () => {
    if (selectedEndpoint && inputValue.trim() !== "") {
      // Simulasi hasil API berdasarkan input
      setApiResult({
        status: true,
        creator: "VelynTeam",
        data: `Hasil dari input "${inputValue}" pada endpoint ${selectedEndpoint.path}`,
      });

      // Reset input setelah submit
      setTimeout(() => {
        setInputValue("");
      }, 500);
    }
  };

  return (
    <>
      <Head>
        <title>VelynAPI</title>
      </Head>
      <main className="container mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold">VelynAPI Documentation</h1>
        <p className="text-sm mt-2 mb-4">Total API Endpoint: {totalEndpoints}</p>

        {loading ? (
          <p>Memuat kategori...</p>
        ) : (
          Object.keys(endpointsByTag).map((tag) => (
            <div key={tag} className="mb-4">
              {/* Kategori API */}
              <div
                className="bg-blue-900 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-blue-800"
                onClick={() => toggleCategory(tag)}
              >
                <span className="font-semibold">{tag.toUpperCase()} ENDPOINT</span>
                <span>{endpointsByTag[tag].length} endpoint</span>
                {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
              </div>

              {/* Daftar Endpoint */}
              {expandedTag === tag && (
                <div className="mt-2">
                  {endpointsByTag[tag].map((endpoint, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg mt-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-bold px-2 py-1 rounded ${endpoint.method === "GET" ? "bg-green-600" : "bg-red-600"}`}>
                          {endpoint.method}
                        </span>
                        <span>{endpoint.path}</span>
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => setSelectedEndpoint(endpoint)}
                        >
                          <FaExternalLinkAlt />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Input dan Hasil API */}
        {selectedEndpoint && (
          <div className="bg-gray-900 p-4 rounded-lg mt-6">
            <h2 className="text-lg font-semibold mb-2">Masukkan Input untuk {selectedEndpoint.path}</h2>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan teks..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="mt-3 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
              onClick={handleInputSubmit}
            >
              Submit
            </button>

            {/* Hasil API */}
            {apiResult && (
              <div className="bg-black p-3 rounded mt-4 text-sm text-gray-300">
                <pre>{JSON.stringify(apiResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <footer className="text-center text-gray-500 text-sm mt-10">
          VelynTeam © All rights reserved 2025.
        </footer>
      </main>
    </>
  );
}