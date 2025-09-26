import { Users, FileText, Activity, TrendingUp, Calendar, Clock, UserPlus, ArrowUpRight, MoreHorizontal } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="h-full overflow-hidden">
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
          Updated {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Grid Layout - Optimized for viewport */}
      <div className="grid grid-cols-12 gap-6 h-full max-h-[calc(100vh-200px)]">
        
        {/* Left Section - Stats & Analytics */}
        <div className="col-span-8 space-y-6">
          
          {/* Key Metrics - 4 cards in one row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">128</p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-500 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Files</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">542</p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+8%</span>
                  </div>
                </div>
                <FileText className="h-8 w-8 text-green-500 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">Active</p>
                  <p className="text-2xl font-bold text-orange-900 mt-1">23</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>→ Stable</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-orange-500 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">New Today</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">7</p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+3</span>
                  </div>
                </div>
                <UserPlus className="h-8 w-8 text-purple-500 opacity-80" />
              </div>
            </div>
          </div>

          {/* Analytics Overview - Single Comprehensive Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">System Overview</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View Details <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Traffic Metrics */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Traffic Today
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Page Views</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{width: '78%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Unique Visitors</span>
                    <span className="font-semibold">892</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  System Health
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">CPU Usage</span>
                    <span className="font-semibold">67%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{width: '67%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Memory</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Actions & Recent Activity */}
        <div className="col-span-4 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Add User</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Upload File</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-purple-50 rounded-lg transition-colors duration-200 group">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Activity className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">View Reports</span>
              </button>
            </div>
          </div>

          {/* Recent Activity - Compact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Recent Activity</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">New user: johndoe</p>
                  <p className="text-xs text-gray-500">2 min ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">File uploaded: report.pdf</p>
                  <p className="text-xs text-gray-500">15 min ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">Backup completed</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}