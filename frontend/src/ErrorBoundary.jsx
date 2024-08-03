import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Oops, kuch galat ho gaya.</h1>
          <p>Error details: {this.state.error && this.state.error.toString()}</p>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
