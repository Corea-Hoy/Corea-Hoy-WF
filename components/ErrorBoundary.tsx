"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="py-20 flex flex-col items-center gap-4 text-center px-4">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm font-bold text-gray-500">
              문제가 발생했습니다. 페이지를 새로고침해 주세요.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-5 py-2 bg-black text-white rounded-xl text-sm font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
