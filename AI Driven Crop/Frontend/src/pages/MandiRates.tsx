// src/pages/MandiRates.tsx
import React, { useEffect, useState } from "react";
import { fetchMandiRates, fetchStates, fetchCommodities } from "../services/mandiServices";
import { Search, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const MandiRates: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCommodity, setSelectedCommodity] = useState("all");
  const [states, setStates] = useState<string[]>([]);
  const [commodities, setCommodities] = useState<string[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Load filters
  useEffect(() => {
    const loadFilters = async () => {
      setStates(await fetchStates());
      setCommodities(await fetchCommodities());
    };
    loadFilters();
  }, []);

  // Load mandi rates
  const loadRates = async () => {
    try {
      const data = await fetchMandiRates(selectedState, selectedCommodity);
      console.log("✅ Fetched rates:", data);
      setRates(data);
    } catch (error) {
      console.error("Error fetching mandi rates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
    const interval = setInterval(loadRates, 300000); // auto-refresh every 5 min
    return () => clearInterval(interval);
  }, [selectedState, selectedCommodity]);

  // Filtering
  const filteredData = rates.filter((item) => {
    const matchesSearch =
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.market.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === "all" || item.state === selectedState;
    const matchesCommodity = selectedCommodity === "all" || item.commodity === selectedCommodity;
    return matchesSearch && matchesState && matchesCommodity;
  });

  // Sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const valA = (a as any)[sortConfig.key];
        const valB = (b as any)[sortConfig.key];
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    : filteredData;

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Chart data
  const chartData = filteredData.map((item) => ({
    market: item.market,
    avgPrice: Number(item.modal_price),
  }));

  if (loading) return <p>Loading real-time mandi rates...</p>;

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-4">📊 Mandi Rates Dashboard</h1>
            <p className="text-xl text-gray-600">Track and analyze live commodity prices across India</p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search commodity or market..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* State Filter */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Commodity Filter */}
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Commodities</option>
                {commodities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="size-4" />
                <span>{filteredData.length} results found</span>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download className="size-4" />
                Export to Excel
              </button>
            </div>
          </div>

          {/* Price Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left cursor-pointer" onClick={() => handleSort("commodity")}>Commodity</th>
                    <th className="px-6 py-4 text-left">Market/Mandi</th>
                    <th className="px-6 py-4 text-right cursor-pointer" onClick={() => handleSort("min_price")}>Min Price (₹/qtl)</th>
                    <th className="px-6 py-4 text-right cursor-pointer" onClick={() => handleSort("max_price")}>Max Price (₹/qtl)</th>
                    <th className="px-6 py-4 text-right cursor-pointer" onClick={() => handleSort("modal_price")}>Modal Price (₹/qtl)</th>
                    <th className="px-6 py-4 text-left">State</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.commodity}</td>
                      <td className="px-6 py-4">{item.market}</td>
                      <td className="px-6 py-4 text-right">₹{item.min_price}</td>
                      <td className="px-6 py-4 text-right">₹{item.max_price}</td>
                      <td className="px-6 py-4 text-right">₹{item.modal_price}</td>
                      <td className="px-6 py-4">{item.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Price Comparison Chart */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-gray-900 mb-6">Price Comparison Across Markets</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="market" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="avgPrice"
                    fill="#10b981"
                    name="Average Price (₹/qtl)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};