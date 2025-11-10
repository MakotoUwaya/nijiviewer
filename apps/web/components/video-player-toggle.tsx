'use client';

import { Switch } from '@heroui/react';
import type { ChangeEvent } from 'react';

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
      />
      <span className="text-sm">
        {isYouTubePlayer ? 'Play on YouTube' : 'Play in App'}
      </span>
    </div>
  );
}
