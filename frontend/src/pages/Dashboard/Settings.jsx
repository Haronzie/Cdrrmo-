import React, { useState } from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor,
  Bell,
  Shield,
  Database,
  Users,
  FileText,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Smartphone,
  ChevronLeft
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('appearance');
  const { theme, updateTheme } = useTheme();
  
  // Local state for pending theme change - sync with current theme
  const [pendingTheme, setPendingTheme] = useState(theme);
  
  // Update pendingTheme when theme changes from outside (like page refresh)
  React.useEffect(() => {
    setPendingTheme(theme);
  }, [theme]);
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      fileUploads: true,
      userRegistrations: true,
      systemAlerts: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30',
      passwordPolicy: 'strict',
      loginAttempts: '5'
    },
    system: {
      autoBackup: true,
      maintenanceMode: false,
      debugMode: false,
      apiLogging: true
    },
    display: {
      showUserCount: true,
      showFileStats: true,
      showSystemHealth: true,
      compactSidebar: false
    }
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    // Reset pending theme to light
    setPendingTheme('light');
    
    // Reset other settings to default
    setSettings({
      notifications: {
        email: true,
        push: true,
        fileUploads: true,
        userRegistrations: true,
        systemAlerts: true
      },
      security: {
        twoFactor: false,
        sessionTimeout: '30',
        passwordPolicy: 'strict',
        loginAttempts: '5'
      },
      system: {
        autoBackup: true,
        maintenanceMode: false,
        debugMode: false,
        apiLogging: true
      },
      display: {
        showUserCount: true,
        showFileStats: true,
        showSystemHealth: true,
        compactSidebar: false
      }
    });
  };

  const saveSettings = () => {
    // Apply the pending theme change
    updateTheme(pendingTheme);
    
    // In a real app, this would save other settings to backend
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database },
    { id: 'display', label: 'Display', icon: Eye }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className={`p-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg transition-colors`}>
                <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Admin Settings</h1>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Manage your dashboard preferences</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={resetSettings}
                className={`flex items-center px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              <button 
                onClick={saveSettings}
                className="flex items-center px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r min-h-screen`}>
          <div className="p-4">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? theme === 'dark' 
                          ? 'bg-green-900 text-green-300 border border-green-700'
                          : 'bg-green-50 text-green-700 border border-green-200'
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 p-6 ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
          <div className="max-w-4xl mx-auto">
            
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Appearance</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Customize how your dashboard looks and feels</p>
                </div>

                <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Theme</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    Select your preferred theme. Changes will be applied after clicking "Save Changes".
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
                      { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' }
                    ].map(themeOption => (
                      <button
                        key={themeOption.id}
                        onClick={() => setPendingTheme(themeOption.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          pendingTheme === themeOption.id
                            ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-400'
                            : theme === 'dark' 
                              ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <themeOption.icon className={`w-8 h-8 mx-auto mb-2 ${
                          pendingTheme === themeOption.id ? 'text-green-600 dark:text-green-400' : 
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                        <div className="text-center">
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{themeOption.label}</div>
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{themeOption.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {pendingTheme !== theme && (
                    <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                        Theme change pending. Click "Save Changes" to apply the new theme.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Notifications</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Control what notifications you receive</p>
                </div>

                <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                      { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications', icon: Smartphone },
                      { key: 'fileUploads', label: 'File Upload Alerts', desc: 'When new files are uploaded', icon: FileText },
                      { key: 'userRegistrations', label: 'New User Registrations', desc: 'When users register', icon: Users },
                      { key: 'systemAlerts', label: 'System Alerts', desc: 'Critical system notifications', icon: Bell }
                    ].map(notification => (
                      <div key={notification.key} className={`flex items-center justify-between p-4 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <notification.icon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                          <div>
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{notification.label}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{notification.desc}</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.notifications[notification.key]}
                            onChange={(e) => updateSetting('notifications', notification.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Security</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Manage your account security settings</p>
                </div>

                <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 space-y-6`}>
                  <div className={`flex items-center justify-between p-4 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <Lock className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                      <div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Two-Factor Authentication</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Add an extra layer of security</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.security.twoFactor}
                        onChange={(e) => updateSetting('security', 'twoFactor', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Session Timeout (minutes)</label>
                      <select 
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200 bg-white'}`}
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Max Login Attempts</label>
                      <select 
                        value={settings.security.loginAttempts}
                        onChange={(e) => updateSetting('security', 'loginAttempts', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200 bg-white'}`}
                      >
                        <option value="3">3 attempts</option>
                        <option value="5">5 attempts</option>
                        <option value="10">10 attempts</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>System</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Configure system-wide settings</p>
                </div>

                <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
                  <div className="space-y-4">
                    {[
                      { key: 'autoBackup', label: 'Automatic Backup', desc: 'Daily system backups', icon: Database },
                      { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Restrict system access', icon: Settings },
                      { key: 'debugMode', label: 'Debug Mode', desc: 'Show detailed error logs', icon: Globe },
                      { key: 'apiLogging', label: 'API Logging', desc: 'Log all API requests', icon: FileText }
                    ].map(setting => (
                      <div key={setting.key} className={`flex items-center justify-between p-4 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <setting.icon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                          <div>
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{setting.label}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{setting.desc}</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.system[setting.key]}
                            onChange={(e) => updateSetting('system', setting.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Display</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Customize what appears on your dashboard</p>
                </div>

                <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
                  <div className="space-y-4">
                    {[
                      { key: 'showUserCount', label: 'Show User Statistics', desc: 'Display user count widget', icon: Users },
                      { key: 'showFileStats', label: 'Show File Statistics', desc: 'Display file count widget', icon: FileText },
                      { key: 'showSystemHealth', label: 'Show System Health', desc: 'Display system health widget', icon: Database },
                      { key: 'compactSidebar', label: 'Compact Sidebar', desc: 'Use minimal sidebar layout', icon: Eye }
                    ].map(setting => (
                      <div key={setting.key} className={`flex items-center justify-between p-4 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <setting.icon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                          <div>
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{setting.label}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{setting.desc}</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.display[setting.key]}
                            onChange={(e) => updateSetting('display', setting.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}