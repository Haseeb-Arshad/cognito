import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";

// Simulated data loader for the reports page
export async function loader() {
  // In a real app, this would fetch data from an API
  return json({
    savedReports: [
      {
        id: "report-1",
        name: "Monthly Executive Summary",
        description: "High-level overview of key metrics and trends for executive team",
        lastRun: "May 25, 2025",
        schedule: "Monthly",
        creator: "Jane Smith",
        type: "summary"
      },
      {
        id: "report-2",
        name: "Weekly Sentiment Analysis",
        description: "Detailed sentiment analysis across all monitored entities",
        lastRun: "May 28, 2025",
        schedule: "Weekly",
        creator: "John Doe",
        type: "sentiment"
      },
      {
        id: "report-3",
        name: "Competitor Activity Tracker",
        description: "Tracks mention volume and sentiment for key competitors",
        lastRun: "May 29, 2025",
        schedule: "Weekly",
        creator: "Jane Smith",
        type: "competitor"
      },
      {
        id: "report-4",
        name: "Crisis Response Analysis",
        description: "Post-mortem analysis of crisis response effectiveness",
        lastRun: "May 15, 2025",
        schedule: "On demand",
        creator: "Michael Chen",
        type: "crisis"
      }
    ],
    recentActivity: [
      {
        id: "activity-1",
        action: "Report generated",
        report: "Weekly Sentiment Analysis",
        user: "System",
        timestamp: "May 28, 2025 - 09:00 AM"
      },
      {
        id: "activity-2",
        action: "Report shared",
        report: "Competitor Activity Tracker",
        user: "Jane Smith",
        timestamp: "May 29, 2025 - 11:42 AM"
      },
      {
        id: "activity-3",
        action: "Report schedule modified",
        report: "Monthly Executive Summary",
        user: "Jane Smith",
        timestamp: "May 30, 2025 - 02:15 PM"
      }
    ],
    dataPoints: {
      totalAlerts: 147,
      alertsThisMonth: 42,
      topSources: [
        { name: "News Sites", count: 63 },
        { name: "Twitter", count: 42 },
        { name: "Forums", count: 28 },
        { name: "Blogs", count: 14 }
      ],
      sentimentDistribution: {
        positive: 35,
        neutral: 45,
        negative: 20
      },
      opportunitiesIdentified: 17
    }
  });
}

export default function Reports() {
  const data = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("saved");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredReports = data.savedReports.filter(report => 
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Reports</h1>
          <p className="text-graphite dark:text-silver">Create, schedule, and view insights</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon />
            <span>Create New Report</span>
          </button>
        </div>
      </header>

      {/* Analytics Snapshot */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">
          Analytics Snapshot
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-steel bg-opacity-10 rounded-lg p-4">
            <div className="text-sm text-graphite dark:text-silver mb-1">Total Alerts</div>
            <div className="text-2xl font-bold text-charcoal dark:text-offwhite">{data.dataPoints.totalAlerts}</div>
            <div className="text-xs text-graphite dark:text-silver mt-1">
              {data.dataPoints.alertsThisMonth} this month
            </div>
          </div>
          
          <div className="bg-steel bg-opacity-10 rounded-lg p-4">
            <div className="text-sm text-graphite dark:text-silver mb-1">Sentiment Distribution</div>
            <div className="flex items-end mt-2 h-10">
              <div 
                className="w-1/3 bg-success rounded-tl-sm rounded-bl-sm" 
                style={{ height: `${(data.dataPoints.sentimentDistribution.positive / 100) * 100}%` }}
              ></div>
              <div 
                className="w-1/3 bg-amber" 
                style={{ height: `${(data.dataPoints.sentimentDistribution.neutral / 100) * 100}%` }}
              ></div>
              <div 
                className="w-1/3 bg-warning rounded-tr-sm rounded-br-sm" 
                style={{ height: `${(data.dataPoints.sentimentDistribution.negative / 100) * 100}%` }}
              ></div>
            </div>
            <div className="flex text-xs text-graphite dark:text-silver mt-2 justify-between">
              <div>Positive: {data.dataPoints.sentimentDistribution.positive}%</div>
              <div>Neutral: {data.dataPoints.sentimentDistribution.neutral}%</div>
              <div>Negative: {data.dataPoints.sentimentDistribution.negative}%</div>
            </div>
          </div>
          
          <div className="bg-steel bg-opacity-10 rounded-lg p-4">
            <div className="text-sm text-graphite dark:text-silver mb-1">Top Sources</div>
            <div className="space-y-2 mt-2">
              {data.dataPoints.topSources.slice(0, 2).map((source, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="text-xs text-charcoal dark:text-offwhite">{source.name}</div>
                  <div className="text-xs text-graphite dark:text-silver">{source.count}</div>
                </div>
              ))}
              <div className="text-xs text-amber">+{data.dataPoints.topSources.length - 2} more sources</div>
            </div>
          </div>
          
          <div className="bg-steel bg-opacity-10 rounded-lg p-4">
            <div className="text-sm text-graphite dark:text-silver mb-1">Opportunities</div>
            <div className="text-2xl font-bold text-charcoal dark:text-offwhite">
              {data.dataPoints.opportunitiesIdentified}
            </div>
            <div className="text-xs text-graphite dark:text-silver mt-1">
              Identified from alert analysis
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Reports List */}
      <div className="card">
        <div className="border-b border-steel border-opacity-20">
          <div className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'saved'
                  ? 'border-amber text-charcoal dark:text-offwhite'
                  : 'border-transparent text-graphite dark:text-silver hover:text-charcoal hover:dark:text-offwhite'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Reports
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'templates'
                  ? 'border-amber text-charcoal dark:text-offwhite'
                  : 'border-transparent text-graphite dark:text-silver hover:text-charcoal hover:dark:text-offwhite'
              }`}
              onClick={() => setActiveTab('templates')}
            >
              Report Templates
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'activity'
                  ? 'border-amber text-charcoal dark:text-offwhite'
                  : 'border-transparent text-graphite dark:text-silver hover:text-charcoal hover:dark:text-offwhite'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Recent Activity
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'saved' && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {filteredReports.length === 0 ? (
                <div className="text-center p-8">
                  <SearchIcon className="h-12 w-12 text-silver mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-2">No reports found</h3>
                  <p className="text-graphite dark:text-silver">Try adjusting your search or create a new report.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TemplateCard
                title="Executive Summary"
                description="High-level overview of key metrics and trends for executive team"
                icon={<DocumentReportIcon />}
                color="#FFBF00" // amber
              />
              <TemplateCard
                title="Sentiment Analysis"
                description="Detailed sentiment analysis across all monitored entities"
                icon={<ChartBarIcon />}
                color="#63A375" // success
              />
              <TemplateCard
                title="Competitor Analysis"
                description="Tracks mention volume and sentiment for key competitors"
                icon={<TrendingUpIcon />}
                color="#57606f" // graphite
              />
              <TemplateCard
                title="Crisis Response"
                description="Analysis of alert frequency, response time, and resolution"
                icon={<ExclamationIcon />}
                color="#D97E6A" // warning
              />
              <TemplateCard
                title="Custom Report"
                description="Build a completely custom report with your selected metrics"
                icon={<PlusIcon />}
                color="#A4B0BD" // silver
              />
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {data.recentActivity.map((activity, idx) => (
                <div 
                  key={activity.id} 
                  className="flex gap-3 p-3 rounded-lg hover:bg-steel hover:bg-opacity-10 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-steel bg-opacity-20 flex items-center justify-center text-graphite">
                    {activity.action.includes("generated") ? (
                      <DocumentReportIcon className="h-4 w-4" />
                    ) : activity.action.includes("shared") ? (
                      <ShareIcon className="h-4 w-4" />
                    ) : (
                      <PencilIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-charcoal dark:text-offwhite">
                        {activity.action}: <span className="text-amber">{activity.report}</span>
                      </span>
                      <span className="text-graphite dark:text-silver">{activity.timestamp}</span>
                    </div>
                    <div className="text-sm text-graphite dark:text-silver mt-1">
                      {activity.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Report Card Component
function ReportCard({ report }: { report: any }) {
  return (
    <div className="border border-steel border-opacity-20 rounded-lg hover:border-amber hover:shadow-interactive transition-all overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-charcoal dark:text-offwhite">
                {report.name}
              </h3>
              <p className="text-sm text-graphite dark:text-silver mt-1">
                {report.description}
              </p>
            </div>
            <ReportTypeIcon type={report.type} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-graphite dark:text-silver">
            <div>Last run: {report.lastRun}</div>
            <div>Schedule: {report.schedule}</div>
            <div>Creator: {report.creator}</div>
          </div>
        </div>
        <div className="bg-steel bg-opacity-5 p-4 flex flex-row sm:flex-col justify-between sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l border-steel border-opacity-20">
          <button 
            className="btn btn-tertiary btn-sm"
          >
            <ViewIcon className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">View</span>
          </button>
          <button 
            className="btn btn-tertiary btn-sm"
          >
            <PlayIcon className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Run</span>
          </button>
          <button 
            className="btn btn-tertiary btn-sm"
          >
            <PencilIcon className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Template Card Component
function TemplateCard({ title, description, icon, color }: { title: string, description: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="border border-steel border-opacity-20 rounded-lg hover:border-amber hover:shadow-interactive transition-all p-4">
      <div className="h-10 w-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <h3 className="text-lg font-medium text-charcoal dark:text-offwhite mb-2">
        {title}
      </h3>
      <p className="text-sm text-graphite dark:text-silver mb-4">
        {description}
      </p>
      <button className="btn btn-tertiary btn-sm w-full">
        Use Template
      </button>
    </div>
  );
}

// Report Type Icon
function ReportTypeIcon({ type }: { type: string }) {
  let icon;
  let bgColor;
  
  switch (type) {
    case "summary":
      icon = <DocumentReportIcon />;
      bgColor = "#FFBF00"; // amber
      break;
    case "sentiment":
      icon = <ChartBarIcon />;
      bgColor = "#63A375"; // success
      break;
    case "competitor":
      icon = <TrendingUpIcon />;
      bgColor = "#57606f"; // graphite
      break;
    case "crisis":
      icon = <ExclamationIcon />;
      bgColor = "#D97E6A"; // warning
      break;
    default:
      icon = <DocumentReportIcon />;
      bgColor = "#A4B0BD"; // silver
  }
  
  return (
    <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${bgColor}20`, color: bgColor }}>
      {icon}
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function DocumentReportIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
    </svg>
  );
}

function ChartBarIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  );
}

function ExclamationIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function ViewIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
  );
}
