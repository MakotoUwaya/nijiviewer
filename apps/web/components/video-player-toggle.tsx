"use client";

import { Switch } from "@heroui/react";
import type { ChangeEvent } from "react";

interface VideoPlayerToggleProps {
  isYouTubePlayer: boolean;
  onChange: (isYouTubePlayer: boolean) => void;
}

export default function VideoPlayerToggle({
  isYouTubePlayer,
  onChange,
}: VideoPlayerToggleProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        isSelected={isYouTubePlayer}
        onChange={handleChange}
        size="sm"
        color="primary"
      />
      <span className="text-sm">
        {isYouTubePlayer ? "YouTubeで再生" : "アプリ内で再生"}
      </span>
    </div>
  );
}
