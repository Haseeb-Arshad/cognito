import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

// Simulated data loader for the dashboard
export async function loader() {
  // In a real app, this would fetch data from an API
  return json({
    stats: {
      activeCrises: 3,
      newOpportunities: 7,
      entitiesMonitored: 12,
    },
    sentimentTrend: generateSentimentData(),
    volumeTrend: generateVolumeData(),
    recentAlerts: [
      {
        id: "alert-1",
        severity: "critical",
        title: "Negative Press Coverage on Product X",
        source: "The Tech Times",
        timestamp: "2 hours ago",
      },
      {
        id: "alert-2",
        severity: "critical",
        title: "Competitor Y Launched Similar Feature",
        source: "Industry Insider",
        timestamp: "5 hours ago",
      },
      {
        id: "alert-3",
        severity: "opportunity",
        title: "Market Gap Identified in Sector Z",
        source: "Market Analysis Weekly",
        timestamp: "1 day ago",
      },
      {
        id: "alert-4",
        severity: "warning",
        title: "Supply Chain Disruption Reported",
        source: "Global Trade News",
        timestamp: "2 days ago",
      },
    ],
    hotTopics: [
      { name: "Product Innovation", weight: 10 },
      { name: "Market Expansion", weight: 8 },
      { name: "Sustainability", weight: 7 },
      { name: "Customer Experience", weight: 6 },
      { name: "Digital Transformation", weight: 9 },
      { name: "Competitive Analysis", weight: 5 },
    ],
  });
}

// Helper to generate sentiment data
function generateSentimentData() {
  const dates = getLast30Days();
  return {
    labels: dates,
    datasets: [
      {
        label: "Positive",
        data: dates.map(() => Math.floor(Math.random() * 50) + 50),
        borderColor: "#63A375",
        backgroundColor: "rgba(99, 163, 117, 0.1)",
      },
      {
        label: "Neutral",
        data: dates.map(() => Math.floor(Math.random() * 40) + 30),
        borderColor: "#A4B0BD",
        backgroundColor: "rgba(164, 176, 189, 0.1)",
      },
      {
        label: "Negative",
        data: dates.map(() => Math.floor(Math.random() * 30) + 10),
        borderColor: "#D97E6A",
        backgroundColor: "rgba(217, 126, 106, 0.1)",
      },
    ],
  };
}

// Helper to generate volume data
function generateVolumeData() {
  const dates = getLast30Days();
  return {
    labels: dates,
    datasets: [
      {
        label: "Crisis Mentions",
        data: dates.map(() => Math.floor(Math.random() * 10)),
        borderColor: "#D97E6A",
        backgroundColor: "rgba(217, 126, 106, 0.1)",
      },
      {
        label: "Opportunity Mentions",
        data: dates.map(() => Math.floor(Math.random() * 15)),
        borderColor: "#63A375",
        backgroundColor: "rgba(99, 163, 117, 0.1)",
      },
    ],
  };
}

// Helper to get last 30 days as formatted strings
function getLast30Days() {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  const [mounted, setMounted] = useState(false);
  
  // Used to ensure charts are only rendered client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Dashboard</h1>
        <p className="text-graphite dark:text-silver">Overview of your monitoring activities</p>
      </header>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={<CrisisIcon />} 
          value={data.stats.activeCrises} 
          label="Active Crises" 
          color="warning"
        />
        <StatCard 
          icon={<OpportunityIcon />} 
          value={data.stats.newOpportunities} 
          label="New Opportunities" 
          color="success"
        />
        <StatCard 
          icon={<EntityIcon />} 
          value={data.stats.entitiesMonitored} 
          label="Entities Monitored" 
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sentiment Over Time" height="300px">
          {mounted && <SentimentChart data={data.sentimentTrend} />}
        </ChartCard>
        <ChartCard title="Crisis/Opportunity Volume" height="300px">
          {mounted && <VolumeChart data={data.volumeTrend} />}
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite">Recent Critical Alerts</h2>
            <a href="/alerts" className="text-amber text-sm hover:underline">View All</a>
          </div>
          <div className="space-y-3">
            {data.recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-start p-3 rounded-md transition-all hover:bg-steel hover:bg-opacity-10"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                <div className="ml-3 flex-1">
                  <div className="font-medium text-charcoal dark:text-steel">{alert.title}</div>
                  <div className="text-sm text-graphite dark:text-silver">
                    via {alert.source} • {alert.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Topics */}
        <div className="card">
          <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">Emerging Themes</h2>
          <div className="flex flex-wrap gap-2">
            {data.hotTopics.map((topic) => (
              <span 
                key={topic.name} 
                className="inline-block px-3 py-1.5 bg-steel bg-opacity-20 text-graphite dark:text-silver rounded-full text-sm"
                style={{ 
                  fontSize: `${Math.max(0.8, Math.min(1.2, topic.weight / 8))}rem`,
                  opacity: Math.max(0.7, Math.min(1, topic.weight / 10))
                }}
              >
                {topic.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility to get severity color class
function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'bg-warning';
    case 'opportunity': return 'bg-success';
    default: return 'bg-silver';
  }
}

// Components
function StatCard({ icon, value, label, color }: { icon: React.ReactNode, value: number, label: string, color: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  const colorClass = color === 'warning' 
    ? 'text-warning' 
    : color === 'success' 
      ? 'text-success' 
      : 'text-amber';
  
  return (
    <div className="card flex items-start">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
        {icon}
      </div>
      <div className="ml-4">
        <div className="text-2xl font-bold text-charcoal dark:text-offwhite">{displayValue}</div>
        <div className="text-sm text-graphite dark:text-silver">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children, height }: { title: string, children: React.ReactNode, height: string }) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-charcoal dark:text-offwhite mb-4">{title}</h2>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

// Chart Components (placeholders - in a real app, you'd use a charting library like Chart.js or recharts)
function SentimentChart({ data }: { data: any }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-graphite text-sm">
        [Sentiment Chart Visualization]
        <br />
        <span className="text-xs">
          In a real implementation, this would be a line chart showing sentiment trends
        </span>
      </div>
    </div>
  );
}

function VolumeChart({ data }: { data: any }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-graphite text-sm">
        [Volume Chart Visualization]
        <br />
        <span className="text-xs">
          In a real implementation, this would be an area chart showing crisis/opportunity volume
        </span>
      </div>
    </div>
  );
}

// Icons
function CrisisIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function OpportunityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function EntityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
