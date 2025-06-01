import { useState } from "react";
import { motion } from "framer-motion";

export default function MonitoringConfigure() {
  const [view, setView] = useState<"table" | "card">("table");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Mock data for monitoring profiles
  const profiles = [
    { 
      id: "profile-1", 
      name: "Competitor Analysis", 
      description: "Track competitors' online presence and activities",
      entities: ["Competitor A", "Competitor B", "Competitor C"],
      active: true,
      lastUpdated: "2 days ago"
    },
    { 
      id: "profile-2", 
      name: "Brand Reputation", 
      description: "Monitor brand mentions and sentiment across platforms",
      entities: ["Cognito", "Brand Reputation", "Customer Feedback"],
      active: true,
      lastUpdated: "5 days ago"
    },
    { 
      id: "profile-3", 
      name: "Market Trends", 
      description: "Stay updated on emerging market trends and opportunities",
      entities: ["Industry News", "Market Analysis", "Technology Trends"],
      active: false,
      lastUpdated: "2 weeks ago"
    },
    { 
      id: "profile-4", 
      name: "Product Feedback", 
      description: "Collect and analyze customer feedback on products",
      entities: ["Product Reviews", "Customer Satisfaction", "Feature Requests"],
      active: true,
      lastUpdated: "1 day ago"
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

  return (
    <div className="container mx-auto">
      {/* Header with title and actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Monitoring Configurations</h1>
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <div className="flex bg-steel bg-opacity-10 rounded-md p-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setView("table")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === "table" 
                  ? "bg-amber text-charcoal" 
                  : "text-silver hover:text-offwhite"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setView("card")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === "card" 
                  ? "bg-amber text-charcoal" 
                  : "text-silver hover:text-offwhite"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </motion.button>
          </div>
          
          {/* Create new button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-amber text-charcoal rounded-md text-sm font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Profile
          </motion.button>
        </div>
      </div>

      {/* Main content area */}
      {view === "table" ? (
        <motion.div 
          className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-[#2A2A2A]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">
                  Entities
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-silver uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#252525] divide-y divide-gray-200 dark:divide-gray-700">
              {profiles.map((profile) => (
                <motion.tr
                  key={profile.id}
                  variants={itemVariants}
                  className="hover:bg-gray-50 dark:hover:bg-[#2A2A2A] cursor-pointer"
                  onClick={() => setSelectedProfile(profile.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-charcoal dark:text-offwhite">{profile.name}</div>
                    <div className="text-xs text-gray-500 dark:text-silver">{profile.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {profile.entities.map((entity, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber bg-opacity-10 text-amber"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      profile.active 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-500" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:bg-opacity-50 dark:text-gray-400"
                    }`}>
                      {profile.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-silver">
                    {profile.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-amber hover:text-amber-600 mr-4">
                      Edit
                    </button>
                    <button className="text-gray-500 hover:text-red-500">
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4 cursor-pointer"
              onClick={() => setSelectedProfile(profile.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-charcoal dark:text-offwhite">{profile.name}</h3>
                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                  profile.active 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-500" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:bg-opacity-50 dark:text-gray-400"
                }`}>
                  {profile.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-silver mb-4">{profile.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {profile.entities.map((entity, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber bg-opacity-10 text-amber"
                  >
                    {entity}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-silver">Updated {profile.lastUpdated}</span>
                <div className="flex gap-2">
                  <button className="p-1 text-silver hover:text-amber">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button className="p-1 text-silver hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Placeholder for profile detail or creation form when selected */}
      {selectedProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-[#252525] rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-charcoal dark:text-offwhite">
              {profiles.find(p => p.id === selectedProfile)?.name || "Profile Details"}
            </h2>
            <button 
              onClick={() => setSelectedProfile(null)}
              className="text-silver hover:text-amber"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-silver">
              This is a placeholder for the detailed profile view where users can edit all aspects of the monitoring profile.
              The full implementation would include forms for editing profile information, entity management, alert settings, etc.
            </p>
            
            <div className="flex gap-4 pt-4">
              <button className="px-4 py-2 bg-amber text-charcoal rounded-md text-sm font-medium">
                Save Changes
              </button>
              <button className="px-4 py-2 bg-steel bg-opacity-10 text-silver rounded-md text-sm font-medium">
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
