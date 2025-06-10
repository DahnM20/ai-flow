import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  DnDNode,
  getSections,
} from "../../../nodes-configuration/sectionConfig";
import { memo, useEffect, useState } from "react";
import DraggableNode from "./DraggableNode";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { useVisibility } from "../../../providers/VisibilityProvider";
import useIsTouchDevice from "../../../hooks/useIsTouchDevice";
import Section from "./Section";
import { DraggableNodeAdditionnalData } from "./types";
import { TextInput, Chip, Group } from "@mantine/core";
import { SubnodeData } from "../../../nodes-configuration/types";
import DraggableNodeWithSubnodes from "./DraggableNodeWithSubnodes";

const HIDE_SIDEBAR_ANIMATION_DURATION = 300;

interface DnDSidebarProps {
  addNodeFromExt?: (
    type: string,
    data: DraggableNodeAdditionnalData & Record<string, unknown>,
  ) => void;
}

const DnDSidebar = ({ addNodeFromExt }: DnDSidebarProps) => {
  const { t } = useTranslation("flow");
  const { getElement } = useVisibility();
  const sidebar = getElement("dragAndDropSidebar");

  const [contentVisible, setContentVisible] = useState(sidebar?.isVisible);
  const [sections, setSections] = useState(getSections());
  const [searchQuery, setSearchQuery] = useState("");

  const isTouchDevice = useIsTouchDevice();

  // Update sidebar content visibility
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (sidebar.isVisible) {
      setContentVisible(true);
    } else {
      timeoutId = setTimeout(
        () => setContentVisible(false),
        HIDE_SIDEBAR_ANIMATION_DURATION,
      );
    }
    return () => clearTimeout(timeoutId);
  }, [sidebar]);

  // Update sections when hidden list changes
  useEffect(() => {
    const handleHiddenListChanged = (e: any) => {
      setSections(getSections());
    };

    window.addEventListener("nodesHiddenListChanged", handleHiddenListChanged);
    return () => {
      window.removeEventListener(
        "nodesHiddenListChanged",
        handleHiddenListChanged,
      );
    };
  }, []);

  function nodeMatchesSearch(node: DnDNode, query: string): boolean {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    return !!node.label.toLowerCase().includes(lowerQuery);
  }

  function subnodeMatchesSearch(subnode: SubnodeData, query: string): boolean {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    return !!subnode.label.toLowerCase().includes(lowerQuery);
  }

  function filterSubnodes(
    subnodes: SubnodeData[],
    searchQuery: string,
  ): SubnodeData[] {
    const subnodesMatches = subnodes.filter((subnode) =>
      subnodeMatchesSearch(subnode, searchQuery),
    );

    const isFilterEnabled = !!searchQuery;

    if (!isFilterEnabled && subnodesMatches.length > 7) {
      return subnodesMatches.slice(0, 8);
    }

    return subnodesMatches;
  }

  /**
   * Returns the node if it matches the search AND category filter,
   * OR if any of its subnodes match (in which case, only the matching subnodes are retained).
   */
  function filterNode(node: DnDNode, searchQuery: string): DnDNode | null {
    const nodeMatchesOverall = nodeMatchesSearch(node, searchQuery);
    let filteredSubnodes: SubnodeData[] = [];
    if (node.subnodesShortcutConfig && node.subnodesShortcutConfig.length > 0) {
      filteredSubnodes = filterSubnodes(
        node.subnodesShortcutConfig,
        searchQuery,
      );
    }
    if (nodeMatchesOverall || filteredSubnodes.length > 0) {
      return {
        ...node,
        // If some subnodes match, update them; otherwise, leave them unchanged.
        subnodesShortcutConfig:
          filteredSubnodes.length > 0
            ? filteredSubnodes
            : node.subnodesShortcutConfig,
      };
    }
    return null;
  }

  function renderNodeWithSubnode(nodeIndex: number, node: DnDNode) {
    const subNodeLabel = node.subnodesShortcutStyle?.title
      ? t(node.subnodesShortcutStyle?.title)
      : t("PopularModels");
    return (
      <DraggableNodeWithSubnodes
        key={`${nodeIndex}-${node.label}`}
        nodeIndex={nodeIndex}
        node={node}
        subNodeLabel={subNodeLabel}
        subNodesData={node.subnodesShortcutConfig ?? []}
        addNodeFromExt={addNodeFromExt}
      />
    );
  }

  const sectionsToRender = sections
    .map((section) => {
      if (!section.nodes) return null;
      const filteredNodes = section.nodes
        .map((node) => filterNode(node, searchQuery))
        .filter((node): node is DnDNode => node !== null);
      return { ...section, nodes: filteredNodes };
    })
    .filter(
      (section) =>
        section !== null &&
        section.nodes !== undefined &&
        section.nodes.length > 0,
    );

  return (
    <div
      className={`relative flex w-fit max-w-[35vw] transform text-xs transition-transform md:text-base duration-${HIDE_SIDEBAR_ANIMATION_DURATION} ease-in-out ${
        !sidebar.isVisible ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <div
        className={`absolute left-full top-1/2 z-50 flex translate-x-2 transform cursor-pointer rounded-2xl text-2xl font-bold text-slate-300 hover:font-extrabold hover:text-slate-100`}
        onClick={sidebar.toggle}
      >
        {!sidebar.isVisible ? <FiChevronRight /> : <FiChevronLeft />}
      </div>
      {contentVisible && (
        <DnDSidebarContainer
          id="dnd-sidebar"
          className={`font-sm md:font-md flex flex-col rounded-r-xl bg-zinc-950/10 px-3 py-2 shadow-md backdrop-blur-md ${
            isTouchDevice
              ? "overflow-y-auto"
              : "overflow-hidden hover:overflow-y-auto"
          } ${!sidebar.isVisible ? "opacity-0" : ""} transition-opacity duration-${HIDE_SIDEBAR_ANIMATION_DURATION} ease-in-out`}
        >
          {/* Search bar */}
          <div className="mb-3">
            <TextInput
              placeholder={t("Search nodes") ?? "Search nodes"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<FiSearch />}
              size="xs"
            />
          </div>

          {/* Render sections (filtered by search query and category) */}
          {sectionsToRender.map((section, index) => {
            if (!section || !section.nodes || section.nodes.length === 0) {
              return null;
            }
            return (
              <Section key={index} index={index} section={section}>
                {section.nodes?.map((node, nodeIndex) => {
                  if (!node) return null;
                  if (
                    node.subnodesShortcutConfig &&
                    node.subnodesShortcutConfig?.length > 0
                  ) {
                    return renderNodeWithSubnode(nodeIndex, node);
                  }
                  return (
                    <DraggableNode
                      key={nodeIndex}
                      node={node}
                      additionnalConfig={
                        node?.additionnalData?.additionnalConfig
                      }
                      additionnalData={node?.additionnalData?.additionnalData}
                    />
                  );
                })}
              </Section>
            );
          })}
        </DnDSidebarContainer>
      )}
    </div>
  );
};

const DnDSidebarContainer = styled.div``;

export default memo(DnDSidebar);
