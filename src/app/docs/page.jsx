"use client";
import Head from "next/head";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import swaggerConfig from "../swagger-config.json"; // Pastikan file ini ada

export default function Home() {
  const [endpointsByTag, setEndpointsByTag] = useState({});
  const [expandedTag, setExpandedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengelompokkan endpoint berdasarkan tag
  const calculateEndpointsByTag = (swaggerData) => {
    const tagEndpointMap = {};
    Object.keys(swaggerData.paths).forEach((path) => {
      Object.keys(swaggerData.paths[path]).forEach((method) => {
        const operation = swaggerData.paths[path][method];
        if (operation.tags) {
          operation.tags.forEach((tag) => {
            if (!tagEndpointMap[tag]) {
              tagEndpointMap[tag] = [];
            }
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

  useEffect(() => {
    setTimeout(() => {
      const endpointsMap = calculateEndpointsByTag(swaggerConfig);
      setEndpointsByTag(endpointsMap);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleCategory = (tag) => {
    setExpandedTag(expandedTag === tag ? null : tag);
  };

  return (
    <>
      <Head>
        <title>VelynAPI</title>
        <meta name="title" content="VelynAPI - Dokumentasi" />
        <meta
          name="description"
          content="VelynApi adalah REST API gratis dan sederhana yang dibuat oleh ErerexIDChx untuk kebaikan bersama. Silakan gunakan, tapi hindari serangan DDoS."
        />
      </Head>

      <main className="p-6 bg-[#121212] min-h-screen">
        <div className="bg-[#181818] shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-4">VelynAPI</h1>
          <p className="text-gray-400 mb-6">
            Dokumentasi API gratis dan sederhana. Silakan gunakan dengan bijak.
          </p>

          {loading ? (
            <p className="text-gray-300">Memuat endpoint...</p>
          ) : (
            Object.keys(endpointsByTag).map((tag) => (
              <div
                key={tag}
                className={`api-category ${expandedTag === tag ? "expanded" : ""} bg-[#1e1e1e] p-4 mb-4 rounded-lg cursor-pointer transition-all duration-300`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">{`# ${tag.toUpperCase()}`}</span>
                  <span className="text-sm text-gray-400">{`${endpointsByTag[tag].length} endpoint`}</span>
                  <span
                    className="text-white text-xl cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(tag);
                    }}
                  >
                    {expandedTag === tag ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>

                {expandedTag === tag && (
                  <div className="mt-4">
                    {endpointsByTag[tag].map((endpoint, index) => (
                      <div key={index} className="bg-[#242424] p-3 rounded-md mb-2">
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-sm ${endpoint.method === "GET" ? "text-green-400" : "text-yellow-400"}`}>
                            {endpoint.method}
                          </span>
                          <span className="text-white">{endpoint.path}</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">{endpoint.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}