import { useState } from "react";
import { motion } from "framer-motion";

type TabType = "profile" | "notifications" | "security" | "api";

export default function SettingsIndex() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <div className="container mx-auto">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-6" aria-label="Settings tabs">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
              activeTab === "profile"
                ? "border-amber text-amber"
                : "border-transparent text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`pb-3 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
              activeTab === "notifications"
                ? "border-amber text-amber"
                : "border-transparent text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Notifications
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
              activeTab === "security"
                ? "border-amber text-amber"
                : "border-transparent text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Security
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`pb-3 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
              activeTab === "api"
                ? "border-amber text-amber"
                : "border-transparent text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            API Keys
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "api" && <ApiKeySettings />}
        </motion.div>
      </div>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal dark:text-offwhite mb-6">Profile Settings</h2>
      
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=John+Doe&background=random"
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-amber flex items-center justify-center text-charcoal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-charcoal dark:text-offwhite">Profile Photo</h3>
              <p className="text-sm text-gray-500 dark:text-silver">
                Upload a new profile photo or remove the current one
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              defaultValue="John"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              defaultValue="Doe"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue="john.doe@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
            />
          </div>
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              defaultValue="Product Manager"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue="Product manager with 5+ years of experience in SaaS applications."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
          />
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-4 py-2 bg-amber text-charcoal font-medium rounded-md"
          >
            Save Changes
          </motion.button>
        </div>
      </form>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal dark:text-offwhite mb-6">Notification Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Email Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-charcoal dark:text-offwhite">Critical Alerts</h4>
                <p className="text-sm text-gray-500 dark:text-silver">Receive notifications for high-severity alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-charcoal dark:text-offwhite">Opportunity Alerts</h4>
                <p className="text-sm text-gray-500 dark:text-silver">Receive notifications for new opportunities detected</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-charcoal dark:text-offwhite">Digest Summary</h4>
                <p className="text-sm text-gray-500 dark:text-silver">Receive a daily summary of all alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">In-App Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-charcoal dark:text-offwhite">Real-time Alerts</h4>
                <p className="text-sm text-gray-500 dark:text-silver">Show real-time notifications in the app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-charcoal dark:text-offwhite">Sound Alerts</h4>
                <p className="text-sm text-gray-500 dark:text-silver">Play sound for critical notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="px-4 py-2 bg-amber text-charcoal font-medium rounded-md"
          >
            Save Preferences
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal dark:text-offwhite mb-6">Security Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Change Password</h3>
          
          <form className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
              />
            </div>
            
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
              />
            </div>
            
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite"
              />
            </div>
            
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 bg-amber text-charcoal font-medium rounded-md"
              >
                Update Password
              </motion.button>
            </div>
          </form>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Two-Factor Authentication</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-silver">Enable two-factor authentication for enhanced security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber"></div>
            </label>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Session Management</h3>
          
          <div className="bg-gray-50 dark:bg-[#2A2A2A] rounded-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-charcoal dark:text-offwhite">Current Session</h4>
                <p className="text-sm text-gray-500 dark:text-silver">Windows • Chrome • Last active: Just now</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300 text-xs rounded-full">
                Active
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="px-4 py-2 bg-red-500 bg-opacity-10 text-red-500 font-medium rounded-md hover:bg-opacity-20 transition-colors"
          >
            Sign Out From All Other Devices
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// API Key Settings Component
function ApiKeySettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-charcoal dark:text-offwhite mb-6">API Keys</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-silver">
            Manage API keys to authenticate with the Cognito API
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="px-4 py-2 bg-amber text-charcoal font-medium rounded-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Generate New Key
          </motion.button>
        </div>
        
        <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-[#2A2A2A] px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-charcoal dark:text-offwhite">Active API Keys</h3>
              <span className="text-xs text-gray-500 dark:text-silver">Last Created: May 15, 2023</span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-charcoal dark:text-offwhite">Production Key</h4>
                  <p className="text-xs text-gray-500 dark:text-silver mt-1">Created on May 15, 2023</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 dark:text-silver hover:text-amber">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-500 dark:text-silver hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-[#2A2A2A] rounded-md px-3 py-2">
                  <code className="text-xs text-gray-500 dark:text-silver font-mono">••••••••••••••••••••••••••••••••••••••••</code>
                  <button className="text-sm text-amber hover:underline">
                    Copy
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-charcoal dark:text-offwhite">Development Key</h4>
                  <p className="text-xs text-gray-500 dark:text-silver mt-1">Created on April 2, 2023</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 dark:text-silver hover:text-amber">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-500 dark:text-silver hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-[#2A2A2A] rounded-md px-3 py-2">
                  <code className="text-xs text-gray-500 dark:text-silver font-mono">••••••••••••••••••••••••••••••••••••••••</code>
                  <button className="text-sm text-amber hover:underline">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
