import { useState, useEffect } from "react";
import { Link, Form, useSearchParams } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";

// Filter types
type FilterType = "all" | "high" | "medium" | "low" | "opportunity";
type SortBy = "newest" | "oldest" | "severity";

export default function AlertsIndex() {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data for alerts
  const alertsData = [
    { 
      id: "alert-1", 
      title: "Negative press coverage detected about sustainability claims", 
      source: "The Guardian",
      sourceLink: "https://theguardian.com/article/123",
      severity: "high",
      date: "2023-04-12T10:30:00Z",
      monitored: "Brand Reputation",
      content: "Recent article criticizes company's sustainability claims, citing lack of evidence for carbon neutrality targets.",
      status: "new"
    },
    { 
      id: "alert-2", 
      title: "Positive product review from major influencer", 
      source: "YouTube - TechReviewer",
      sourceLink: "https://youtube.com/watch?v=123",
      severity: "opportunity",
      date: "2023-04-12T08:15:00Z",
      monitored: "Product Feedback",
      content: "Influencer with 2M followers gave a positive review highlighting innovative features and user experience.",
      status: "read"
    },
    { 
      id: "alert-3", 
      title: "Competitor launched similar product line", 
      source: "Industry News",
      sourceLink: "https://industrynews.com/article/456",
      severity: "medium",
      date: "2023-04-11T14:45:00Z",
      monitored: "Competitor Analysis",
      content: "Major competitor announced a similar product line targeting the same market segment with comparable features.",
      status: "flagged"
    },
    { 
      id: "alert-4", 
      title: "Supply chain disruption mentioned in financial news", 
      source: "Bloomberg",
      sourceLink: "https://bloomberg.com/article/789",
      severity: "high",
      date: "2023-04-11T09:20:00Z",
      monitored: "Market Trends",
      content: "Article discusses potential supply chain disruptions that could affect production timelines for the next quarter.",
      status: "new"
    },
    { 
      id: "alert-5", 
      title: "Viral social media post mentioning brand", 
      source: "Twitter",
      sourceLink: "https://twitter.com/user/status/123",
      severity: "opportunity",
      date: "2023-04-10T16:30:00Z",
      monitored: "Brand Reputation",
      content: "Viral post with 50k likes mentions product in a positive context, generating significant engagement.",
      status: "read"
    },
    { 
      id: "alert-6", 
      title: "Negative customer reviews on retail platform", 
      source: "Amazon Reviews",
      sourceLink: "https://amazon.com/product/reviews",
      severity: "medium",
      date: "2023-04-10T11:15:00Z",
      monitored: "Product Feedback",
      content: "Cluster of negative reviews mentioning product reliability issues. Average rating dropped from 4.6 to 4.2.",
      status: "new"
    },
    { 
      id: "alert-7", 
      title: "Regulatory change announcement affecting product category", 
      source: "Government Portal",
      sourceLink: "https://gov.org/regulations/123",
      severity: "high",
      date: "2023-04-09T10:00:00Z",
      monitored: "Market Trends",
      content: "New regulations announced that will impact product certification requirements starting next quarter.",
      status: "flagged"
    },
    { 
      id: "alert-8", 
      title: "Positive mentions in industry podcast", 
      source: "Industry Insights Podcast",
      sourceLink: "https://podcasts.com/episode/123",
      severity: "opportunity",
      date: "2023-04-08T15:45:00Z",
      monitored: "Brand Reputation",
      content: "Industry podcast with 100k subscribers featured product as an innovative solution in latest episode.",
      status: "read"
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Filter and sort alerts
  const filteredAlerts = alertsData
    .filter(alert => {
      if (activeFilter === "all") return true;
      return alert.severity === activeFilter;
    })
    .filter(alert => {
      if (!searchQuery) return true;
      return alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             alert.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             alert.source.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "severity") {
        const severityOrder = { high: 1, medium: 2, low: 3, opportunity: 4 };
        return severityOrder[a.severity as keyof typeof severityOrder] - 
               severityOrder[b.severity as keyof typeof severityOrder];
      }
      return 0;
    });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Helper to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-gray-500";
      case "opportunity":
        return "bg-amber";
      default:
        return "bg-gray-500";
    }
  };

  // Helper to get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300";
      case "read":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:bg-opacity-50 dark:text-gray-300";
      case "flagged":
        return "bg-amber bg-opacity-10 text-amber";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:bg-opacity-50 dark:text-gray-300";
    }
  };

  // Toggle select all alerts
  const toggleSelectAll = () => {
    if (selectedAlerts.length === paginatedAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(paginatedAlerts.map(alert => alert.id));
    }
  };

  // Toggle individual alert selection
  const toggleSelectAlert = (id: string) => {
    setSelectedAlerts(prev => 
      prev.includes(id) 
        ? prev.filter(alertId => alertId !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto">
      {/* Header with title and actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Alerts</h1>
        
        <div className="flex items-center gap-3">
          {selectedAlerts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-silver">{selectedAlerts.length} selected</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-silver hover:text-amber"
                title="Mark as read"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-silver hover:text-amber"
                title="Flag important"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-silver hover:text-red-500"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </motion.div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search alerts..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters and sorting */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeFilter === "all" 
                ? "bg-amber text-charcoal" 
                : "bg-steel bg-opacity-10 text-silver hover:bg-opacity-20"
            }`}
          >
            All
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter("high")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeFilter === "high" 
                ? "bg-red-500 text-white" 
                : "bg-steel bg-opacity-10 text-silver hover:bg-opacity-20"
            }`}
          >
            High
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter("medium")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeFilter === "medium" 
                ? "bg-orange-500 text-white" 
                : "bg-steel bg-opacity-10 text-silver hover:bg-opacity-20"
            }`}
          >
            Medium
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter("opportunity")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeFilter === "opportunity" 
                ? "bg-amber text-charcoal" 
                : "bg-steel bg-opacity-10 text-silver hover:bg-opacity-20"
            }`}
          >
            Opportunities
          </motion.button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-silver">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="severity">Severity</option>
          </select>
        </div>
      </div>

      {/* Alerts list */}
      <motion.div 
        className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Table header */}
        <div className="flex items-center px-6 py-3 bg-gray-50 dark:bg-[#2A2A2A] border-b border-gray-200 dark:border-gray-700">
          <div className="w-8">
            <input
              type="checkbox"
              className="w-4 h-4 text-amber focus:ring-amber border-gray-300 dark:border-gray-600 rounded"
              checked={selectedAlerts.length === paginatedAlerts.length && paginatedAlerts.length > 0}
              onChange={toggleSelectAll}
            />
          </div>
          <div className="flex-1 text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">
            Alert
          </div>
          <div className="w-32 text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider text-center">
            Status
          </div>
          <div className="w-40 text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">
            Source
          </div>
          <div className="w-40 text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">
            Date
          </div>
          <div className="w-10"></div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedAlerts.length > 0 ? (
            paginatedAlerts.map((alert) => (
              <motion.div 
                key={alert.id}
                variants={itemVariants}
                className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]"
              >
                <div className="w-8">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber focus:ring-amber border-gray-300 dark:border-gray-600 rounded"
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={() => toggleSelectAlert(alert.id)}
                  />
                </div>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                  <div className="truncate">
                    <h3 className="text-sm font-medium text-charcoal dark:text-offwhite truncate">{alert.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-silver truncate">{alert.content}</p>
                  </div>
                </div>
                <div className="w-32 text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadge(alert.status)}`}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </div>
                <div className="w-40">
                  <a href={alert.sourceLink} target="_blank" rel="noopener noreferrer" className="text-sm text-amber hover:underline truncate block">
                    {alert.source}
                  </a>
                </div>
                <div className="w-40 text-sm text-gray-500 dark:text-silver">
                  {formatDate(alert.date)}
                </div>
                <div className="w-10 flex">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-amber"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500 dark:text-silver">No alerts found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-[#2A2A2A] px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-silver">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAlerts.length)} of {filteredAlerts.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1 
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-gray-500 dark:text-silver hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-md ${
                    currentPage === index + 1 
                      ? "bg-amber text-charcoal" 
                      : "text-gray-500 dark:text-silver hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages 
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-gray-500 dark:text-silver hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
