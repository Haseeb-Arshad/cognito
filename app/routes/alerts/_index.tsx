import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";

// Simulated data loader for alerts
export async function loader() {
  // In a real app, this would fetch data from an API
  return json({
    alerts: [
      {
        id: "alert-1",
        title: "Negative Press Coverage on Product X",
        entity: "Acme Corporation",
        source: "The Tech Times",
        timestamp: "2 hours ago",
        severity: "critical",
        status: "new",
        snippet: "Recent article criticizes the security features of Product X, highlighting potential vulnerabilities that could affect user data...",
      },
      {
        id: "alert-2",
        title: "Competitor Y Launched Similar Feature",
        entity: "XYZ Inc.",
        source: "Industry Insider",
        timestamp: "5 hours ago",
        severity: "high",
        status: "new",
        snippet: "XYZ Inc. announced a new feature that directly competes with our core offering. Initial market reaction appears positive...",
      },
      {
        id: "alert-3",
        title: "Market Gap Identified in Sector Z",
        entity: "Industry Sector",
        source: "Market Analysis Weekly",
        timestamp: "1 day ago",
        severity: "opportunity",
        status: "acknowledged",
        snippet: "Research indicates an unmet need in Sector Z, with potential for significant market growth. Current solutions are lacking in...",
      },
      {
        id: "alert-4",
        title: "Supply Chain Disruption Reported",
        entity: "Global Suppliers",
        source: "Global Trade News",
        timestamp: "2 days ago",
        severity: "medium",
        status: "acknowledged",
        snippet: "Logistics issues reported in the Asia-Pacific region may impact component availability in the coming weeks. Alternative suppliers...",
      },
      {
        id: "alert-5",
        title: "Positive Social Media Sentiment Spike",
        entity: "Our Brand",
        source: "Social Media Analysis",
        timestamp: "3 days ago",
        severity: "opportunity",
        status: "resolved",
        snippet: "Following the latest product update, social media mentions have increased by 43% with predominantly positive sentiment...",
      },
    ],
  });
}

export default function Alerts() {
  const data = useLoaderData<typeof loader>();
  const [filters, setFilters] = useState({
    severity: "all",
    status: "all",
    profile: "all",
    dateRange: "all",
    sort: "newest",
  });

  // Filter alerts based on current filters
  const filteredAlerts = data.alerts.filter((alert) => {
    if (filters.severity !== "all" && alert.severity !== filters.severity) return false;
    if (filters.status !== "all" && alert.status !== filters.status) return false;
    // Additional filters would be applied here in a real app
    return true;
  });

  // Sort alerts based on current sort option
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (filters.sort === "newest") {
      // This is a simplified sort - in a real app you would use actual timestamps
      return -1; // Just to simulate newest first
    } else if (filters.sort === "severity") {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, opportunity: 0 };
      return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
    }
    return 0;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuickAcknowledge = (id: string) => {
    // In a real app, this would call an API to update the alert status
    console.log(`Acknowledging alert ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Alerts</h1>
        <p className="text-graphite dark:text-silver">Monitor and manage important notifications</p>
      </header>

      {/* Filtering & Sorting Controls */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="opportunity">Opportunity</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="profile" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Monitored Profile
            </label>
            <select
              id="profile"
              name="profile"
              value={filters.profile}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Profiles</option>
              <option value="tech">Tech Industry</option>
              <option value="competitor">Competitor Analysis</option>
              <option value="customer">Customer Sentiment</option>
              <option value="market">Market Trends</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Date Range
            </label>
            <select
              id="dateRange"
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Sort By
            </label>
            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="severity">Severity</option>
            </select>
          </div>
        </div>

        {/* Active Filters - would be displayed if filters are applied */}
        {(filters.severity !== "all" || 
          filters.status !== "all" || 
          filters.profile !== "all" || 
          filters.dateRange !== "all") && (
          <div className="mt-4 pt-4 border-t border-steel border-opacity-20">
            <div className="text-sm text-graphite dark:text-silver mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {filters.severity !== "all" && (
                <FilterTag
                  label={`Severity: ${filters.severity}`}
                  onRemove={() => setFilters(prev => ({ ...prev, severity: "all" }))}
                />
              )}
              {filters.status !== "all" && (
                <FilterTag
                  label={`Status: ${filters.status}`}
                  onRemove={() => setFilters(prev => ({ ...prev, status: "all" }))}
                />
              )}
              {filters.profile !== "all" && (
                <FilterTag
                  label={`Profile: ${filters.profile}`}
                  onRemove={() => setFilters(prev => ({ ...prev, profile: "all" }))}
                />
              )}
              {filters.dateRange !== "all" && (
                <FilterTag
                  label={`Date: ${filters.dateRange}`}
                  onRemove={() => setFilters(prev => ({ ...prev, dateRange: "all" }))}
                />
              )}
              <button
                className="text-xs text-amber hover:underline"
                onClick={() => setFilters({
                  severity: "all",
                  status: "all",
                  profile: "all",
                  dateRange: "all",
                  sort: filters.sort,
                })}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alerts Display */}
      <div className="space-y-4">
        {sortedAlerts.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="flex justify-center mb-4">
              <SearchIcon className="h-12 w-12 text-silver" />
            </div>
            <h3 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-2">No alerts matching your criteria</h3>
            <p className="text-graphite dark:text-silver">Try adjusting your filters or check back later for new alerts.</p>
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onAcknowledge={handleQuickAcknowledge} 
            />
          ))
        )}
      </div>
    </div>
  );
}

// Alert Card Component
function AlertCard({ alert, onAcknowledge }: { alert: any, onAcknowledge: (id: string) => void }) {
  return (
    <div className="card hover:shadow-interactive transition-all border-l-4 flex" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-charcoal dark:text-offwhite">
              {alert.title}
            </h3>
            <p className="text-sm text-graphite dark:text-silver mt-1">
              For: <span className="font-medium">{alert.entity}</span> via <span className="font-medium">{alert.source}</span> • {alert.timestamp}
            </p>
          </div>
          <div className="flex space-x-2">
            {alert.status === "new" && (
              <button 
                className="btn-icon" 
                title="Acknowledge"
                onClick={() => onAcknowledge(alert.id)}
              >
                <CheckIcon />
              </button>
            )}
            <Link
              to={`/alerts/${alert.id}`}
              className="btn btn-secondary text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-graphite dark:text-silver">{alert.snippet}</p>
        </div>
        <div className="mt-3 flex items-center">
          <StatusBadge status={alert.status} />
          <SeverityBadge severity={alert.severity} />
        </div>
      </div>
    </div>
  );
}

// Utility Components
function FilterTag({ label, onRemove }: { label: string, onRemove: () => void }) {
  return (
    <div className="inline-flex items-center rounded-full bg-steel bg-opacity-20 py-1 pl-3 pr-2 text-xs text-graphite dark:text-silver">
      {label}
      <button className="ml-1 rounded-full p-1 hover:bg-steel hover:bg-opacity-30" onClick={onRemove}>
        <XSmallIcon />
      </button>
    </div>
  );
}

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
    <span className={`badge mr-2 ${colorClass}`}>
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
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function XSmallIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
