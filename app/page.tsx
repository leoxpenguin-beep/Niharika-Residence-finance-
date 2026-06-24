import Link from "next/link";

export default function RootPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">LEORA BOQ Engine</h1>
        <p className="text-gray-500 text-sm">Welcome to the Niharika Residence Costing Engine.</p>
        
        <div className="flex flex-col gap-3 pt-4">
          <Link 
            href="/client" 
            className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            View Client Journey
          </Link>
          <Link 
            href="/admin-login" 
            className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </main>
  );
}
