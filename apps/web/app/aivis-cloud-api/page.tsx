'use client';

import { Button, Textarea } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';

// MediaSource/ManagedMediaSource の型定義
interface ManagedMediaSource extends MediaSource {}

declare global {
  interface Window {
    ManagedMediaSource?: new () => ManagedMediaSource;
    webkitAudioContext?: typeof AudioContext;
  }

  var ManagedMediaSource: (new () => ManagedMediaSource) | undefined;
}

// 円形オーディオスペクトラムビジュアライザー
class CircularAudioSpectrum {
  private audioElement: HTMLAudioElement;
  private spectrumContainer: HTMLDivElement;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private animationId: number | null = null;
  private spectrumBars: HTMLDivElement[] = [];
  private isActive = false;
  private barCount = 64;

  constructor(
    audioElement: HTMLAudioElement,
    spectrumContainer: HTMLDivElement,
  ) {
    this.audioElement = audioElement;
    this.spectrumContainer = spectrumContainer;
    this.createSpectrumElements();
  }

  private createSpectrumElements() {
    // 放射状のスペクトラムバー（画像の縁から始まる）
    for (let i = 0; i < this.barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'spectrum-bar';
      const angle = (i / this.barCount) * 2 * Math.PI;
      // 画像の半径（100px）+ ボーダー（3px）から開始
      const imageRadius = 103;
      const x = Math.cos(angle) * imageRadius;
      const y = Math.sin(angle) * imageRadius;
      // コンテナの中心（180px）から配置
      bar.style.left = `${180 + x - 1.5}px`; // バーの幅の半分を引く
      bar.style.top = `${180 + y}px`;
      bar.style.height = '15px';
      bar.style.transform = `rotate(${angle + Math.PI / 2}rad)`;
      bar.style.transformOrigin = 'bottom center';
      // レインボーカラーのグラデーション
      const hue = (i / this.barCount) * 360;
      bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 70%))`;
      bar.style.boxShadow = `0 0 8px hsl(${hue}, 100%, 50%)`;
      this.spectrumContainer.appendChild(bar);
      this.spectrumBars.push(bar);
    }
  }

  async initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext ||
        AudioContext
      )();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const source = this.audioContext.createMediaElementSource(
        this.audioElement,
      );
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      this.dataArray = new Uint8Array(
        new ArrayBuffer(this.analyser.frequencyBinCount),
      );
    }
  }

  startVisualizer() {
    if (!this.isActive) {
      this.isActive = true;
      this.spectrumContainer.classList.add('spectrum-active');
      this.animate();
    }
  }

  stopVisualizer() {
    this.isActive = false;
    this.spectrumContainer.classList.remove('spectrum-active');
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private animate() {
    if (!this.isActive || !this.analyser || !this.dataArray) return;

    this.analyser.getByteFrequencyData(this.dataArray);

    // スペクトラムバーを更新
    this.spectrumBars.forEach((bar, index) => {
      const dataIndex = Math.floor(
        (index * (this.dataArray?.length ?? 0)) / this.barCount,
      );
      const value = this.dataArray?.[dataIndex] ?? 0;
      const height = Math.max(15, (value / 255) * 60);
      const intensity = value / 255;
      bar.style.height = `${height}px`;
      bar.style.opacity = String(0.8 + intensity * 0.2);
      // 動的な色の変化
      const hue = (index / this.barCount) * 360;
      bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, ${50 + intensity * 30}%), hsl(${(hue + 60) % 360}, 100%, ${70 + intensity * 20}%))`;
      bar.style.boxShadow = `0 0 ${8 + intensity * 15}px hsl(${hue}, 100%, 50%)`;
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
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
      <div className="field">
        <h1 className="text-3xl font-bold text-center mb-8">
          おしゃべり音声モデル
        </h1>

        <div className="image-container">
          <div
            className="circular-image"
            style={{
              backgroundImage: `url('${selectedVoice.imageUrl}')`,
              backgroundSize: '200px',
            }}
            role="img"
            aria-label="voice model image"
          />
          <div className="spectrum-container" ref={spectrumContainerRef} />
        </div>

        <Textarea
          placeholder="音声モデルに話してほしいことを入力"
          value={text}
          onValueChange={setText}
          className="mb-4"
          minRows={3}
          maxRows={5}
        />

        <Button
          onPress={handleSpeak}
          disabled={isLoading}
          color="primary"
          size="lg"
          className="mb-4"
        >
          {isLoading ? '生成中...' : '話して音声モデル！'}
        </Button>

        <audio ref={audioRef} className="hidden">
          <track kind="captions" srcLang="ja" label="日本語" />
        </audio>
      </div>

      <style jsx>{`
        .field {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2em;
          border: solid 1px #444;
          border-radius: 15px;
          background: #2a2a2a;
          text-align: center;
          max-width: 500px;
          width: 100%;
        }
        
        .image-container {
          position: relative;
          display: inline-block;
          margin: 60px 0;
          padding: 80px;
        }
        
        .circular-image {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #4a9eff;
          transition: all 0.3s ease;
        }
        
        .spectrum-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 360px;
          height: 390px;
          pointer-events: none;
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }
        
        .spectrum-active {
          opacity: 1;
        }
        
        :global(.spectrum-bar) {
          position: absolute;
          width: 3px;
          background: linear-gradient(to top, #ff0080, #ff4000, #ffff00, #00ff40, #00ffff, #4000ff, #8000ff);
          border-radius: 2px;
          transform-origin: bottom center;
          box-shadow: 0 0 10px currentColor;
          transition: all 0.1s ease;
        }
      `}</style>
    </div>
  );
}
