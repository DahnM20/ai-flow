import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Badge, Button, Card, Group, Modal, Image, Text } from "@mantine/core";
import { FaTimes } from "react-icons/fa";

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelpArticle {
  title: string;
  description: string;
  url: string;
  imgUrl: string;
  newFeature: boolean;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("tips");

  const [articleSelected, setArticleSelected] = useState<
    HelpArticle | undefined
  >();

  const articles: HelpArticle[] = t("tips", { returnObjects: true });

  function selectArticle(item: HelpArticle) {
    setArticleSelected(item);
  }

  function resetSelectedArticle() {
    setArticleSelected(undefined);
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Help"
      size="auto"
      centered
      styles={{
        title: {
          fontSize: "1.3rem",
          fontWeight: "bold",
          color: "white",
          paddingLeft: "0.5rem",
        },
        header: {
          backgroundColor: "#6b8177",
          fontSize: "1.5rem",
        },
        body: {
          backgroundColor: "rgb(24 24 27)",
          padding: 0,
        },
      }}
    >
      <PopupContent>
        <div className="flex h-full w-full flex-row overflow-auto">
          {articleSelected && (
            <div className="relative flex w-3/4">
              <iframe
                src={articleSelected.url}
                width="100%"
                height="100%"
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
              <div className="absolute top-2 flex w-full justify-center">
                <button
                  onClick={resetSelectedArticle}
                  onTouchStart={resetSelectedArticle}
                  className="flex rounded-full p-1 text-slate-300/50 ring-1 ring-slate-300/50 hover:text-white hover:ring-white"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          <div
            className={`mx-2 my-10 flex flex-wrap items-baseline justify-center gap-3 ${articleSelected ? "w-1/4" : "w-full"} `}
          >
            {articles.map((article, index) => (
              <div
                className={`h-auto  ${articleSelected ? "w-fit" : "w-fit md:w-1/6"}`}
              >
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <div className="relative">
                      <Image
                        src={article.imgUrl}
                        height={160}
                        alt={article.title}
                      />
                      {article.newFeature && (
                        <div className="absolute top-2 z-50 flex text-sm">
                          <div className="rounded-r-lg bg-teal-600 px-2 text-white">
                            New
                          </div>
                        </div>
                      )}
                    </div>
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={700} lineClamp={1}>
                      {article.title}
                    </Text>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {article.description}
                  </Text>

                  <div
                    className="mt-4 cursor-pointer pl-1 font-bold text-teal-400"
                    onClick={() => selectArticle(article)}
                    onTouchStart={() => selectArticle(article)}
                  >
                    Read more {">"}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </PopupContent>
    </Modal>
  );
};

const PopupContent = styled.div.attrs({
  className: "overflow-hidden hover:overflow-auto w-full",
})``;

export default HelpPopup;
