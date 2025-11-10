'use client';

import { Button, TextArea } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import { CircularAudioSpectrum } from '@/lib/circular-audio-spectrum';

// MediaSource/ManagedMediaSource の型定義
interface ManagedMediaSource extends MediaSource {}

declare global {
  interface Window {
    ManagedMediaSource?: new () => ManagedMediaSource;
    webkitAudioContext?: typeof AudioContext;
  }

  var ManagedMediaSource: (new () => ManagedMediaSource) | undefined;
}

export default function AivisCloudAPIPage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const spectrumContainerRef = useRef<HTMLDivElement>(null);
  const spectrumRef = useRef<CircularAudioSpectrum | null>(null);

  // モデルを指定
  // https://hub.aivis-project.com/search
  const selectedVoice = {
    modelUuid: '59f96896-64d2-4378-830a-4d5feb3d81aa',
    speakerUuid: '05df32d1-1c20-48d3-860d-83310004e046',
    imageUrl:
      'https://assets.aivis-project.com/aivm-models/30b0ab4c-893b-4c73-8c2a-29059656e3d8/speakers/b903b46a-4b54-4ff1-9ab9-eb009b179cac/icon.jpg',
  };

  useEffect(() => {
    if (audioRef.current && spectrumContainerRef.current) {
      // 円形オーディオスペクトラムインスタンスを作成
      spectrumRef.current = new CircularAudioSpectrum(
        audioRef.current,
        spectrumContainerRef.current,
      );

      const audioElement = audioRef.current;

      // オーディオイベントリスナー
      const handlePlay = async () => {
        if (spectrumRef.current) {
          await spectrumRef.current.initAudioContext();
          spectrumRef.current.startVisualizer();
        }
      };

      const handlePause = () => {
        if (spectrumRef.current) {
          spectrumRef.current.stopVisualizer();
        }
      };

      const handleEnded = () => {
        if (spectrumRef.current) {
          spectrumRef.current.stopVisualizer();
        }
      };

      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);

      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
        if (spectrumRef.current) {
          spectrumRef.current.cleanup();
        }
      };
    }
  }, []);

  const handleSpeak = async () => {
    if (!text.trim()) {
      alert('音声モデルに話してほしいことを入力してください！');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_uuid: selectedVoice.modelUuid,
          speaker_uuid: selectedVoice.speakerUuid,
          text,
          use_ssml: true,
          output_format: 'mp3', // ストリーミングのために MP3 を指定
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // MediaSource / ManagedMediaSource (iOS Safari) ですべての生成が終わる前にストリーミング再生
      // iOS Safari は MediaSource 非対応だが、iOS 17.1 以降では代わりに ManagedMediaSource を利用できる
      const MediaSourceConstructor =
        window.MediaSource ||
        window.ManagedMediaSource ||
        globalThis.ManagedMediaSource;

      if (!MediaSourceConstructor) {
        throw new Error('MediaSource or ManagedMediaSource is not supported');
      }

      const mediaSource = new MediaSourceConstructor();

      if (audioRef.current) {
        const audio = audioRef.current;
        audio.src = URL.createObjectURL(mediaSource);
        audio.disableRemotePlayback = true; // ManagedMediaSource での再生に必要
        audio.play().catch(console.error);
      }

      console.log('Streaming audio data...');

      mediaSource.addEventListener('sourceopen', async () => {
        const sb = mediaSource.addSourceBuffer('audio/mpeg');
        // updating フラグが立っていたら updateend まで待つ
        const waitForIdle = () =>
          sb.updating
            ? new Promise((r) =>
                sb.addEventListener('updateend', r, { once: true }),
              )
            : Promise.resolve();

        const reader = res.body?.getReader();
        if (!reader) throw new Error('Response body is not readable');

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            await waitForIdle(); // 最後の書き込みを待つ
            console.log('Streaming audio data finished.');
            mediaSource.endOfStream();
            break;
          }
          await waitForIdle();
          sb.appendBuffer(value);
          await waitForIdle();
        }
      });
    } catch (error) {
      console.error('音声生成エラー:', error);
      alert(
        '音声の生成に失敗しました。しばらく時間をおいてから再度お試しください。',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center p-8 border border-gray-600 rounded-xl bg-gray-800 text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          おしゃべり音声モデル
        </h1>

        <div className="relative inline-block my-16 p-20">
          <div
            className="w-48 h-48 rounded-full border-4 border-blue-400 transition-all duration-300 ease-in-out"
            style={{
              backgroundImage: `url('${selectedVoice.imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            role="img"
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30 transition-opacity duration-300 ease-in-out spectrum-container"
            style={{ width: '360px', height: '390px' }}
            ref={spectrumContainerRef}
          />
        </div>

        <TextArea
          placeholder="音声モデルに話してほしいことを入力"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-4"
        />

        <Button
          onPress={handleSpeak}
          isDisabled={isLoading}
          className="mb-4"
        >
          {isLoading ? '生成中...' : '話して音声モデル！'}
        </Button>

        <audio ref={audioRef} className="hidden">
        </audio>
      </div>
    </div>
  );
}
