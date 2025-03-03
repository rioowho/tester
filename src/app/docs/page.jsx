"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import swaggerConfig from "../swagger-config.json";

export default function Home() {
  const [endpointsByTag, setEndpointsByTag] = useState({});
  const [expandedTag, setExpandedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});

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

  const sendRequest = async (method, path) => {
    try {
      const response = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setResponses((prev) => ({ ...prev, [path]: JSON.stringify(data, null, 2) }));
    } catch (error) {
      setResponses((prev) => ({ ...prev, [path]: "Gagal mengirim permintaan" }));
    }
  };

  return (
    <>
      <Head>
        <title>VelynAPI</title>
      </Head>
      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-white text-center">Memuat kategori...</p>
        ) : (
          Object.keys(endpointsByTag).map((tag) => (
            <div key={tag} className="mb-4">
              {/* Kategori API */}
              <div
                className="bg-[#16163a] p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-[#21214d] transition"
                onClick={() => toggleCategory(tag)}
              >
                <span className="text-white font-bold">{tag.toUpperCase()}</span>
                <span className="text-gray-300">{endpointsByTag[tag].length} endpoint</span>
                <span className="text-white">
                  {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </div>

              {/* Daftar Endpoint */}
              {expandedTag === tag && (
                <div className="mt-2 space-y-2">
                  {endpointsByTag[tag].map((endpoint, index) => (
                    <div key={index} className="bg-[#22224a] p-4 rounded-lg border border-[#4a4a8a]">
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 text-white text-sm font-bold rounded ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <span className="text-white">{endpoint.path}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{endpoint.description}</p>

                      {/* Tombol Try It */}
                      <button
                        onClick={() => sendRequest(endpoint.method, endpoint.path)}
                        className="mt-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Try It
                      </button>

                      {/* Response */}
                      {responses[endpoint.path] && (
                        <pre className="mt-2 p-2 text-xs bg-gray-800 text-green-300 rounded overflow-x-auto">
                          {responses[endpoint.path]}
                        </pre>
                      )}
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

// Warna tombol sesuai metode HTTP
const getMethodColor = (method) => {
  switch (method) {
    case "GET":
      return "bg-green-600";
    case "POST":
      return "bg-blue-600";
    case "PUT":
      return "bg-yellow-500 text-black";
    case "DELETE":
      return "bg-red-600";
    default:
      return "bg-gray-600";
  }
};