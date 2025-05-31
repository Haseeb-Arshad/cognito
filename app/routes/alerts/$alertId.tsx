import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";

// Loader to fetch alert details
export async function loader({ params }: LoaderFunctionArgs) {
  const { alertId } = params;
  
  // In a real app, this would fetch data from an API
  // Here we simulate an API response for the requested alert
  const alert = {
    id: alertId,
    title: "Negative Press Coverage on Product X",
    entity: "Acme Corporation",
    source: "The Tech Times",
    publishedDate: "May 31, 2025",
    detectedDate: "May 31, 2025",
    timestamp: "2 hours ago",
    severity: "critical",
    status: "new",
    snippet: "Recent article criticizes the security features of Product X, highlighting potential vulnerabilities that could affect user data...",
    fullContent: `
      <p>The Tech Times has published a detailed investigation into Product X's security features, highlighting several vulnerabilities that were discovered during their extensive testing.</p>
      
      <p>"Our penetration testing team was able to bypass several of the advertised security measures within just a few hours," states the article, which goes on to list specific technical details about the alleged vulnerabilities.</p>
      
      <p>The report suggests that user data could be at risk, particularly for enterprise customers who rely on Product X for sensitive operations. Industry experts quoted in the article express concern about the implications, with one security researcher noting that "these types of vulnerabilities are precisely what malicious actors look for when targeting enterprise systems."</p>
      
      <p>Acme Corporation has not yet issued an official response to these allegations, but the article has already been shared widely across industry forums and social media platforms, generating significant discussion.</p>
    `,
    url: "https://techtimes.example.com/security-investigation-product-x",
    relatedEntities: ["Product X", "Security Sector", "Enterprise Solutions"],
    sentiment: -0.78,
    reach: "High (Est. 2.4M views)",
    tags: ["security", "vulnerability", "product_criticism", "data_privacy"],
    relatedAlerts: [
      {
        id: "alert-6",
        title: "Similar Security Concerns in Industry Publication",
        source: "Security Weekly",
        timestamp: "2 days ago",
        severity: "high",
      },
      {
        id: "alert-7",
        title: "Social Media Discussion about Product X Security",
        source: "Social Media Analysis",
        timestamp: "1 day ago",
        severity: "medium",
      }
    ],
    configuration: {
      id: "conf-1",
      name: "Tech Industry Monitoring"
    },
    activityLog: [
      {
        action: "Alert Generated",
        timestamp: "May 31, 2025 - 08:42 AM",
        user: "System",
        note: "Alert automatically generated based on keyword and sentiment analysis",
      },
      {
        action: "Alert Viewed",
        timestamp: "May 31, 2025 - 10:15 AM",
        user: "Jane Smith",
        note: "",
      }
    ]
  };
  
  return json({ alert });
}

export default function AlertDetail() {
  const { alert } = useLoaderData<typeof loader>();
  const [status, setStatus] = useState(alert.status);
  const [note, setNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const handleStatusChange = (newStatus: string) => {
    // In a real app, this would call an API to update the status
    console.log(`Changing status of alert ${alert.id} from ${status} to ${newStatus}`);
    setStatus(newStatus);
  };
  
  const handleAddNote = () => {
    if (!note.trim()) return;
    
    // In a real app, this would call an API to add the note
    console.log(`Adding note to alert ${alert.id}: ${note}`);
    setNote("");
    setIsAddingNote(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-graphite dark:text-silver">
          <li className="flex items-center">
            <Link to="/alerts" className="hover:text-amber transition-colors">Alerts</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
          </li>
          <li className="text-charcoal dark:text-offwhite font-medium truncate">
            {alert.title}
          </li>
        </ol>
      </nav>

      {/* Alert Header */}
      <div className="card p-6 border-l-4" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-charcoal dark:text-offwhite mb-2">
              {alert.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-graphite dark:text-silver">
              <span>Entity: <span className="font-medium">{alert.entity}</span></span>
              <span>•</span>
              <span>Source: <span className="font-medium">{alert.source}</span></span>
              <span>•</span>
              <span>Detected: <span className="font-medium">{alert.timestamp}</span></span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <StatusBadge status={status} />
              <SeverityBadge severity={alert.severity} />
              <span className="badge bg-steel bg-opacity-20 text-graphite dark:text-silver">
                <span className="font-medium">Profile:</span> {alert.configuration.name}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {status === "new" && (
              <button 
                className="btn btn-secondary"
                onClick={() => handleStatusChange("acknowledged")}
              >
                Acknowledge
              </button>
            )}
            {(status === "new" || status === "acknowledged") && (
              <button 
                className="btn btn-primary"
                onClick={() => handleStatusChange("resolved")}
              >
                Mark as Resolved
              </button>
            )}
            {status === "resolved" && (
              <button 
                className="btn btn-secondary"
                onClick={() => handleStatusChange("new")}
              >
                Reopen Alert
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Section */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">
              Content
            </h2>
            <div className="space-y-4">
              {/* Source Details */}
              <div className="flex justify-between text-sm text-graphite dark:text-silver mb-2">
                <div>
                  Published on <span className="font-medium">{alert.publishedDate}</span>
                </div>
                <a 
                  href={alert.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber hover:underline flex items-center gap-1"
                >
                  View Original
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </div>
              
              {/* Alert Content */}
              <div className="prose prose-sm max-w-none dark:prose-invert border-l-2 border-steel border-opacity-50 pl-4">
                <div dangerouslySetInnerHTML={{ __html: alert.fullContent }} />
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">
              Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-steel bg-opacity-10 rounded-lg">
                <div className="text-sm text-graphite dark:text-silver mb-1">Sentiment Score</div>
                <div className="flex items-center">
                  <div className="h-2 flex-1 bg-steel bg-opacity-30 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${Math.abs(alert.sentiment) * 100}%`,
                        backgroundColor: alert.sentiment < 0 ? '#D97E6A' : '#63A375' 
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium text-charcoal dark:text-offwhite">
                    {alert.sentiment < 0 ? alert.sentiment : `+${alert.sentiment}`}
                  </span>
                </div>
              </div>
              
              <div className="p-3 bg-steel bg-opacity-10 rounded-lg">
                <div className="text-sm text-graphite dark:text-silver mb-1">Potential Reach</div>
                <div className="font-medium text-charcoal dark:text-offwhite">{alert.reach}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-graphite dark:text-silver mb-2">Key Entities</div>
              <div className="flex flex-wrap gap-2">
                {alert.relatedEntities.map((entity, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block px-2 py-1 bg-steel bg-opacity-20 text-graphite dark:text-silver rounded-full text-sm"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-graphite dark:text-silver mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {alert.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block px-2 py-1 bg-amber bg-opacity-20 text-amber-dark rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Activity & Notes */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite">
                Activity & Notes
              </h2>
              <button 
                className="btn btn-tertiary flex items-center gap-1 text-sm"
                onClick={() => setIsAddingNote(true)}
              >
                <PlusIcon className="h-4 w-4" />
                Add Note
              </button>
            </div>

            {isAddingNote && (
              <div className="mb-4 p-3 border border-steel border-opacity-30 rounded-lg">
                <textarea
                  className="input mb-3 h-24"
                  placeholder="Enter your note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button 
                    className="btn btn-tertiary"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNote("");
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddNote}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {alert.activityLog.map((activity, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-3 pb-4 border-b border-steel border-opacity-20 last:border-0"
                >
                  <div className="h-8 w-8 rounded-full bg-steel bg-opacity-20 flex items-center justify-center text-graphite">
                    {activity.action === "Alert Generated" ? (
                      <AlertIcon className="h-4 w-4" />
                    ) : activity.action === "Alert Viewed" ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <DocumentTextIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-charcoal dark:text-offwhite">{activity.action}</span>
                      <span className="text-graphite dark:text-silver">{activity.timestamp}</span>
                    </div>
                    <div className="text-sm text-graphite dark:text-silver mt-1">
                      {activity.user}
                      {activity.note && (
                        <p className="mt-1 text-charcoal dark:text-offwhite">{activity.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Alerts */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">
              Related Alerts
            </h2>
            <div className="space-y-3">
              {alert.relatedAlerts.map((relatedAlert) => (
                <Link 
                  key={relatedAlert.id}
                  to={`/alerts/${relatedAlert.id}`}
                  className="block p-3 rounded-lg border border-steel border-opacity-20 hover:border-amber hover:shadow-interactive transition-all"
                >
                  <div className="flex items-start gap-2">
                    <div 
                      className="h-3 w-3 rounded-full mt-1.5"
                      style={{ backgroundColor: getSeverityColor(relatedAlert.severity) }}
                    ></div>
                    <div>
                      <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">
                        {relatedAlert.title}
                      </h3>
                      <p className="text-xs text-graphite dark:text-silver mt-1">
                        {relatedAlert.source} • {relatedAlert.timestamp}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link 
                to="/alerts" 
                className="text-sm text-amber hover:text-amber-dark flex items-center justify-center gap-1"
              >
                View All Alerts
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <button className="btn btn-secondary w-full text-left flex items-center gap-2">
                <ShareIcon className="h-5 w-5" />
                <span>Share with Team</span>
              </button>
              <button className="btn btn-secondary w-full text-left flex items-center gap-2">
                <DownloadIcon className="h-5 w-5" />
                <span>Export Report</span>
              </button>
              <button className="btn btn-secondary w-full text-left flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                <span>Set Custom Alert</span>
              </button>
              <button className="btn btn-tertiary w-full text-left flex items-center gap-2 text-warning">
                <TrashIcon className="h-5 w-5" />
                <span>Delete Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility Components
function StatusBadge({ status }: { status: string }) {
  let label = "Unknown";
  let colorClass = "bg-silver bg-opacity-20 text-silver";
  
  switch (status) {
    case "new":
      label = "New";
      colorClass = "bg-amber bg-opacity-20 text-amber";
      break;
    case "acknowledged":
      label = "Acknowledged";
      colorClass = "bg-graphite bg-opacity-20 text-graphite dark:text-silver";
      break;
    case "resolved":
      label = "Resolved";
      colorClass = "bg-success bg-opacity-20 text-success";
      break;
  }
  
  return (
    <span className={`badge ${colorClass}`}>
      {label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  let label = "Unknown";
  let colorClass = "bg-silver bg-opacity-20 text-silver";
  
  switch (severity) {
    case "critical":
      label = "Critical";
      colorClass = "bg-warning bg-opacity-20 text-warning";
      break;
    case "high":
      label = "High";
      colorClass = "bg-warning bg-opacity-20 text-warning";
      break;
    case "medium":
      label = "Medium";
      colorClass = "bg-amber bg-opacity-20 text-amber";
      break;
    case "low":
      label = "Low";
      colorClass = "bg-graphite bg-opacity-20 text-graphite dark:text-silver";
      break;
    case "opportunity":
      label = "Opportunity";
      colorClass = "bg-success bg-opacity-20 text-success";
      break;
  }
  
  return (
    <span className={`badge ${colorClass}`}>
      {label}
    </span>
  );
}

// Utility function to get severity color
function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
    case "high":
      return "#D97E6A"; // warning color
    case "medium":
      return "#FFBF00"; // amber color
    case "low":
      return "#57606f"; // graphite color
    case "opportunity":
      return "#63A375"; // success color
    default:
      return "#A4B0BD"; // silver color
  }
}

// Icons
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  );
}

function DocumentTextIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}
