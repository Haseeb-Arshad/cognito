import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Dashboard index component - rendered inside _app.dashboard.tsx layout
export default function DashboardIndex() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Chart data for sentiment trend
  const sentimentData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Positive Sentiment',
        data: [65, 59, 80, 81, 56, 55, 72],
        fill: true,
        backgroundColor: 'rgba(255, 184, 0, 0.2)',
        borderColor: 'rgba(255, 184, 0, 1)',
        tension: 0.4,
      },
      {
        label: 'Negative Sentiment',
        data: [28, 48, 40, 19, 36, 27, 20],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      },
    ],
  };

  // Chart data for alert volume
  const volumeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Opportunities',
        data: [12, 19, 15, 8, 22, 14, 17],
        backgroundColor: 'rgba(255, 184, 0, 0.8)',
      },
      {
        label: 'Crises',
        data: [7, 11, 5, 8, 3, 9, 4],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Topic distribution data for doughnut chart
  const topicData = {
    labels: ['Sustainability', 'Product Quality', 'Customer Service', 'Market Expansion', 'Innovation'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          'rgba(255, 184, 0, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Mock data for metrics
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

  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div>
        {/* Skeleton for metrics */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        {/* Skeleton for metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4 h-24 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
            </div>
          ))}
        </div>
        
        {/* Skeleton for main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="py-3 flex items-start">
                  <div className="w-3 h-3 rounded-full mt-1.5 mr-3 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4">
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header with title and actions */}
      <div className="flex justify-between items-center mb-6">
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
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-64">
                  <Line data={sentimentData} options={chartOptions} />
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
            <div className="h-48">
              <Bar data={volumeData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Topic Distribution */}
          <motion.div 
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Topic Distribution</h2>
            <div className="h-56 flex items-center justify-center">
              <Doughnut data={topicData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    labels: {
                      boxWidth: 15,
                      padding: 15,
                      font: {
                        size: 11
                      }
                    }
                  }
                },
                cutout: '65%'
              }} />
            </div>
          </motion.div>
          
          {/* Trending Entities */}
          <motion.div 
            className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-4 mt-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Trending Entities</h2>
            <div className="space-y-3">
              {trendingEntities.map((entity) => (
                <div key={entity.name} className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">{entity.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full">
                        <div 
                          className={`h-1.5 rounded-full ${entity.trend === "up" ? "bg-amber" : entity.trend === "down" ? "bg-red-500" : "bg-blue-500"}`}
                          style={{ width: `${(entity.volume / 500) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500 dark:text-silver">{entity.volume}</span>
                    </div>
                  </div>
                  <div className="ml-2">
                    {entity.trend === "up" ? (
                      <span className="text-green-500">↑</span>
                    ) : entity.trend === "down" ? (
                      <span className="text-red-500">↓</span>
                    ) : (
                      <span className="text-gray-500">→</span>
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
