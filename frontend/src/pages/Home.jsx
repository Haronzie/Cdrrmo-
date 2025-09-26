import { ArrowRight, Shield, FileText, Users, Lock, Database, ChevronRight, TrendingUp, Activity, UserPlus, Upload, BarChart3, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CDRRMO</h1>
                <p className="text-xs text-gray-500">Document Management System</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              <a href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                Sign In
              </a>
              <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Get Started
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Database className="w-4 h-4 mr-2" />
                  Secure Document Management
                </div>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Professional Document Management for
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Disaster Risk Reduction</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Streamline your CDRRMO operations with our comprehensive LAN-based document management system. 
                  Secure storage, intelligent organization, and seamless collaboration for critical disaster management documents.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Start Managing Documents
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 shadow-md hover:bg-gray-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  Sign In to Your Account
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-sm text-gray-600">Secure</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">LAN</p>
                  <p className="text-sm text-gray-600">Based</p>
                </div>
              </div>
            </div>

            {/* Right Visual - Admin Panel Design */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Admin Panel Header */}
                <div className="bg-green-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg">Admin Panel</h3>
                      <p className="text-green-100 text-sm">Management System</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar and Main Content */}
                <div className="flex min-h-96">
                  {/* Sidebar */}
                  <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-2 bg-blue-100 text-blue-700 rounded-lg">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Dashboard</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Users</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Files</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-6">
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">H</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Welcome, Admin</h4>
                          <p className="text-xs text-gray-500">Administrator Dashboard</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-blue-600 font-medium">TOTAL USERS</p>
                            <p className="text-lg font-bold text-blue-900">128</p>
                            <p className="text-xs text-green-600">↑ +12%</p>
                          </div>
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-green-600 font-medium">FILES</p>
                            <p className="text-lg font-bold text-green-900">542</p>
                            <p className="text-xs text-green-600">↑ +8%</p>
                          </div>
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-orange-600 font-medium">ACTIVE</p>
                            <p className="text-lg font-bold text-orange-900">23</p>
                            <p className="text-xs text-gray-500">Stable</p>
                          </div>
                          <Activity className="w-5 h-5 text-orange-600" />
                        </div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-purple-600 font-medium">NEW TODAY</p>
                            <p className="text-lg font-bold text-purple-900">7</p>
                            <p className="text-xs text-green-600">↑ +3</p>
                          </div>
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">QUICK ACTIONS</h5>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg text-sm">
                        <UserPlus className="w-4 h-4 text-blue-600" />
                        <span>Add User</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg text-sm">
                        <Upload className="w-4 h-4 text-green-600" />
                        <span>Upload File</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-70"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-70"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Built for Professional CDRRMO Operations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our system provides enterprise-grade security and functionality tailored specifically for disaster risk reduction and management offices.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Secure Storage</h3>
                <p className="text-gray-600">
                  Military-grade encryption and access controls ensure your sensitive documents remain protected within your local network.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Smart Organization</h3>
                <p className="text-gray-600">
                  Advanced categorization and search capabilities help you locate critical documents instantly when every second counts.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Team Collaboration</h3>
                <p className="text-gray-600">
                  Role-based permissions and real-time collaboration tools ensure your team stays coordinated during critical operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-white">
                Ready to Modernize Your Document Management?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Join CDRRMO offices nationwide in securing and streamlining their critical document workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Create Your Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl border border-blue-500 hover:bg-blue-800 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Access Existing Account
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <span className="text-white font-bold">CDRRMO DMS</span>
                </div>
                <p className="text-sm">
                  Professional document management system designed specifically for Coastal Disaster Risk Reduction and Management Offices.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-semibold">System</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/login" className="hover:text-white transition-colors">Sign In</a></li>
                  <li><a href="/register" className="hover:text-white transition-colors">Register</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Security</h4>
                <ul className="space-y-2 text-sm">
                  <li>LAN-Based Architecture</li>
                  <li>Encrypted Storage</li>
                  <li>Role-Based Access</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>24/7 System Availability</li>
                  <li>Local Network Support</li>
                  <li>Administrative Tools</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} CDRRMO Document Management System. Built for secure, professional document handling.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}