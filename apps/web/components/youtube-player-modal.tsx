"use client";

import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { type YouTubePlayer, useYouTubeApi } from "../hooks/useYouTubeApi";

interface YouTubePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export default function YouTubePlayerModal({
  isOpen,
  onClose,
  videoId,
}: YouTubePlayerModalProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerContainerId = "youtube-player-container";
  const { loadYouTubeApi } = useYouTubeApi();
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    if (!isOpen || isApiReady) return;

    loadYouTubeApi().then(() => {
      setIsApiReady(true);
    });
  }, [isOpen, isApiReady, loadYouTubeApi]);

  useEffect(() => {
    if (!isOpen || !isApiReady || playerRef.current) return;

    playerRef.current = new window.YT.Player(playerContainerId, {
      videoId,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onError: (event) => {
          console.error("YouTube Player Error:", event.data);
        },
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isOpen, isApiReady, videoId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalContent>
        <ModalBody className="aspect-video p-0">
          <div id={playerContainerId} className="w-full h-full" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
