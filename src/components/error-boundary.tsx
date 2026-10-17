"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  /** optional label, only used in the console error for debugging */
  label?: string;
};
type State = { hasError: boolean };

/**
 * Isolates a subtree so a render/runtime error in one section cannot
 * white-screen the whole page (e.g. on a specific device/browser).
 * Used to wrap each gated section: if one fails to mount, the rest of
 * the site (and the minigame) keep working.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== "undefined") {
      console.error(`[ErrorBoundary${this.props.label ? ` ${this.props.label}` : ""}]`, error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
