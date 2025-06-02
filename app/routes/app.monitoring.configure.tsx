import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for monitoring profiles
const monitoringProfiles = [
  {
    id: 1,
    name: "Competitor Mention Tracking",
    description: "Monitors mentions of key competitors across news and social media",
    status: "active",
    priority: "high",
    sources: ["News", "Twitter", "LinkedIn", "Reddit"],
    keywords: ["CompetitorX", "CompetitorY", "market share", "launch"],
    lastUpdated: "2 hours ago",
    alertCount: 12
  },
  {
    id: 2,
    name: "Brand Sentiment Analysis",
    description: "Tracks sentiment of brand mentions across all digital channels",
    status: "active",
    priority: "critical",
    sources: ["News", "Twitter", "Facebook", "Instagram", "TikTok", "Reddit"],
    keywords: ["brand name", "products", "service", "experience"],
    lastUpdated: "1 day ago",
    alertCount: 24
  },
  {
    id: 3,
    name: "Product Review Monitoring",
    description: "Tracks customer reviews of products on review sites and marketplaces",
    status: "active",
    priority: "medium",
    sources: ["Amazon", "Google Reviews", "Trustpilot", "App Store", "Play Store"],
    keywords: ["review", "rating", "product name", "quality", "price"],
    lastUpdated: "6 hours ago",
    alertCount: 18
  },
  {
    id: 4,
    name: "Industry News Alerts",
    description: "Monitors industry publications for relevant news and trends",
    status: "paused",
    priority: "low",
    sources: ["Industry Publications", "Trade Journals", "News Aggregators"],
    keywords: ["industry", "trend", "innovation", "regulation", "market"],
    lastUpdated: "5 days ago",
    alertCount: 0
  },
  {
    id: 5,
    name: "Executive Mention Tracking",
    description: "Monitors mentions of company executives in media and social platforms",
    status: "active",
    priority: "medium",
    sources: ["News", "Twitter", "LinkedIn", "Financial Publications"],
    keywords: ["CEO name", "CTO name", "executive", "leadership", "statement"],
    lastUpdated: "1 day ago",
    alertCount: 6
  },
  {
    id: 6,
    name: "Regulatory Change Monitor",
    description: "Tracks changes in regulations that may impact business operations",
    status: "active",
    priority: "high",
    sources: ["Government Sites", "Legal Publications", "Regulatory Bodies"],
    keywords: ["regulation", "compliance", "law", "standard", "requirement"],
    lastUpdated: "3 days ago",
    alertCount: 2
  },
  {
    id: 7,
    name: "Crisis Detection System",
    description: "Rapid detection of potential PR crises or reputation threats",
    status: "active",
    priority: "critical",
    sources: ["All News", "All Social Media", "TV Transcripts", "Radio Transcripts"],
    keywords: ["scandal", "controversy", "issue", "problem", "complaint", "crisis"],
    lastUpdated: "30 minutes ago",
    alertCount: 0
  },
  {
    id: 8,
    name: "Supply Chain Risk Monitor",
    description: "Monitors for disruptions or risks in the supply chain",
    status: "active",
    priority: "high",
    sources: ["News", "Industry Reports", "Weather Services", "Logistics Updates"],
    keywords: ["supply chain", "logistics", "shipping", "delay", "shortage", "disruption"],
    lastUpdated: "12 hours ago",
    alertCount: 3
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function MonitoringConfigurePage() {
  const [viewType, setViewType] = useState<"table" | "cards">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Filter profiles based on search query and status filter
  const filteredProfiles = monitoringProfiles.filter(profile => {
    const matchesSearch = searchQuery === "" || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === null || profile.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Function to get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-orange-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white";
      case "paused":
        return "bg-amber text-charcoal";
      case "draft":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Monitoring Configurations</h1>
          <p className="text-gray-500 dark:text-silver mt-1">
            Configure and manage your monitoring profiles and alerts
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-[#252525] rounded-md shadow-sm p-1">
            <button
              onClick={() => setViewType("cards")}
              className={`p-2 rounded ${
                viewType === "cards"
                  ? "bg-amber text-charcoal"
                  : "text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewType("table")}
              className={`p-2 rounded ${
                viewType === "table"
                  ? "bg-amber text-charcoal"
                  : "text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <motion.button
            className="px-4 py-2 bg-amber text-charcoal rounded-md font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Profile
          </motion.button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        
        <select
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || null)}
          className="md:w-48 pl-3 pr-8 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      
      <AnimatePresence mode="wait">
        {viewType === "cards" ? (
          <motion.div
            key="cards"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {filteredProfiles.map((profile) => (
              <motion.div
                key={profile.id}
                className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-charcoal dark:text-offwhite">{profile.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(profile.priority)}`}>
                        {profile.priority}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 dark:text-silver text-sm mb-4">{profile.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider mb-2">Sources</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.sources.map((source, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-silver">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-silver">
                    <span>Updated {profile.lastUpdated}</span>
                    <span>{profile.alertCount} alerts</span>
                  </div>
                  
                  <div className="flex justify-end mt-4 gap-2">
                    <motion.button
                      className="p-2 text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      className="p-2 text-amber hover:bg-amber hover:bg-opacity-10 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {profile.status === "active" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">Sources</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">Alerts</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProfiles.map((profile) => (
                    <motion.tr 
                      key={profile.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-charcoal dark:text-offwhite">{profile.name}</div>
                          <div className="text-xs text-gray-500 dark:text-silver">{profile.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                          {profile.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(profile.priority)}`}>
                          {profile.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {profile.sources.slice(0, 2).map((source, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-silver">
                              {source}
                            </span>
                          ))}
                          {profile.sources.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-silver">
                              +{profile.sources.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-silver">
                        {profile.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-silver">
                        {profile.alertCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            className="p-2 text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </motion.button>
                          <motion.button
                            className="p-2 text-amber hover:bg-amber hover:bg-opacity-10 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {profile.status === "active" ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            )}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
