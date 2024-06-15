import { useEffect, useState, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({ hasError: false });

  useEffect(() => {
    const handleError = (error: Error, errorInfo: ErrorInfo) => {
      if (!error) return;
      if (error.stack?.includes("videojs-wavesurfer")) return; //TMP - But no idea how to catch them otherwise...
      console.error("Error Boundary caught an error", error, errorInfo);
      setState({ hasError: true });
    };

    const globalErrorHandler = (event: ErrorEvent) => {
      handleError(event.error, { componentStack: "" });
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      handleError(event.reason, { componentStack: "" });
    };

    window.addEventListener("error", globalErrorHandler);
    window.addEventListener("unhandledrejection", unhandledRejectionHandler);

    return () => {
      window.removeEventListener("error", globalErrorHandler);
      window.removeEventListener(
        "unhandledrejection",
        unhandledRejectionHandler,
      );
    };
  }, []);

  if (state.hasError) {
    return (
      <div className="items-center pt-6 text-center">
        <h1>Something went wrong with this flow.</h1>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }
  return <>{children}</>;
}
