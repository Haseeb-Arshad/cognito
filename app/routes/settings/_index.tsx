import { useState } from "react";
import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Settings | Cognito" },
    { name: "description", content: "Cognito settings and preferences" },
  ];
};

export async function loader() {
  // In a real app, this would fetch user settings from a database
  return json({
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://via.placeholder.com/150",
      role: "Administrator",
      timezone: "America/New_York",
    },
    preferences: {
      theme: "system",
      notifications: {
        email: true,
        push: true,
        sms: false,
        digest: "daily",
      },
      display: {
        dashboardLayout: "default",
        compactView: false,
        showHelpTips: true,
      }
    }
  });
}

export default function Settings() {
  const { user, preferences } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Settings</h1>
        <p className="text-graphite dark:text-silver">Configure your Cognito experience</p>
      </header>
      
      <div className="card">
        <div className="border-b border-steel border-opacity-20">
          <div className="flex overflow-x-auto">
            <TabButton
              label="Account"
              isActive={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            />
            <TabButton
              label="Notifications"
              isActive={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            />
            <TabButton
              label="API & Integrations"
              isActive={activeTab === "api"}
              onClick={() => setActiveTab("api")}
            />
            <TabButton
              label="Display & Appearance"
              isActive={activeTab === "display"}
              onClick={() => setActiveTab("display")}
            />
            <TabButton
              label="Security"
              isActive={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            />
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === "account" && <AccountSettings user={user} />}
          {activeTab === "notifications" && <NotificationSettings preferences={preferences.notifications} />}
          {activeTab === "api" && <ApiSettings />}
          {activeTab === "display" && <DisplaySettings preferences={preferences.display} />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      className={`px-6 py-4 text-sm font-medium border-b-2 ${
        isActive
          ? 'border-amber text-charcoal dark:text-offwhite'
          : 'border-transparent text-graphite dark:text-silver hover:text-charcoal hover:dark:text-offwhite'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// Account Settings Component
function AccountSettings({ user }: { user: any }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [timezone, setTimezone] = useState(user.timezone);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving account settings:", { name, email, timezone });
    // In a real app, this would call an API to update user settings
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0">
          <div className="relative h-20 w-20">
            <img
              className="h-20 w-20 rounded-full"
              src={user.avatar}
              alt={user.name}
            />
            <div className="absolute bottom-0 right-0">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber text-white shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">{user.name}</h2>
          <p className="text-sm text-graphite dark:text-silver">{user.role}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="input"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            <option value="Europe/Paris">Central European Time (CET)</option>
            <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
          </select>
        </div>
        
        <div className="pt-4">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings({ preferences }: { preferences: any }) {
  const [emailNotifs, setEmailNotifs] = useState(preferences.email);
  const [pushNotifs, setPushNotifs] = useState(preferences.push);
  const [smsNotifs, setSmsNotifs] = useState(preferences.sms);
  const [digest, setDigest] = useState(preferences.digest);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving notification settings:", { 
      email: emailNotifs, 
      push: pushNotifs, 
      sms: smsNotifs, 
      digest 
    });
    // In a real app, this would call an API to update notification settings
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Notification Channels</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">Email Notifications</h3>
                <p className="text-xs text-graphite dark:text-silver">Receive alert notifications via email</p>
              </div>
              <Toggle enabled={emailNotifs} setEnabled={setEmailNotifs} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">Push Notifications</h3>
                <p className="text-xs text-graphite dark:text-silver">Receive alerts as browser notifications</p>
              </div>
              <Toggle enabled={pushNotifs} setEnabled={setPushNotifs} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">SMS Notifications</h3>
                <p className="text-xs text-graphite dark:text-silver">Receive critical alerts via SMS</p>
              </div>
              <Toggle enabled={smsNotifs} setEnabled={setSmsNotifs} />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Summary Digests</h2>
          
          <div className="space-y-4">
            <label htmlFor="digest" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Digest Frequency
            </label>
            <select
              id="digest"
              value={digest}
              onChange={(e) => setDigest(e.target.value)}
              className="input"
            >
              <option value="never">Never</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
        
        <div className="pt-4">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// API & Integrations Component
function ApiSettings() {
  const [apiKey, setApiKey] = useState("cogn_123456789abcdefghijklmnopqrstuvwxyz");
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook");
  const [integrations, setIntegrations] = useState([
    { id: "slack", name: "Slack", connected: true, icon: "slack" },
    { id: "teams", name: "Microsoft Teams", connected: false, icon: "teams" },
    { id: "jira", name: "Jira", connected: true, icon: "jira" },
    { id: "github", name: "GitHub", connected: false, icon: "github" },
  ]);
  
  const handleRegenerateApiKey = () => {
    // In a real app, this would call an API to regenerate the key
    const newKey = "cogn_" + Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    console.log("Regenerated API key:", newKey);
  };
  
  const handleSaveWebhook = () => {
    console.log("Saving webhook URL:", webhookUrl);
    // In a real app, this would call an API to save the webhook URL
  };
  
  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, connected: !integration.connected } 
        : integration
    ));
    console.log(`Toggling integration ${id}`);
    // In a real app, this would call an API to connect/disconnect the integration
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a toast notification here
    console.log("Copied to clipboard:", text);
  };
  
  return (
    <div className="space-y-8">
      {/* API Key Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">API Access</h2>
        <p className="text-sm text-graphite dark:text-silver">
          Use this API key to authenticate requests with the Cognito API.
        </p>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={apiKey}
            readOnly
            className="input flex-grow font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => copyToClipboard(apiKey)}
            className="btn btn-secondary"
            title="Copy to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleRegenerateApiKey}
            className="btn btn-danger"
            title="Regenerate API key"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="rounded-md bg-amber bg-opacity-10 p-3 text-sm text-graphite dark:text-silver">
          <p className="font-medium text-amber">Security Notice</p>
          <p className="mt-1">Keep your API key secure. Regenerate it immediately if you suspect it has been compromised.</p>
        </div>
      </div>
      
      {/* Webhooks Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">Webhooks</h2>
        <p className="text-sm text-graphite dark:text-silver">
          Configure webhook endpoints to receive real-time alerts and notifications.
        </p>
        
        <div className="space-y-2">
          <label htmlFor="webhook-url" className="block text-sm font-medium text-graphite dark:text-silver">
            Webhook URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="webhook-url"
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="input flex-grow"
              placeholder="https://"
            />
            <button
              type="button"
              onClick={handleSaveWebhook}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      
      {/* Integrations Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">Integrations</h2>
        <p className="text-sm text-graphite dark:text-silver">
          Connect Cognito with your favorite tools and services.
        </p>
        
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between rounded-md border border-steel border-opacity-20 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-steel bg-opacity-10">
                  {renderIntegrationIcon(integration.icon)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">{integration.name}</h3>
                  <p className="text-xs text-graphite dark:text-silver">
                    {integration.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleIntegration(integration.id)}
                className={`btn ${integration.connected ? "btn-danger" : "btn-primary"}`}
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to render integration icons
function renderIntegrationIcon(icon: string) {
  switch (icon) {
    case "slack":
      return (
        <svg className="h-6 w-6 text-[#4A154B]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
        </svg>
      );
    case "teams":
      return (
        <svg className="h-6 w-6 text-[#6264A7]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.0593 8.36772h7.1464c.592 0 1.0737.47905 1.0737 1.07133v5.93535c0 1.7806-1.4468 3.223-3.2307 3.223h-3.958c-1.7839 0-3.2307-1.4424-3.2307-3.223v-5.82936c0-.23725.198-.42852.4357-.42852h1.0737c.3551 0 .6443.28837.6443.6442v5.40608c0 .9233.749 1.6788 1.677 1.6788h3.7961c.9233 0 1.677-.7502 1.677-1.6788v-5.19478c0-.27642-.2235-.49993-.5--.49993h-5.7264c-.3559 0-.6442-.28896-.6442-.64503v-.90597c0-.35606.2883-.64502.6442-.64502zm-5.92553 3.77408h.81503c.22507 0 .4093.1735.4093.3974v5.9783c0 .2217-.18423.401-.4093.401h-.81503c-.22507 0-.40933-.1793-.40933-.401v-5.9783c0-.2239.18426-.3974.40933-.3974zm10.78053-7.5564c1.1236 0 2.0352.90936 2.0352 2.0315 0 1.12151-.9116 2.0316-2.0352 2.0316-1.1228 0-2.0345-.91006-2.0345-2.0316 0-1.12214.9117-2.0315 2.0345-2.0315zm-9.91607.00011c1.06173 0 1.92377.86134 1.92377 1.92236 0 1.06173-.86204 1.92307-1.92377 1.92307-1.06173 0-1.92307-.86134-1.92307-1.92307 0-1.06102.86134-1.92236 1.92307-1.92236z" />
        </svg>
      );
    case "jira":
      return (
        <svg className="h-6 w-6 text-[#0052CC]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.571 11.513H0a5.98 5.98 0 0 0 5.989 5.989h2.059v-2.059a3.926 3.926 0 0 1 3.926-3.93h-.403zm6.213-6.213H6.213a5.98 5.98 0 0 0 5.989 5.989h2.059V9.23a3.926 3.926 0 0 1 3.926-3.93h-.403zm5.989-5.3H12.381a5.98 5.98 0 0 0 5.989 5.989h2.059V3.93A3.926 3.926 0 0 1 24 0h-.227z" />
        </svg>
      );
    case "github":
      return (
        <svg className="h-6 w-6 text-charcoal dark:text-offwhite" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6 text-graphite" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3z" />
        </svg>
      );
  }
}

// Toggle Component
function Toggle({ enabled, setEnabled }: { enabled: boolean; setEnabled: (enabled: boolean) => void }) {
  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-amber' : 'bg-steel'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2`}
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled(!enabled)}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      >
        <span
          className={`${
            enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
          } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-steel" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className={`${
            enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
          } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-amber" fill="currentColor" viewBox="0 0 12 12">
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

// Display & Appearance Settings Component
function DisplaySettings({ preferences }: { preferences: any }) {
  const [theme, setTheme] = useState(preferences.theme || "system");
  const [compactView, setCompactView] = useState(preferences.compactView || false);
  const [showHelpTips, setShowHelpTips] = useState(preferences.showHelpTips || true);
  const [dashboardLayout, setDashboardLayout] = useState(preferences.dashboardLayout || "default");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving display settings:", { theme, compactView, showHelpTips, dashboardLayout });
    // In a real app, this would call an API to update display settings
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">Theme</h2>
          <p className="text-sm text-graphite dark:text-silver">
            Choose how Cognito appears to you.
          </p>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ThemeOption
              id="light"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
              title="Light"
              description="Light mode for bright environments"
            />
            
            <ThemeOption
              id="dark"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
              title="Dark"
              description="Dark mode for low-light environments"
            />
            
            <ThemeOption
              id="system"
              name="theme"
              value="system"
              checked={theme === "system"}
              onChange={() => setTheme("system")}
              title="System"
              description="Follow your system preference"
            />
          </div>
        </div>
        
        {/* Dashboard Layout */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">Dashboard Layout</h2>
          <p className="text-sm text-graphite dark:text-silver">
            Choose how information is displayed on your dashboard.
          </p>
          
          <div>
            <label htmlFor="dashboard-layout" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Layout Style
            </label>
            <select
              id="dashboard-layout"
              value={dashboardLayout}
              onChange={(e) => setDashboardLayout(e.target.value)}
              className="input"
            >
              <option value="default">Default (Standard Layout)</option>
              <option value="compact">Compact (More Information Density)</option>
              <option value="expanded">Expanded (Focus on Individual Items)</option>
              <option value="data-first">Data-First (Emphasize Charts & Metrics)</option>
            </select>
          </div>
        </div>
        
        {/* Appearance Options */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">Interface Options</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">Compact View</h3>
                <p className="text-xs text-graphite dark:text-silver">Reduce spacing and show more content</p>
              </div>
              <Toggle enabled={compactView} setEnabled={setCompactView} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">Help Tips</h3>
                <p className="text-xs text-graphite dark:text-silver">Show helpful tooltips throughout the interface</p>
              </div>
              <Toggle enabled={showHelpTips} setEnabled={setShowHelpTips} />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// Theme Option Component
function ThemeOption({ id, name, value, checked, onChange, title, description }: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${checked ? 'border-amber bg-amber bg-opacity-5' : 'border-steel border-opacity-20'}`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <div className="text-sm">
            <label htmlFor={id} className="font-medium text-charcoal dark:text-offwhite cursor-pointer">
              {title}
            </label>
            <p className="text-xs text-graphite dark:text-silver">{description}</p>
          </div>
        </div>
        {checked && (
          <div className="shrink-0 text-amber">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [error, setError] = useState("");
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    console.log("Changing password");
    // In a real app, this would call an API to change the password
    
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleToggleTwoFactor = () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    console.log(`${newState ? "Enabling" : "Disabling"} two-factor authentication`);
    // In a real app, this would call an API to enable/disable 2FA
  };
  
  const handleSessionTimeoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSessionTimeout(e.target.value);
    console.log("Setting session timeout to", e.target.value, "minutes");
    // In a real app, this would call an API to update the session timeout
  };
  
  return (
    <div className="space-y-8">
      {/* Password Change Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">Change Password</h2>
        <p className="text-sm text-graphite dark:text-silver">
          It's a good idea to use a strong password that you don't use elsewhere.
        </p>
        
        {error && (
          <div className="rounded-md bg-warning bg-opacity-10 p-4 text-sm text-warning">
            {error}
          </div>
        )}
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-graphite dark:text-silver">
              At least 8 characters with a mix of letters, numbers, and symbols.
            </p>
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-2">
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </div>
        </form>
      </div>
      
      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">Two-Factor Authentication</h2>
        <p className="text-sm text-graphite dark:text-silver">
          Add an extra layer of security to your account by requiring both your password and an authentication code.
        </p>
        
        <div className="flex items-center justify-between p-4 border border-steel border-opacity-20 rounded-md">
          <div>
            <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">Two-Factor Authentication</h3>
            <p className="text-xs text-graphite dark:text-silver">
              {twoFactorEnabled ? "Enabled" : "Not enabled"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleTwoFactor}
            className={`btn ${twoFactorEnabled ? "btn-danger" : "btn-primary"}`}
          >
            {twoFactorEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
      
      {/* Session Settings */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-charcoal dark:text-offwhite">Session Settings</h2>
        <p className="text-sm text-graphite dark:text-silver">
          Control how long you stay signed in before requiring re-authentication.
        </p>
        
        <div>
          <label htmlFor="session-timeout" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
            Session Timeout
          </label>
          <select
            id="session-timeout"
            value={sessionTimeout}
            onChange={handleSessionTimeoutChange}
            className="input"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="480">8 hours</option>
            <option value="1440">24 hours</option>
          </select>
        </div>
        
        <div className="rounded-md bg-amber bg-opacity-10 p-4 text-sm text-graphite dark:text-silver">
          <p className="font-medium text-amber">Security Note</p>
          <p className="mt-1">For sensitive operations like payment and security changes, you'll always need to re-authenticate regardless of this setting.</p>
        </div>
      </div>
    </div>
  );
}
