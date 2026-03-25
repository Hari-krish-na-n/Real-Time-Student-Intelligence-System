import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white p-10 rounded-[40px] border border-red-100 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text">Something went wrong</h2>
              <p className="text-text/60 text-sm">
                We encountered an unexpected error while rendering this page.
              </p>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-red-50 rounded-2xl text-left overflow-auto max-h-40">
                <code className="text-[10px] text-red-600 font-mono">
                  {this.state.error?.toString()}
                </code>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
              >
                <RefreshCcw size={18} /> Reload Page
              </button>
              <Link
                to="/"
                className="w-full py-4 bg-background text-text font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-secondary/20 transition-all"
              >
                <Home size={18} /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
