import React from "react";

interface Props {
  children: React.ReactNode;
  resetKey?: number;
}

interface State {
  hasError: boolean;
}

export class PreviewErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidMount(): void {
    if (import.meta.hot) {
      import.meta.hot.on("vite:afterUpdate", this.handleHmrUpdate);
    }
  }

  componentWillUnmount(): void {
    import.meta.hot?.off("vite:afterUpdate", this.handleHmrUpdate);
  }

  handleHmrUpdate = (): void => {
    if (this.state.hasError) {
      this.setState({ hasError: false });
    }
  };

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center bg-neutral-900 text-neutral-400 text-sm">
          <span className="animate-pulse">Preview updating...</span>
        </div>
      );
    }
    return this.props.children;
  }
}
