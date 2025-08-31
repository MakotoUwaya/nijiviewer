// 円形オーディオスペクトラムビジュアライザー
export class CircularAudioSpectrum {
  private audioElement: HTMLAudioElement;
  private spectrumContainer: HTMLDivElement;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
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
    this.setupAudioEventListeners();
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
      // 重要: transformOriginを'bottom center'に固定して、バーが外側に伸びるようにする
      bar.style.transformOrigin = 'bottom center';
      bar.style.transition = 'height 0.1s ease, box-shadow 0.1s ease';

      // コンテナの中心（180px）から配置 - 位置は固定
      bar.style.left = `${180 + x - 1.5}px`; // バーの幅の半分を引く
      bar.style.top = `${180 + y}px`;
      bar.style.height = '15px';
      // 回転は固定 - アニメーション中に変更しない
      bar.style.transform = `rotate(${angle + Math.PI / 2}rad)`;

      // レインボーカラーのグラデーション
      const hue = (i / this.barCount) * 360;
      bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 70%))`;
      bar.style.boxShadow = `0 0 8px hsl(${hue}, 100%, 50%)`;

      this.spectrumContainer.appendChild(bar);
      this.spectrumBars.push(bar);
    }
  }

  private setupAudioEventListeners() {
    // 音声終了時に初期状態に戻す
    this.audioElement.addEventListener('ended', () => {
      this.resetToInitialState();
    });

    // 一時停止時も初期状態に戻す
    this.audioElement.addEventListener('pause', () => {
      this.resetToInitialState();
    });
  }

  private resetToInitialState() {
    this.spectrumBars.forEach((bar, index) => {
      bar.style.height = '15px';
      bar.style.opacity = '0.8';
      const hue = (index / this.barCount) * 360;
      bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 70%))`;
      bar.style.boxShadow = `0 0 8px hsl(${hue}, 100%, 50%)`;
    });
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
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
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

    // シンプルな長さ変更のみのアニメーション
    this.spectrumBars.forEach((bar, index) => {
      const dataLength = this.dataArray?.length ?? 0;

      // インデックスを周波数データ全体にマッピング
      const dataIndex1 = Math.floor((index * dataLength) / this.barCount);
      const dataIndex2 =
        Math.floor(((index + this.barCount / 3) * dataLength) / this.barCount) %
        dataLength;
      const dataIndex3 =
        Math.floor(
          ((index + (this.barCount * 2) / 3) * dataLength) / this.barCount,
        ) % dataLength;

      // 複数のデータポイントを組み合わせて均等な分散を作る
      const value1 = this.dataArray?.[dataIndex1] ?? 0;
      const value2 = this.dataArray?.[dataIndex2] ?? 0;
      const value3 = this.dataArray?.[dataIndex3] ?? 0;

      // 平均値を取って滑らかにする
      const averageValue = (value1 + value2 + value3) / 3;

      // 高さのみを変更（最小15px、最大50px）
      const height = Math.max(15, (averageValue / 255) * 50);
      const intensity = averageValue / 255;

      // 位置や回転は変更せず、高さとグローのみを変更
      bar.style.height = `${height}px`;

      // 基本色は固定、グローの強さのみを変更
      const hue = (index / this.barCount) * 360;
      bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 70%))`;
      bar.style.boxShadow = `0 0 ${8 + intensity * 12}px hsl(${hue}, 100%, 50%)`;
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  cleanup() {
    this.stopVisualizer();

    // イベントリスナーを削除
    this.audioElement.removeEventListener('ended', () => {
      this.resetToInitialState();
    });
    this.audioElement.removeEventListener('pause', () => {
      this.resetToInitialState();
    });

    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
