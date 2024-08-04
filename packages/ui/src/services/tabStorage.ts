import { FlowTab } from "../layout/main-layout/AppLayout";

const LOCAL_STORAGE_TAB_KEY = "flowTabs";
const LOCAL_STORAGE_CURRENT_TAB_KEY = "currentTab";

export function getCurrentTabIndex() {
  const savedTabIndex = localStorage.getItem(LOCAL_STORAGE_CURRENT_TAB_KEY);
  if (!savedTabIndex) return undefined;
  return savedTabIndex;
}

export function saveCurrentTabIndex(index: number) {
  localStorage.setItem(LOCAL_STORAGE_CURRENT_TAB_KEY, index.toString());
}

export function getLocalTabs() {
  const savedTabs = localStorage.getItem(LOCAL_STORAGE_TAB_KEY);
  if (!savedTabs) return undefined;
  return JSON.parse(savedTabs)?.tabs as FlowTab[];
}

export function saveTabsLocally(tabs: FlowTab[]) {
  if (!tabs) return;
  if (tabs.length >= 1 && tabs[0].nodes.length !== 0) {
    const tabsToStore = { tabs: tabs };
    localStorage.setItem(LOCAL_STORAGE_TAB_KEY, JSON.stringify(tabsToStore));
  }
}

export async function getAllTabs() {
  const savedFlowTabs = getLocalTabs();
  return savedFlowTabs ?? [];
}
