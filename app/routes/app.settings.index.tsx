import { useState } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal dark:text-offwhite mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-amber text-amber"
                : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "account"
                ? "border-b-2 border-amber text-amber"
                : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "notifications"
                ? "border-b-2 border-amber text-amber"
                : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "appearance"
                ? "border-b-2 border-amber text-amber"
                : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "security"
                ? "border-b-2 border-amber text-amber"
                : "text-gray-500 dark:text-silver hover:text-charcoal dark:hover:text-offwhite"
            }`}
          >
            Security
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Profile Settings</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl text-gray-500 dark:text-silver mb-4">
                      JD
                    </div>
                    <button className="px-4 py-2 bg-amber text-charcoal rounded-md font-medium">
                      Change Photo
                    </button>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-silver mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-silver mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-silver mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-silver mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-silver mb-1">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="Director of Communications at ExampleCorp with over 10 years of experience in PR and crisis management."
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-charcoal dark:text-offwhite focus:outline-none focus:ring-2 focus:ring-amber"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 bg-amber text-charcoal rounded-md font-medium">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Account Settings</h2>
              <p className="text-gray-500 dark:text-silver">Account management options</p>
            </motion.div>
          )}
          
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Notification Preferences</h2>
              <p className="text-gray-500 dark:text-silver">Manage how you receive alerts and notifications</p>
            </motion.div>
          )}
          
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Appearance Settings</h2>
              <p className="text-gray-500 dark:text-silver">Customize the look and feel of the dashboard</p>
            </motion.div>
          )}
          
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-medium text-charcoal dark:text-offwhite mb-4">Security Settings</h2>
              <p className="text-gray-500 dark:text-silver">Manage passwords, 2FA, and sessions</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
