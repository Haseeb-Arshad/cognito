import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";

// Types
interface Alert {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  source: string;
  timestamp: string;
  relativeTime: string;
  entities: string[];
  assignee: string;
  content?: {
    summary: string;
    sentiment: number;
    context: string;
    rawText: string;
  };
  timeline?: {
    id: number;
    action: string;
    user: string;
    timestamp: string;
    relativeTime: string;
  }[];
  relatedAlerts?: {
    id: number;
    title: string;
    severity: string;
    status: string;
    timestamp: string;
    relativeTime: string;
  }[];
}

// Mock data for a specific alert
const mockAlertData: Record<string, Alert> = {
  "1": {
    id: 1,
    title: "Negative press coverage about sustainability claims",
    description: "The Guardian published an article questioning your company's environmental impact claims.",
    severity: "high",
    status: "open",
    source: "The Guardian",
    timestamp: "2025-06-02T10:30:00",
    relativeTime: "1 hour ago",
    entities: ["Sustainability", "PR", "Environment", "Media Coverage"],
    assignee: "Unassigned",
    content: {
      summary: "The article criticizes the company's carbon neutrality claims, citing lack of third-party verification and questioning the methodology used to calculate carbon offsets.",
      sentiment: -0.7,
      context: "This comes amid increasing scrutiny of corporate environmental claims by regulatory bodies.",
      rawText: "In their latest sustainability report, Company X claims to have achieved carbon neutrality across all operations. However, our investigation reveals these claims lack proper third-party verification, and the methodology used to calculate carbon offsets appears to use outdated models that significantly underestimate actual emissions..."
    },
    timeline: [
      {
        id: 1,
        action: "Alert created",
        user: "System",
        timestamp: "2025-06-02T10:30:00",
        relativeTime: "1 hour ago"
      },
      {
        id: 2,
        action: "Severity set to HIGH",
        user: "System",
        timestamp: "2025-06-02T10:30:05",
        relativeTime: "1 hour ago"
      },
      {
        id: 3,
        action: "Alert viewed",
        user: "Sarah Chen",
        timestamp: "2025-06-02T10:45:00",
        relativeTime: "45 minutes ago"
      }
    ],
    relatedAlerts: [
      {
        id: 9,
        title: "Environmental NGO announces investigation into industry practices",
        severity: "medium",
        status: "open",
        timestamp: "2025-06-01T14:30:00",
        relativeTime: "1 day ago"
      },
      {
        id: 12,
        title: "Competitor launches certified carbon-neutral product line",
        severity: "opportunity",
        status: "acknowledged",
        timestamp: "2025-06-01T09:15:00",
        relativeTime: "1 day ago"
      }
    ]
  },
  "2": {
    id: 2,
    title: "Positive product review from major influencer",
    description: "TechReviewer posted a highly positive video review of your latest product launch.",
    severity: "opportunity",
    status: "acknowledged",
    source: "YouTube",
    timestamp: "2025-06-02T08:15:00",
    relativeTime: "3 hours ago",
    entities: ["Product Launch", "Marketing", "Social Media", "Influencers"],
    assignee: "Marketing Team",
    content: {
      summary: "The influencer praised the product's innovative features, quality, and value compared to competitors. Video currently has 250,000 views and is trending.",
      sentiment: 0.85,
      context: "This is the first major positive coverage from this influencer who has previously favored competitor products.",
      rawText: "I've been testing the new X1 Pro for two weeks now, and I have to say, I'm impressed. The build quality is exceptional, performance beats anything else in this price range, and the new features are genuinely useful rather than gimmicky..."
    },
    timeline: [
      {
        id: 1,
        action: "Alert created",
        user: "System",
        timestamp: "2025-06-02T08:15:00",
        relativeTime: "3 hours ago"
      },
      {
        id: 2,
        action: "Severity set to OPPORTUNITY",
        user: "System",
        timestamp: "2025-06-02T08:15:05",
        relativeTime: "3 hours ago"
      },
      {
        id: 3,
        action: "Alert assigned to Marketing Team",
        user: "John Doe",
        timestamp: "2025-06-02T08:30:00",
        relativeTime: "2 hours 45 minutes ago"
      },
      {
        id: 4,
        action: "Status changed to ACKNOWLEDGED",
        user: "Marketing Team",
        timestamp: "2025-06-02T09:15:00",
        relativeTime: "2 hours ago"
      },
      {
        id: 5,
        action: "Comment added: 'We should reach out to the influencer for a potential partnership.'",
        user: "Marketing Team",
        timestamp: "2025-06-02T09:20:00",
        relativeTime: "1 hour 55 minutes ago"
      }
    ],
    relatedAlerts: [
      {
        id: 7,
        title: "Product launch social media campaign exceeding engagement targets",
        severity: "opportunity",
        status: "acknowledged",
        timestamp: "2025-06-01T16:45:00",
        relativeTime: "1 day ago"
      }
    ]
  }
};

// Loader function to fetch alert data
export const loader: LoaderFunction = async ({ params }) => {
  const alertId = params.alertId;
  
  // In a real app, we would fetch this data from an API
  // For now, we'll use our mock data
  const alert = mockAlertData[alertId as string];
  
  if (!alert) {
    throw new Response("Alert not found", { status: 404 });
  }
  
  return json({ alert });
};

export default function AlertDetail() {
  const { alert } = useLoaderData<{ alert: Alert }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [noteText, setNoteText] = useState("");
  
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
  
  // Function to get sentiment color
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return "text-green-500";
    if (sentiment > 0) return "text-green-400";
    if (sentiment > -0.5) return "text-red-400";
    return "text-red-500";
  };

  return (
    <div>
      {/* Breadcrumb navigation */}
      <div className="flex items-center mb-6 text-sm">
        <Link to="/alerts" className="text-gray-500 dark:text-silver hover:text-amber">
          Alerts
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-charcoal dark:text-offwhite">Alert #{alert.id}</span>
      </div>
      
      {/* Alert header */}
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden mb-6">
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
              <h1 className="text-xl font-bold text-charcoal dark:text-offwhite">{alert.title}</h1>
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
                className="px-4 py-2 rounded-md bg-amber text-charcoal font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Acknowledge
              </motion.button>
              <motion.button
                className="px-4 py-2 rounded-md bg-green-500 text-white font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resolve
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for different sections */}
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-b-2 border-amber text-amber"
                  : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "content"
                  ? "border-b-2 border-amber text-amber"
                  : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
              }`}
            >
              Content Analysis
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "activity"
                  ? "border-b-2 border-amber text-amber"
                  : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab("related")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "related"
                  ? "border-b-2 border-amber text-amber"
                  : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
              }`}
            >
              Related
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Alert Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver">Source</h3>
                    <p className="text-charcoal dark:text-offwhite">{alert.source}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver">Detected At</h3>
                    <p className="text-charcoal dark:text-offwhite">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver">Severity</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver">Assignee</h3>
                    <p className="text-charcoal dark:text-offwhite">{alert.assignee}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-silver">Entities</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {alert.entities.map((entity, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-silver px-2.5 py-0.5 rounded text-xs">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Notes</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-500 dark:text-silver">
                    <p>No notes added yet</p>
                  </div>
                  
                  <div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note..."
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
                      rows={4}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <motion.button
                        className="px-4 py-2 rounded-md bg-amber text-charcoal font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!noteText.trim()}
                      >
                        Add Note
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Content Analysis tab */}
          {activeTab === "content" && alert.content && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Content Summary</h2>
                <p className="text-charcoal dark:text-offwhite">{alert.content.summary}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Sentiment Analysis</h2>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${alert.content.sentiment > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(alert.content.sentiment * 100)}%`, marginLeft: alert.content.sentiment < 0 ? 'auto' : '0' }}
                    ></div>
                  </div>
                  <span className={`ml-3 ${getSentimentColor(alert.content.sentiment)}`}>
                    {alert.content.sentiment > 0 ? '+' : ''}{(alert.content.sentiment * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-silver mt-2">{alert.content.context}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Source Content</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-600 dark:text-silver">
                  <p>{alert.content.rawText}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Activity tab */}
          {activeTab === "activity" && alert.timeline && (
            <div>
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Activity Timeline</h2>
              <div className="space-y-4">
                {alert.timeline.map((item) => (
                  <div key={item.id} className="flex">
                    <div className="mr-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber bg-opacity-20">
                        <div className="w-3 h-3 rounded-full bg-amber"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-charcoal dark:text-offwhite">{item.action}</p>
                        <span className="text-xs text-gray-500 dark:text-silver">{item.relativeTime}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-silver mt-1">By {item.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Related tab */}
          {activeTab === "related" && alert.relatedAlerts && (
            <div>
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Related Alerts</h2>
              {alert.relatedAlerts.length > 0 ? (
                <div className="space-y-3">
                  {alert.relatedAlerts.map((relatedAlert) => (
                    <Link
                      key={relatedAlert.id}
                      to={`/alerts/${relatedAlert.id}`}
                      className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex h-2 w-2 rounded-full ${getSeverityColor(relatedAlert.severity).split(" ")[0]}`}></span>
                          <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">{relatedAlert.title}</h3>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-silver">{relatedAlert.relativeTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-silver">No related alerts found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
