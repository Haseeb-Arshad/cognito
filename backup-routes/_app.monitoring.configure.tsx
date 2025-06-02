import { useState } from "react";
import { motion } from "framer-motion";

// Mock data for monitoring profiles
const monitoringProfiles = [
  {
    id: 1,
    name: "Brand Reputation",
    description: "Monitors all web mentions of your brand for sentiment analysis",
    status: "active",
    entities: 24,
    lastUpdated: "2 hours ago",
    priority: "high",
  },
  {
    id: 2,
    name: "Competitor Activity",
    description: "Tracks product launches, PR, and social activity of competitors",
    status: "active",
    entities: 18,
    lastUpdated: "1 day ago",
    priority: "medium",
  },
  {
    id: 3,
    name: "Market Trends",
    description: "Analyzes industry trends and market shifts",
    status: "paused",
    entities: 32,
    lastUpdated: "5 days ago",
    priority: "low",
  },
  {
    id: 4,
    name: "Product Feedback",
    description: "Gathers and analyzes customer feedback across platforms",
    status: "active",
    entities: 15,
    lastUpdated: "12 hours ago",
    priority: "high",
  },
  {
    id: 5,
    name: "Crisis Detection",
    description: "Early warning system for potential PR crises",
    status: "active",
    entities: 8,
    lastUpdated: "3 hours ago",
    priority: "critical",
  },
  {
    id: 6,
    name: "Compliance Monitoring",
    description: "Tracks industry regulations and compliance issues",
    status: "paused",
    entities: 12,
    lastUpdated: "1 week ago",
    priority: "medium",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function MonitoringConfigure() {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  
  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-amber";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };
  
  // Function to get priority badge class
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber text-charcoal";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div>
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Monitoring Configurations</h1>
          <p className="text-gray-500 dark:text-silver mt-1">Set up what entities and topics to monitor</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <div className="bg-white dark:bg-[#252525] rounded-md border border-gray-200 dark:border-gray-700 p-1 flex">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded ${
                viewMode === "table"
                  ? "bg-amber text-charcoal"
                  : "bg-transparent text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`px-3 py-1.5 rounded ${
                viewMode === "card"
                  ? "bg-amber text-charcoal"
                  : "bg-transparent text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
          
          {/* Create new button */}
          <motion.button
            className="bg-amber text-charcoal px-4 py-2 rounded-md font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Profile
          </motion.button>
        </div>
      </div>
      
      {/* Table View */}
      {viewMode === "table" && (
        <motion.div 
          className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-silver">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Description</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Entities</th>
                  <th className="px-6 py-3 text-left font-medium">Priority</th>
                  <th className="px-6 py-3 text-left font-medium">Last Updated</th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {monitoringProfiles.map((profile) => (
                  <motion.tr 
                    key={profile.id}
                    variants={itemVariants}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-charcoal dark:text-offwhite">{profile.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-silver">{profile.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(profile.status)} text-white`}>
                        {profile.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-silver">
                      {profile.entities}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(profile.priority)}`}>
                        {profile.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-silver">
                      {profile.lastUpdated}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      
      {/* Card View */}
      {viewMode === "card" && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {monitoringProfiles.map((profile) => (
            <motion.div 
              key={profile.id}
              className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-charcoal dark:text-offwhite">{profile.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(profile.status)} text-white`}>
                  {profile.status}
                </span>
              </div>
              
              <p className="text-gray-500 dark:text-silver text-sm mb-4">{profile.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <span className="text-xs text-gray-500 dark:text-silver block">Entities</span>
                  <span className="text-charcoal dark:text-offwhite font-medium">{profile.entities}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-silver block">Priority</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(profile.priority)}`}>
                    {profile.priority}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-silver block">Last Updated</span>
                  <span className="text-charcoal dark:text-offwhite">{profile.lastUpdated}</span>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <motion.button
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </motion.button>
                <motion.button
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
