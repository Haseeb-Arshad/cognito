import { useState } from "react";
import { useParams } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for a single alert
const mockAlertData = {
  id: "1",
  title: "Negative press coverage about sustainability claims",
  description: "The Guardian published an article questioning your company's environmental impact claims.",
  content: "The Guardian has published an investigative report questioning the validity of your company's recent sustainability claims. The article cites internal documents and interviews with former employees suggesting that environmental impact metrics were misrepresented in your latest sustainability report. This could potentially impact investor confidence and consumer trust in your brand's eco-friendly positioning.",
  severity: "high",
  status: "investigating",
  source: "The Guardian",
  sourceUrl: "https://theguardian.com/business/2025/jun/02/company-sustainability-claims",
  timestamp: "2025-06-02T10:30:00",
  publishedAt: "June 2, 2025 at 10:30 AM",
  relativeTime: "1 hour ago",
  entities: ["Sustainability", "PR", "Brand Reputation", "Media Relations"],
  assignee: "Communications Team",
  tags: ["negative press", "sustainability", "reputation risk"],
  sentiment: -0.75,
  reach: 1250000,
  engagement: 32400,
  timeline: [
    {
      id: 1,
      event: "Alert created",
      description: "System detected article with negative sentiment about sustainability claims",
      timestamp: "2025-06-02T10:32:15",
      relativeTime: "1 hour ago",
      user: "System"
    },
    {
      id: 2,
      event: "Alert assigned",
      description: "Alert assigned to Communications Team by Sarah Johnson",
      timestamp: "2025-06-02T10:45:22",
      relativeTime: "55 minutes ago",
      user: "Sarah Johnson"
    },
    {
      id: 3,
      event: "Status changed",
      description: "Status changed from 'open' to 'investigating'",
      timestamp: "2025-06-02T11:02:45",
      relativeTime: "38 minutes ago",
      user: "Michael Chen"
    },
    {
      id: 4,
      event: "Comment added",
      description: "Initial statement drafted for PR team review",
      timestamp: "2025-06-02T11:15:30",
      relativeTime: "25 minutes ago",
      user: "Emma Rodriguez"
    }
  ],
  relatedAlerts: [
    {
      id: "2",
      title: "Twitter discussion about sustainability report",
      description: "Growing discussion on Twitter questioning sustainability metrics",
      severity: "medium",
      status: "open",
      timestamp: "2025-06-02T11:00:00",
      relativeTime: "40 minutes ago"
    },
    {
      id: "3",
      title: "Industry analyst blog post about greenwashing",
      description: "Industry analyst published blog post about greenwashing in the sector",
      severity: "low",
      status: "open",
      timestamp: "2025-06-01T15:45:00",
      relativeTime: "19 hours ago"
    }
  ],
  analysis: {
    summary: "This is a high-risk media coverage event that directly challenges your company's environmental claims. The article has high credibility coming from The Guardian and contains specific allegations about misrepresented metrics.",
    recommendations: [
      "Prepare a detailed response addressing specific claims",
      "Consider publishing supporting data for sustainability claims",
      "Brief executive team on talking points",
      "Monitor social media for spread of the story"
    ],
    impactAreas: [
      { area: "Brand Reputation", risk: "high" },
      { area: "Consumer Trust", risk: "high" },
      { area: "Investor Relations", risk: "medium" },
      { area: "Regulatory Scrutiny", risk: "medium" }
    ],
    sentimentTrend: [
      { date: "2025-06-02T10:00:00", value: -0.2 },
      { date: "2025-06-02T11:00:00", value: -0.5 },
      { date: "2025-06-02T12:00:00", value: -0.75 }
    ]
  }
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

export default function AlertDetail() {
  const { alertId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  
  // In a real app, we would fetch the alert data based on the alertId
  const alert = mockAlertData;
  
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
  
  return (
    <div className="pb-10">
      {/* Header with navigation and actions */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <button 
            onClick={() => window.history.back()}
            className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-silver" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="text-sm text-gray-500 dark:text-silver">
            <span>Alerts</span>
            <span className="mx-2">/</span>
            <span>Alert #{alertId}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">{alert.title}</h1>
            <div className="flex items-center mt-2 flex-wrap gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                {alert.severity}
              </span>
              
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}
                >
                  {alert.status}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {statusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-40 bg-white dark:bg-[#252525] rounded-md shadow-lg">
                    <div className="py-1">
                      {["open", "acknowledged", "investigating", "resolved", "closed"].map((status) => (
                        <button
                          key={status}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            setStatusDropdownOpen(false);
                            // In a real app, we would update the status here
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <span className="inline-flex items-center text-xs text-gray-500 dark:text-silver">
                {alert.publishedAt}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-500 dark:text-silver hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Assign
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-amber text-charcoal rounded-md font-medium text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Take Action
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "overview"
                ? "border-b-2 border-amber text-amber"
                : "border-transparent text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "content"
                ? "border-b-2 border-amber text-amber"
                : "border-transparent text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Content Analysis
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "activity"
                ? "border-b-2 border-amber text-amber"
                : "border-transparent text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab("related")}
            className={`pb-4 font-medium text-sm ${
              activeTab === "related"
                ? "border-b-2 border-amber text-amber"
                : "border-transparent text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Related Alerts
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Alert Details</h2>
                  <p className="text-gray-700 dark:text-silver mb-4">{alert.description}</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mb-4">
                    <p className="text-gray-700 dark:text-silver whitespace-pre-line">{alert.content}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver uppercase tracking-wider mb-2">Source</h3>
                    <div className="flex items-center">
                      <span className="text-charcoal dark:text-offwhite">{alert.source}</span>
                      <a 
                        href={alert.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-2 text-amber hover:underline"
                      >
                        View Original
                      </a>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver uppercase tracking-wider mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {alert.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-silver px-2.5 py-0.5 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">AI Analysis</h2>
                  <p className="text-gray-700 dark:text-silver mb-4">{alert.analysis.summary}</p>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver uppercase tracking-wider mb-2">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-silver">
                      {alert.analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver uppercase tracking-wider mb-2">Impact Areas</h3>
                    <div className="space-y-2">
                      {alert.analysis.impactAreas.map((impact, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-silver">{impact.area}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            impact.risk === "high" 
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
                              : impact.risk === "medium"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}>
                            {impact.risk.toUpperCase()} RISK
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Metrics</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-silver">Sentiment</span>
                        <span className="text-sm font-medium text-red-500">Negative (-0.75)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-silver">Reach</span>
                        <span className="text-sm font-medium text-charcoal dark:text-offwhite">1.25M+</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-amber h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-silver">Engagement</span>
                        <span className="text-sm font-medium text-charcoal dark:text-offwhite">32.4K</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-amber h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Entities</h2>
                  <div className="space-y-2">
                    {alert.entities.map((entity, index) => (
                      <div 
                        key={index}
                        className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 flex justify-between items-center"
                      >
                        <span className="text-gray-700 dark:text-silver">{entity}</span>
                        <motion.button
                          className="text-amber hover:text-amber-dark"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === "content" && (
          <motion.div
            key="content"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Content Analysis</h2>
              <p className="text-gray-500 dark:text-silver mb-6">Detailed analysis of the alert content and context.</p>
              
              {/* Placeholder for content analysis - would be filled with real data in a production app */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mb-6">
                <p className="text-gray-700 dark:text-silver">Content analysis will display here with sentiment analysis, key phrases, entities, and other NLP insights.</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === "activity" && (
          <motion.div
            key="activity"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Activity Timeline</h2>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                {/* Timeline events */}
                <div className="space-y-6">
                  {alert.timeline.map((event, index) => (
                    <div key={event.id} className="relative flex items-start">
                      <div className="flex items-center justify-center h-14 w-14">
                        <div className="h-3 w-3 rounded-full bg-amber z-10"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-charcoal dark:text-offwhite">{event.event}</h4>
                            <span className="text-xs text-gray-500 dark:text-silver">{event.relativeTime}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-silver">{event.description}</p>
                          <div className="mt-2 text-xs text-gray-500 dark:text-silver">
                            By {event.user}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Add comment */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-silver mb-2">Add Comment</h3>
                <div className="flex">
                  <textarea
                    rows={2}
                    className="flex-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber p-2 text-sm"
                    placeholder="Add a comment..."
                  ></textarea>
                  <motion.button
                    className="ml-2 px-4 py-2 bg-amber text-charcoal rounded-md font-medium text-sm self-end"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === "related" && (
          <motion.div
            key="related"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Related Alerts</h2>
              
              <div className="space-y-4">
                {alert.relatedAlerts.map((relatedAlert) => (
                  <div
                    key={relatedAlert.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(relatedAlert.severity)}`}>
                          {relatedAlert.severity}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(relatedAlert.status)}`}>
                          {relatedAlert.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-silver">{relatedAlert.relativeTime}</span>
                    </div>
                    <h3 className="text-sm font-medium text-charcoal dark:text-offwhite mb-1">{relatedAlert.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-silver">{relatedAlert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
