import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl bg-white border rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
            <p className="mt-3 text-sm text-gray-600">An unexpected error occurred while rendering the application.</p>
            <pre className="mt-4 text-xs text-left bg-gray-100 p-3 rounded max-h-48 overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
