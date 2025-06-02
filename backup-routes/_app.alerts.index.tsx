import { useState } from "react";
import { motion } from "framer-motion";

// Mock data for alerts
const alerts = [
  {
    id: 1,
    title: "Negative press coverage about sustainability claims",
    description: "The Guardian published an article questioning your company's environmental impact claims.",
    severity: "high",
    status: "open",
    source: "The Guardian",
    timestamp: "2025-06-02T10:30:00",
    relativeTime: "1 hour ago",
    entities: ["Sustainability", "PR"],
    assignee: "Unassigned"
  },
  {
    id: 2,
    title: "Positive product review from major influencer",
    description: "TechReviewer posted a highly positive video review of your latest product launch.",
    severity: "opportunity",
    status: "acknowledged",
    source: "YouTube",
    timestamp: "2025-06-02T08:15:00",
    relativeTime: "3 hours ago",
    entities: ["Product Launch", "Marketing"],
    assignee: "Marketing Team"
  },
  {
    id: 3,
    title: "Competitor launched similar product line",
    description: "CompetitorX announced a new product line that directly competes with your premium offerings.",
    severity: "medium",
    status: "open",
    source: "Industry News",
    timestamp: "2025-06-02T06:45:00",
    relativeTime: "5 hours ago",
    entities: ["Competition", "Product Strategy"],
    assignee: "Product Team"
  },
  {
    id: 4,
    title: "Supply chain disruption mentioned in financial news",
    description: "Bloomberg reported potential supply chain issues that could affect your production timeline.",
    severity: "high",
    status: "investigating",
    source: "Bloomberg",
    timestamp: "2025-06-02T03:20:00",
    relativeTime: "8 hours ago",
    entities: ["Supply Chain", "Operations"],
    assignee: "Operations Team"
  },
  {
    id: 5,
    title: "Viral social media post mentioning brand",
    description: "A post on Twitter mentioning your brand in a positive context has gone viral with over 50,000 shares.",
    severity: "opportunity",
    status: "acknowledged",
    source: "Twitter",
    timestamp: "2025-06-01T23:45:00",
    relativeTime: "12 hours ago",
    entities: ["Social Media", "Brand Awareness"],
    assignee: "Social Media Team"
  },
  {
    id: 6,
    title: "Potential compliance issue in new market",
    description: "Regulatory changes in the European market may require product modifications.",
    severity: "critical",
    status: "open",
    source: "Legal Team",
    timestamp: "2025-06-01T20:10:00",
    relativeTime: "15 hours ago",
    entities: ["Legal", "Compliance"],
    assignee: "Unassigned"
  },
  {
    id: 7,
    title: "Customer support metrics showing improvement",
    description: "Response times and customer satisfaction scores have improved by 15% in the last month.",
    severity: "opportunity",
    status: "acknowledged",
    source: "Internal Analytics",
    timestamp: "2025-06-01T14:30:00",
    relativeTime: "1 day ago",
    entities: ["Customer Support", "Operations"],
    assignee: "Support Team"
  },
  {
    id: 8,
    title: "Potential partnership opportunity with TechGiant",
    description: "TechGiant has expressed interest in a joint venture for upcoming product launches.",
    severity: "opportunity",
    status: "investigating",
    source: "Business Development",
    timestamp: "2025-06-01T09:15:00",
    relativeTime: "1 day ago",
    entities: ["Partnerships", "Business Development"],
    assignee: "Executive Team"
  }
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

export default function AlertsIndex() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Function to get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-orange-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      case "opportunity":
        return "bg-amber text-charcoal";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500 text-white";
      case "acknowledged":
        return "bg-purple-500 text-white";
      case "investigating":
        return "bg-amber text-charcoal";
      case "resolved":
        return "bg-green-500 text-white";
      case "closed":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Filter alerts based on selected filter and search query
  const filteredAlerts = alerts.filter((alert) => {
    // First apply the category filter
    if (selectedFilter !== "all" && alert.severity !== selectedFilter) {
      return false;
    }
    
    // Then apply the search query filter if it exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        alert.source.toLowerCase().includes(query) ||
        alert.entities.some(entity => entity.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Sort the filtered alerts
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sortBy === "severity-high") {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, opportunity: 0 };
      return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
    } else if (sortBy === "severity-low") {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, opportunity: 0 };
      return severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
    }
    return 0;
  });

  return (
    <div>
      {/* Header with filtering and search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Alerts</h1>
            <p className="text-gray-500 dark:text-silver mt-1">
              Monitor and manage all detected crises and opportunities
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="severity-high">Highest Severity</option>
              <option value="severity-low">Lowest Severity</option>
            </select>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedFilter === "all"
                ? "bg-amber text-charcoal"
                : "bg-white dark:bg-[#252525] text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter("critical")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedFilter === "critical"
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-[#252525] text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setSelectedFilter("high")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedFilter === "high"
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-[#252525] text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            High
          </button>
          <button
            onClick={() => setSelectedFilter("medium")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedFilter === "medium"
                ? "bg-orange-500 text-white"
                : "bg-white dark:bg-[#252525] text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setSelectedFilter("opportunity")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedFilter === "opportunity"
                ? "bg-amber text-charcoal"
                : "bg-white dark:bg-[#252525] text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Opportunities
          </button>
        </div>
      </div>
      
      {/* Alert cards */}
      <motion.div
        className="grid grid-cols-1 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <div className={`h-1 ${getSeverityColor(alert.severity).split(" ")[0]}`}></div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal dark:text-offwhite">{alert.title}</h3>
                  <p className="text-gray-500 dark:text-silver mt-1">{alert.description}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-silver md:text-right whitespace-nowrap">
                  <div>
                    {alert.source} • {alert.relativeTime}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {alert.entities.map((entity, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-silver px-2.5 py-0.5 rounded text-xs">
                    {entity}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                    {alert.assignee === "Unassigned" ? "?" : alert.assignee.split(" ")[0][0] + (alert.assignee.split(" ")[1] ? alert.assignee.split(" ")[1][0] : "")}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-silver">{alert.assignee}</span>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    className="p-2 text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  <motion.button
                    className="p-2 text-amber hover:bg-amber hover:bg-opacity-10 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-silver">
          Showing <span className="font-medium">{sortedAlerts.length}</span> of <span className="font-medium">{alerts.length}</span> alerts
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
