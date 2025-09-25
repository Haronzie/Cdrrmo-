export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full text-center border border-gray-100">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          <span className="text-blue-600">CDRRMO</span> Document Management System
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Organize, secure, and access important disaster risk management
          documents with ease on our LAN-based system.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 w-full sm:w-auto bg-blue-600 text-white font-semibold rounded-lg shadow-md 
                      hover:bg-blue-700 hover:scale-105 transform transition duration-300 ease-in-out"
          >
            🔑 Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 w-full sm:w-auto bg-green-600 text-white font-semibold rounded-lg shadow-md 
                      hover:bg-green-700 hover:scale-105 transform transition duration-300 ease-in-out"
          >
            📝 Register
          </a>
        </div>

        {/* Extra Info */}
        <div className="mt-10 text-sm text-gray-500">
          <p className="italic">"Preparedness starts with proper documentation."</p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} CDRRMO | Built for secure document handling
        </p>
      </div>
    </div>
  );
}
