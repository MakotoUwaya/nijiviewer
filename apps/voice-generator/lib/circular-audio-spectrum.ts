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
  private barCount = 120; // より細かく綺麗なスペクトラムにするため増やす

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
    // 放射状のスペクトラムバー
    // 画像の半径は 192px / 2 = 96px。枠線が4px。合計100px。
    // ピッタリくっつけるため、imageRadiusを100〜101とする。
    const imageRadius = 101;

    for (let i = 0; i < this.barCount; i++) {
        // コンテナの中心から放射状に配置するためのラッパー
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        
        // 中心座標 (360x360のコンテナの中心 = 180px)
        wrapper.style.left = '180px';
        wrapper.style.top = '180px';
        
        // 上を向いている状態(0度)から、インデックスに応じて角度をつける
        // 時計回りに配置する
        const angleDeg = (i / this.barCount) * 360; 
        
        // translateY で要素自体を外周まで押し出す
        wrapper.style.transform = `rotate(${angleDeg}deg) translateY(-${imageRadius}px)`;

        // 実際のプログレスバーとなる要素
        const bar = document.createElement('div');
        bar.style.position = 'absolute';
        // 親の基準（円周上）を一番下に固定する
        bar.style.bottom = '0';
        bar.style.left = '-1.5px'; // 幅の半分ずらす
        bar.style.width = '3px';
        bar.style.borderRadius = '2px';
        bar.style.transition = 'height 0.05s ease';
        
        const initialHeight = 15;
        bar.style.height = `${initialHeight}px`;

        // レインボーカラーのグラデーション
        // -90度ずらして左から右のようなグラデーションにする場合は調整するが、単純にインデックス順
        const hue = (i / this.barCount) * 360;
        bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 70%))`;
        bar.style.boxShadow = `0 0 8px hsl(${hue}, 100%, 50%)`;

        // カスタムデータとして色情報を持たせておく（あとでグローの更新に使う）
        bar.dataset.hue = String(hue);

        wrapper.appendChild(bar);
        this.spectrumContainer.appendChild(wrapper);
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
      const hue = bar.dataset.hue || '0';
      bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), hsl(${(parseFloat(hue) + 60) % 360}, 100%, 70%))`;
      bar.style.boxShadow = `0 0 8px hsl(${hue}, 100%, 50%)`;
    });
  }

  async initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext ||
        (window as any).AudioContext
      )();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512; // 分解能を上げる
      this.analyser.smoothingTimeConstant = 0.8; // 滑らかに減衰させる
      const source = this.audioContext.createMediaElementSource(
        this.audioElement,
      );
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      const buffer = new ArrayBuffer(this.analyser.frequencyBinCount);
      this.dataArray = new Uint8Array(buffer);
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

    // @ts-expect-error: Web Audio APIの型定義の問題を回避
    this.analyser.getByteFrequencyData(this.dataArray);

    // 左右対称にアニメーションさせる
    const halfCount = Math.floor(this.barCount / 2);

    this.spectrumBars.forEach((bar, index) => {
      const dataLength = this.dataArray?.length ?? 0;
      
      // 声の周波数成分は低〜中音域に集中するため、使う帯域を全体の15%に絞る
      const usefulDataLength = Math.floor(dataLength * 0.15);

      // 上部(index=0)から下部(index=halfCount)に向かって高音になるようにする
      const mappedIndex = index < halfCount ? index : this.barCount - index;
      
      // mappedIndex を有用な周波数データ範囲にマッピング
      const dataIndex = Math.floor((mappedIndex / halfCount) * usefulDataLength);
      
      // 単一データではなく近傍データの平均を取って滑らかな波形にする（スムージング）
      let sum = 0;
      let count = 0;
      for (let j = -1; j <= 1; j++) {
         const idx = dataIndex + j;
         if (idx >= 0 && idx < usefulDataLength) {
            sum += this.dataArray?.[idx] ?? 0;
            count++;
         }
      }
      const value = count > 0 ? sum / count : 0;

      // 声は音量が小さいことがあるため、拾った値を約2倍に増幅して0~1にクランプ（正規化）
      const normalizedValue = Math.min(1, (value / 255) * 2.0);
      
      // パワーの強調（非線形スケーリングでメリハリをつける）
      const power = Math.pow(normalizedValue, 1.2);
      
      // 高さを決定（最小15px、最大120pxなど）
      const height = 15 + power * 105;
      const intensity = power;

      bar.style.height = `${height}px`;

      // グローの強さを更新
      const hue = bar.dataset.hue || '0';
      bar.style.boxShadow = intensity > 0.1 
        ? `0 0 ${8 + intensity * 20}px hsl(${hue}, 100%, 50%)` 
        : `0 0 4px hsl(${hue}, 100%, 50%, 0.5)`;
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
      this.audioContext.close().catch(() => {});
    }
  }
}
