// 円形オーディオスペクトラムビジュアライザー
export class CircularAudioSpectrum {
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
      const angle = (i / this.barCount) * 2 * Math.PI;
      // 画像の半径（100px）+ ボーダー（3px）から開始
      const imageRadius = 103;
      const x = Math.cos(angle) * imageRadius;
      const y = Math.sin(angle) * imageRadius;

      // スペクトラムバーの基本スタイルを設定
      bar.style.position = 'absolute';
      bar.style.width = '3px';
      bar.style.borderRadius = '2px';
      bar.style.transformOrigin = 'bottom center';
      bar.style.transition = 'all 0.1s ease';

      // コンテナの中心（180px）から配置
      bar.style.left = `${180 + x - 1.5}px`; // バーの幅の半分を引く
      bar.style.top = `${180 + y}px`;
      bar.style.height = '15px';
      bar.style.transform = `rotate(${angle + Math.PI / 2}rad)`;

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
      this.spectrumContainer.style.opacity = '1';
      this.animate();
    }
  }

  stopVisualizer() {
    this.isActive = false;
    this.spectrumContainer.style.opacity = '0.3';
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

  cleanup() {
    this.stopVisualizer();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
