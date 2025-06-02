import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

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

// Mock data for metrics
const metrics = [
  { id: 1, title: "Total Alerts", value: "347", change: "+12.5%", isPositive: true },
  { id: 2, title: "Critical Issues", value: "12", change: "-4.8%", isPositive: true },
  { id: 3, title: "Opportunities", value: "28", change: "+15.3%", isPositive: true },
  { id: 4, title: "Monitoring Profiles", value: "36", change: "+2", isPositive: true }
];

// Mock data for recent alerts
const recentAlerts = [
  {
    id: 1,
    title: "Negative press coverage about sustainability claims",
    severity: "high",
    source: "The Guardian",
    timestamp: "1 hour ago"
  },
  {
    id: 2,
    title: "Positive product review from major influencer",
    severity: "opportunity",
    source: "YouTube",
    timestamp: "3 hours ago"
  },
  {
    id: 3,
    title: "Competitor launched similar product line",
    severity: "medium",
    source: "Industry News",
    timestamp: "5 hours ago"
  },
  {
    id: 4,
    title: "Supply chain disruption mentioned in financial news",
    severity: "high",
    source: "Bloomberg",
    timestamp: "8 hours ago"
  }
];

// Mock data for trending entities
const trendingEntities = [
  { id: 1, name: "Sustainability", mentions: 124, sentiment: 0.65 },
  { id: 2, name: "Product Quality", mentions: 89, sentiment: 0.82 },
  { id: 3, name: "Competitor X", mentions: 76, sentiment: -0.12 },
  { id: 4, name: "CEO", mentions: 52, sentiment: 0.42 },
  { id: 5, name: "Market Expansion", mentions: 43, sentiment: 0.91 }
];

export default function DashboardIndex() {
  const [isLoading, setIsLoading] = useState(false);

  // Function to get severity color class
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-blue-500";
      case "opportunity":
        return "bg-amber";
      default:
        return "bg-gray-500";
    }
  };

  // Function to get sentiment color
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.7) return "text-green-500";
    if (sentiment > 0) return "text-green-400";
    if (sentiment > -0.3) return "text-yellow-500";
    if (sentiment > -0.7) return "text-red-400";
    return "text-red-500";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite mb-6">Dashboard</h1>
      
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map((metric) => (
              <motion.div
                key={metric.id}
                className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver">{metric.title}</h3>
                    <p className="text-2xl font-bold text-charcoal dark:text-offwhite mt-2">{metric.value}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    metric.isPositive ? "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-800 dark:bg-opacity-30" : "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-800 dark:bg-opacity-30"
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Line Chart */}
            <motion.div
              className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6 lg:col-span-2"
              variants={itemVariants}
            >
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Alert Volume Trend</h2>
              <div className="h-60 w-full bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <p className="text-gray-500 dark:text-silver">Line Chart Placeholder</p>
              </div>
            </motion.div>

            {/* Doughnut Chart */}
            <motion.div
              className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6"
              variants={itemVariants}
            >
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Alert Distribution</h2>
              <div className="h-60 w-full bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <p className="text-gray-500 dark:text-silver">Doughnut Chart Placeholder</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <motion.div
              className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite">Recent Alerts</h2>
                <Link
                  to="/app/alerts"
                  className="text-sm text-amber hover:text-amber-600 dark:hover:text-amber-400"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    to={`/app/alerts/${alert.id}`}
                    className="block border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-800 -mx-6 px-6 py-2 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex">
                        <div className={`h-2 w-2 mt-1.5 rounded-full ${getSeverityColor(alert.severity)} mr-3 flex-shrink-0`}></div>
                        <div>
                          <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">{alert.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-silver mt-1">
                            {alert.source} • {alert.timestamp}
                          </p>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Trending Entities */}
            <motion.div
              className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6"
              variants={itemVariants}
            >
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Trending Entities</h2>
              <div className="space-y-3">
                {trendingEntities.map((entity) => (
                  <div key={entity.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-charcoal dark:text-offwhite">{entity.name}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-silver">
                        {entity.mentions} mentions
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getSentimentColor(entity.sentiment)}`}>
                        {(entity.sentiment * 100).toFixed(0)}%
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 ${entity.sentiment >= 0 ? "text-green-500 rotate-0" : "text-red-500 rotate-180"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="animate-pulse">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex">
                    <div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1.5 mr-3"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
