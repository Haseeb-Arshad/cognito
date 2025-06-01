import { useState } from "react";
import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

// Dashboard index component - rendered inside dashboard.tsx layout
export default function DashboardIndex() {
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Mock data for charts and metrics
  const metrics = [
    { id: 1, label: "Active Crises", value: 3, icon: "🔥", trend: "-1 from yesterday", color: "text-red-500" },
    { id: 2, label: "New Opportunities", value: 12, icon: "💡", trend: "+5 from yesterday", color: "text-green-500" },
    { id: 3, label: "Entities Monitored", value: 48, icon: "👁️", trend: "+2 this week", color: "text-blue-500" },
    { id: 4, label: "Alerts (24h)", value: 27, icon: "🔔", trend: "+8 from yesterday", color: "text-amber" },
  ];

  const recentAlerts = [
    { id: 1, title: "Negative press coverage about sustainability claims", severity: "high", source: "The Guardian", time: "1 hour ago" },
    { id: 2, title: "Positive product review from major influencer", severity: "opportunity", source: "YouTube", time: "3 hours ago" },
    { id: 3, title: "Competitor launched similar product line", severity: "medium", source: "Industry News", time: "5 hours ago" },
    { id: 4, title: "Supply chain disruption mentioned in financial news", severity: "high", source: "Bloomberg", time: "8 hours ago" },
    { id: 5, title: "Viral social media post mentioning brand", severity: "opportunity", source: "Twitter", time: "12 hours ago" },
  ];

  const trendingEntities = [
    { name: "Sustainable Packaging", volume: 423, trend: "up" },
    { name: "Product Innovation", volume: 312, trend: "up" },
    { name: "Market Expansion", volume: 287, trend: "stable" },
    { name: "Customer Feedback", volume: 256, trend: "down" },
    { name: "Competitor Analysis", volume: 198, trend: "up" },
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

  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
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

  return (
    <div className="container mx-auto">
      {/* Header with title and actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isCustomizing 
              ? "bg-amber text-charcoal" 
              : "bg-steel bg-opacity-10 text-silver hover:bg-opacity-20"
          }`}
        >
          {isCustomizing ? "Save Layout" : "Customize Dashboard"}
        </motion.button>
      </div>

      {/* Key Metrics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric) => (
          <motion.div 
            key={metric.id}
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4 flex flex-col"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 dark:text-silver text-sm">{metric.label}</span>
              <span className="text-2xl">{metric.icon}</span>
            </div>
            <div className="flex items-baseline">
              <motion.span 
                className="text-3xl font-bold text-charcoal dark:text-offwhite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {metric.value}
              </motion.span>
              <span className={`ml-2 text-xs ${metric.color}`}>{metric.trend}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sentiment Chart */}
          <motion.div 
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Sentiment Trend</h2>
            <div className="aspect-[16/9] relative">
              {/* Chart would be implemented with a charting library */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-64 bg-gray-100 dark:bg-[#303030] rounded-md overflow-hidden">
                  {/* Simulated chart with basic SVG */}
                  <svg viewBox="0 0 100 30" className="w-full h-full stroke-amber fill-amber fill-opacity-10">
                    <path d="M0,15 Q10,5 20,15 T40,15 T60,5 T80,20 T100,10" fill="none" strokeWidth="0.5" />
                    <path d="M0,30 L0,15 Q10,5 20,15 T40,15 T60,5 T80,20 T100,10 L100,30 Z" strokeWidth="0" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div 
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite">Recent Critical Alerts</h2>
              <Link to="/alerts" className="text-sm text-amber hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="py-3 flex items-start">
                  <div className={`w-3 h-3 rounded-full mt-1.5 mr-3 ${getSeverityColor(alert.severity)}`}></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">{alert.title}</h3>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-silver">
                      <span>{alert.source}</span>
                      <span className="mx-2">•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                  <motion.button
                    className="text-silver hover:text-amber"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Volume Chart */}
          <motion.div 
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Alert Volume</h2>
            <div className="h-48 bg-gray-100 dark:bg-[#303030] rounded-md overflow-hidden">
              {/* Simulated bar chart */}
              <div className="h-full flex items-end justify-around p-4">
                {[30, 45, 25, 60, 35, 75, 40].map((height, index) => (
                  <div key={index} className="w-1/12">
                    <motion.div 
                      className="bg-amber rounded-t-sm mx-auto w-4/5"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Trending Entities */}
          <motion.div 
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Trending Entities</h2>
            <div className="space-y-3">
              {trendingEntities.map((entity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-charcoal dark:text-offwhite">{entity.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 dark:text-silver mr-2">{entity.volume}</span>
                    {entity.trend === "up" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {entity.trend === "down" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {entity.trend === "stable" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
