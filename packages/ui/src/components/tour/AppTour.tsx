import { useCallback, useEffect, useState } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS, Step } from "react-joyride";
import { theme } from "../shared/theme";
import { useTranslation } from "react-i18next";
import { useVisibility } from "../../providers/VisibilityProvider";

interface AppTourProps {
  run: boolean;
  setRun: (run: boolean) => void;
}

const classToObserve = new Set([
  "react-flow__viewport",
  "react-flow__node",
  "react-flow__pane",
]);

const imageUrls: string[] = [
  "./tour-assets/tour-step-drag-and-drop.gif",
  "./tour-assets/tour-step-run-node.gif",
  "./tour-assets/tour-step-connect-nodes.gif",
  "./tour-assets/tour-step-replicate-node.gif",
];

function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

export function AppTour({ run, setRun }: AppTourProps) {
  const [joyrideKey, setJoyrideKey] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const { getElement } = useVisibility();

  const { t } = useTranslation("tour");

  useEffect(() => {
    preloadImages(imageUrls);
  }, []);

  const [tourSteps, setTourSteps] = useState<Array<Step>>([
    {
      target: ".sidebar-dnd-node",
      content: (
        <div className="space-y-10">
          <div className="space-y-5 text-lg">
            <p>{t("firstTimeHere")}</p>
            <p>{t("discoverApp")}</p>
          </div>
          <div className="flex flex-col justify-center space-y-4 text-sm md:text-lg">
            <button
              type="button"
              className="w-full max-w-xs rounded-lg bg-teal-500 px-4 py-3 text-base text-white transition duration-150 ease-in-out hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 sm:text-xl"
              aria-label="start-tour"
              onClick={() => setStepIndex(1)}
            >
              {t("letsStart")}
            </button>
            <button
              type="button"
              className="w-full max-w-xs rounded-lg  bg-slate-700 px-4 py-3 text-base text-white shadow-sm transition duration-150 ease-in-out hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 sm:text-xl"
              aria-label="skip-tour"
              onClick={() => setRun(false)}
            >
              {t("iKnowTheApp")}
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
            src={imageUrls[0]}
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
      target: ".node-play-button",
      hideCloseButton: true,
      placement: "right",
      content: (
        <div className="space-y-2">
          <p className="text-base">{t("executeSingleNode")}</p>
          <img
            src={imageUrls[1]}
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
            src={imageUrls[2]}
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
            src={imageUrls[3]}
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
    const sidebar = getElement("dragAndDropSidebar");

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      if (index === 1) {
        sidebar.hide();
      }

      if (index === 3) {
        sidebar.show();
      }
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
    color: "#555",
    cursor: "pointer",
    lineHeight: 1,
    padding: 8,
    WebkitAppearance: "none" as const,
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "0.5em",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
          // backgroundColor: theme.dark.bg,
          background: "linear-gradient(135deg, #101113, #1a1b1e)",
          borderRadius: "0.75em",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box" as const,
          color: theme.dark.text,
          fontSize: "1.25rem",
          maxWidth: "100%",
          padding: "2em",
        },
        buttonBack: {
          ...buttonBase,
          color: theme.dark.text,
          marginLeft: "auto",
          marginRight: 5,
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: "0.5em",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
