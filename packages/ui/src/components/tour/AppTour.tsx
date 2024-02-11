import { useCallback, useState } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS, Step } from "react-joyride";
import { theme } from "../shared/theme";
import { useTranslation } from "react-i18next";

interface AppTourProps {
  run: boolean;
  setRun: (run: boolean) => void;
}

const classToObserve = new Set([
  "react-flow__viewport",
  "react-flow__node",
  "react-flow__pane",
]);

export function AppTour({ run, setRun }: AppTourProps) {
  const [joyrideKey, setJoyrideKey] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const { t } = useTranslation("tour");

  const [tourSteps, setTourSteps] = useState<Array<Step>>([
    {
      target: ".sidebar-dnd-node",
      content: (
        <div className="space-y-10">
          <div className="space-y-2 text-lg">
            <p>{t("firstTimeHere")}</p>
            <p>{t("discoverApp")}</p>
          </div>
          <div className="flex flex-row justify-center space-x-4 text-lg">
            <button
              type="button"
              className="rounded-lg bg-slate-700 p-3 text-white transition duration-150 ease-in-out hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label={"skip-tour"}
              onClick={() => setRun(false)}
            >
              {t("iKnowTheApp")}
            </button>
            <button
              type="button"
              className="rounded-lg bg-teal-500 p-3 text-white transition duration-150 ease-in-out hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
              aria-label={"start-tour"}
              onClick={() => setStepIndex(1)}
            >
              {t("letsStart")}
            </button>
          </div>
        </div>
      ),
      placement: "center",
      isFixed: true,
      hideCloseButton: true,
      hideFooter: true,
      title: t("welcomeToAIFLOW"),
    },
    {
      target: ".sidebar-dnd-node",
      hideCloseButton: true,
      content: (
        <div className="space-y-2">
          <p className="text-base">{t("addNodesWithDragAndDrop")}</p>
          <img
            src="./tour-assets/tour-step-drag-and-drop.gif"
            className="rounded-lg shadow-lg"
            alt={t("dragAndDrop") ?? "drag and drop"}
          ></img>
        </div>
      ),
      floaterProps: {
        disableAnimation: true,
      },
      placement: "right",
      isFixed: true,
      spotlightPadding: 10,
      title: t("addingNodes"),
    },
    {
      target: ".node-wrapper",
      isFixed: true,
      hideCloseButton: true,
      content: (
        <div className="space-y-2">
          <p className="text-base">{t("executeSingleNode")}</p>
          <img
            src="./tour-assets/tour-step-run-node.gif"
            className="rounded-lg shadow-lg"
            alt={"run nodes"}
          ></img>
        </div>
      ),
      title: t("runningANode"),
    },
    {
      target: ".handle",
      isFixed: true,
      hideCloseButton: true,
      placement: "right",
      content: (
        <div className="space-y-2">
          <p className="text-base">{t("handlesExplanation")}</p>
          <img
            src="./tour-assets/tour-step-connect-nodes.gif"
            className="rounded-lg shadow-lg"
            alt={"connect-nodes"}
          ></img>
        </div>
      ),
      title: t("connectingNodes"),
    },
    {
      target: "#run-all-button",
      isFixed: true,
      hideCloseButton: true,
      placement: "bottom",
      content: (
        <div className="text-base">{t("executeAllNodesDescription")}</div>
      ),
      title: t("runEverything"),
    },
    {
      target: "#replicate",
      isFixed: true,
      hideCloseButton: true,
      content: (
        <div className="space-y-2">
          <p className="text-base">{t("replicateNodeDescription")}</p>
          <img
            src="./tour-assets/tour-step-replicate-node.gif"
            className="rounded-lg shadow-lg"
            alt={"replicate-node"}
          ></img>
        </div>
      ),
      placement: "top",
      title: t("exploringMoreModels"),
    },
    {
      target: ".config-button",
      isFixed: true,
      hideCloseButton: true,
      content: (
        <div className="space-y-2">
          <p className="text-base">{t("configDescription")}</p>
        </div>
      ),
      placement: "top",
      title: t("config"),
    },
    {
      target: ".sidebar-dnd-node",
      hideCloseButton: true,
      content: (
        <div className="text-md space-y-2">
          <p>{t("checkHelpForAdvanced")}</p>
        </div>
      ),
      placement: "center",
      isFixed: true,
      title: t("youveGotTheBasics"),
    },
  ]);

  const handleJoyrideCallback = (data: any) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false);
    }
  };

  const refreshJoyride = () => {
    setJoyrideKey((prevKey) => prevKey + 1); // Increment key to force refresh
  };

  function debounce(func: MutationCallback, wait: number): MutationCallback {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (...args: [MutationRecord[], MutationObserver]): void {
      const later = () => {
        timeout = null;
        func(...args);
      };

      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
    };
  }

  const onMutation = useCallback(
    debounce((mutationsList: any, observer: any) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          Array.from(mutation.target.classList as string[]).some((className) =>
            classToObserve.has(className),
          )
        ) {
          refreshJoyride();
          break;
        }
      }
    }, 100),
    [],
  );

  const observer = new MutationObserver(onMutation);
  const targetElement = document.querySelector("body");

  if (targetElement) {
    const config = {
      attributes: true,
      subtree: true,
    };
    observer.observe(targetElement, config);
  } else {
    console.log("Element not found");
  }

  const buttonBase = {
    backgroundColor: "transparent",
    border: 0,
    borderRadius: 0,
    color: "#555",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
    padding: 8,
    WebkitAppearance: "none" as const,
  };

  return (
    <Joyride
      key={joyrideKey}
      steps={tourSteps}
      run={run}
      continuous={true}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        beaconInner: {
          animation: "joyride-beacon-inner 1.2s infinite ease-in-out",
          backgroundColor: "#ff8c20",
          borderRadius: "50%",
          display: "block",
          height: "50%",
          left: "50%",
          opacity: 0.7,
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
        },
        beaconOuter: {
          animation: "joyride-beacon-outer 1.2s infinite ease-in-out",
          backgroundColor: `rgba(#ff8c20, 0.2)`,
          border: `2px solid #ff8c20`,
          borderRadius: "50%",
          boxSizing: "border-box",
          display: "block",
          height: "100%",
          left: 0,
          opacity: 0.9,
          position: "absolute",
          top: 0,
          transformOrigin: "center",
          width: "100%",
        },
        tooltip: {
          backgroundColor: theme.dark.bg,
          borderRadius: 5,
          boxSizing: "border-box" as const,
          color: theme.dark.text,
          fontSize: 16,
          maxWidth: "100%",
          padding: 15,
          position: "relative" as const,
        },
        buttonBack: {
          ...buttonBase,
          color: theme.dark.text,
          marginLeft: "auto",
          marginRight: 5,
        },
        buttonClose: {
          ...buttonBase,
          color: theme.dark.text,
          height: 14,
          padding: 15,
          position: "absolute" as const,
          right: 0,
          top: 0,
          width: 14,
        },
        options: {
          arrowColor: theme.dark.bg,
          primaryColor: theme.dark.optionButtonBg,
        },
      }}
    />
  );
}
