import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";

// Simulated data loader for the monitoring configurations
export async function loader() {
  // In a real app, this would fetch data from an API
  return json({
    configurations: [
      {
        id: "conf-1",
        name: "Tech Industry Monitoring",
        entity: "Acme Corporation",
        keywords: ["innovation", "technology", "startup", "AI"],
        status: "active",
        lastRun: "2 hours ago",
      },
      {
        id: "conf-2",
        name: "Competitor Analysis",
        entity: "XYZ Inc.",
        keywords: ["market share", "product launch", "partnership"],
        status: "active",
        lastRun: "5 hours ago",
      },
      {
        id: "conf-3",
        name: "Customer Sentiment",
        entity: "Our Product",
        keywords: ["feedback", "review", "rating", "experience"],
        status: "paused",
        lastRun: "2 days ago",
      },
      {
        id: "conf-4",
        name: "Market Trends",
        entity: "Industry Sector",
        keywords: ["growth", "forecast", "trend", "demand"],
        status: "active",
        lastRun: "1 day ago",
      },
    ],
  });
}

export default function MonitoringConfigurations() {
  const data = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any | null>(null);
  const navigate = useNavigate();

  const openModal = (config = null) => {
    setEditingConfig(config);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingConfig(null);
  };

  const handleEditConfig = (id: string) => {
    const config = data.configurations.find(c => c.id === id);
    openModal(config);
  };

  const handleToggleStatus = (id: string) => {
    // In a real app, this would call an API to update the status
    console.log(`Toggle status for configuration ${id}`);
  };

  const handleDeleteConfig = (id: string) => {
    // In a real app, this would show a confirmation dialog and then call an API
    console.log(`Delete configuration ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite">Monitoring Configurations</h1>
          <p className="text-graphite dark:text-silver">Manage your entity monitoring profiles</p>
        </div>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => openModal()}
        >
          <PlusIcon />
          <span>Add New Configuration</span>
        </button>
      </header>

      {/* Configurations List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-steel border-opacity-20">
              <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal dark:text-offwhite">Profile Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal dark:text-offwhite">Target Entity</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal dark:text-offwhite">Keywords</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal dark:text-offwhite">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal dark:text-offwhite">Last Run</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal dark:text-offwhite">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel divide-opacity-20">
            {data.configurations.map((config) => (
              <tr key={config.id} className="hover:bg-steel hover:bg-opacity-10 transition-colors">
                <td className="py-4 px-4 text-charcoal dark:text-steel">{config.name}</td>
                <td className="py-4 px-4 text-graphite dark:text-silver">{config.entity}</td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {config.keywords.slice(0, 2).map((keyword) => (
                      <span 
                        key={keyword} 
                        className="inline-block px-2 py-1 bg-steel bg-opacity-20 text-graphite dark:text-silver rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                    {config.keywords.length > 2 && (
                      <span className="inline-block px-2 py-1 bg-steel bg-opacity-20 text-graphite dark:text-silver rounded-full text-xs">
                        +{config.keywords.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`badge ${config.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                    {config.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </td>
                <td className="py-4 px-4 text-graphite dark:text-silver">{config.lastRun}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button 
                      className="btn-icon" 
                      title="Edit"
                      onClick={() => handleEditConfig(config.id)}
                    >
                      <EditIcon />
                    </button>
                    <button 
                      className="btn-icon" 
                      title={config.status === 'active' ? 'Pause' : 'Resume'}
                      onClick={() => handleToggleStatus(config.id)}
                    >
                      {config.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button 
                      className="btn-icon" 
                      title="Delete"
                      onClick={() => handleDeleteConfig(config.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Configuration Modal */}
      {isModalOpen && (
        <ConfigurationModal 
          config={editingConfig} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
}

// Configuration Modal Component
function ConfigurationModal({ config, onClose }: { config: any | null, onClose: () => void }) {
  const isEditing = !!config;
  const [formData, setFormData] = useState({
    name: config?.name || '',
    entity: config?.entity || '',
    keywords: config?.keywords?.join(', ') || '',
    industry: config?.industry || '',
    trustedSources: config?.trustedSources?.join('\n') || '',
    blockedSources: config?.blockedSources?.join('\n') || '',
    autoDiscover: config?.autoDiscover || true,
    sensitivity: config?.sensitivity || 'medium',
    notifyEmail: config?.notifyEmail || true,
    notifyInApp: config?.notifyInApp || true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the configuration via API
    console.log('Saving configuration:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-charcoal bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-offwhite dark:bg-charcoal rounded-lg shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-charcoal dark:text-offwhite">
              {isEditing ? 'Edit Configuration' : 'Create New Configuration'}
            </h2>
            <button className="btn-icon" onClick={onClose}>
              <XIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                  Profile Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="entity" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                  Target Entity (Company, Product, etc.)
                </label>
                <input
                  type="text"
                  id="entity"
                  name="entity"
                  value={formData.entity}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="input"
                  placeholder="innovation, technology, product"
                  required
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                  Industry
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select an industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="trustedSources" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                    Trusted Sources (one per line)
                  </label>
                  <textarea
                    id="trustedSources"
                    name="trustedSources"
                    value={formData.trustedSources}
                    onChange={handleChange}
                    className="input h-24"
                    placeholder="wsj.com&#10;nytimes.com&#10;reuters.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="blockedSources" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                    Blocked Sources (one per line)
                  </label>
                  <textarea
                    id="blockedSources"
                    name="blockedSources"
                    value={formData.blockedSources}
                    onChange={handleChange}
                    className="input h-24"
                    placeholder="example-spam.com&#10;unreliable-news.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="autoDiscover"
                    name="autoDiscover"
                    checked={formData.autoDiscover}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber focus:ring-amber-dark border-steel rounded"
                  />
                  <label htmlFor="autoDiscover" className="ml-2 block text-sm text-graphite dark:text-silver">
                    Auto-Discover New Sources
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                  Alert Sensitivity
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sensitivity"
                      value="low"
                      checked={formData.sensitivity === 'low'}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber focus:ring-amber-dark border-steel"
                    />
                    <span className="ml-2 text-sm text-graphite dark:text-silver">Low</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sensitivity"
                      value="medium"
                      checked={formData.sensitivity === 'medium'}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber focus:ring-amber-dark border-steel"
                    />
                    <span className="ml-2 text-sm text-graphite dark:text-silver">Medium</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sensitivity"
                      value="high"
                      checked={formData.sensitivity === 'high'}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber focus:ring-amber-dark border-steel"
                    />
                    <span className="ml-2 text-sm text-graphite dark:text-silver">High</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                  Notification Preferences
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifyEmail"
                      name="notifyEmail"
                      checked={formData.notifyEmail}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber focus:ring-amber-dark border-steel rounded"
                    />
                    <label htmlFor="notifyEmail" className="ml-2 block text-sm text-graphite dark:text-silver">
                      Email Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifyInApp"
                      name="notifyInApp"
                      checked={formData.notifyInApp}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber focus:ring-amber-dark border-steel rounded"
                    />
                    <label htmlFor="notifyInApp" className="ml-2 block text-sm text-graphite dark:text-silver">
                      In-App Notifications
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-steel border-opacity-20">
              <button type="button" className="btn btn-tertiary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Save Changes' : 'Create Configuration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Icons
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}
