import { LoadingScreenSpinner } from "./nodes/Node.styles";

const LoadingScreen = () => {
  return (
    <div
      className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center"
      style={{ zIndex: 1000 }}
      id="loading-screen"
    >
      <div className="flex flex-col items-center justify-center space-y-5">
        <img src="./logo.svg" className="w-1/2" />
        <LoadingScreenSpinner className="h-8 w-8" />
      </div>
    </div>
  );
};

export default LoadingScreen;
