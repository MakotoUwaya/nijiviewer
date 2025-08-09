import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AivisCloudAPIPage from './page';

// NextUIのプロバイダーをモック
vi.mock('@heroui/react', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Textarea: ({ placeholder, ...props }: any) => (
    <textarea placeholder={placeholder} {...props} />
  ),
}));

// Web Audio APIをモック
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    createAnalyser: vi.fn(() => ({
      fftSize: 256,
      frequencyBinCount: 128,
      getByteFrequencyData: vi.fn(),
    })),
    createMediaElementSource: vi.fn(() => ({
      connect: vi.fn(),
    })),
    destination: {},
  })),
});

// MediaSource APIをモック
Object.defineProperty(window, 'MediaSource', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    addSourceBuffer: vi.fn(() => ({
      updating: false,
      addEventListener: vi.fn(),
      appendBuffer: vi.fn(),
    })),
    addEventListener: vi.fn(),
    endOfStream: vi.fn(),
  })),
});

describe('AivisCloudAPIPage', () => {
  it('ページタイトルが正しく表示される', () => {
    render(<AivisCloudAPIPage />);
    expect(screen.getByText('おしゃべり音声モデル')).toBeInTheDocument();
  });

  it('テキストエリアが表示される', () => {
    render(<AivisCloudAPIPage />);
    expect(
      screen.getByPlaceholderText('音声モデルに話してほしいことを入力'),
    ).toBeInTheDocument();
  });

  it('ボタンが表示される', () => {
    render(<AivisCloudAPIPage />);
    expect(screen.getByText('話して音声モデル！')).toBeInTheDocument();
  });

  it('音声モデル画像が表示される', () => {
    render(<AivisCloudAPIPage />);
    const image = screen.getByLabelText('voice model image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveStyle({
      backgroundImage:
        'url(https://assets.aivis-project.com/aivm-models/30b0ab4c-893b-4c73-8c2a-29059656e3d8/speakers/b903b46a-4b54-4ff1-9ab9-eb009b179cac/icon.jpg)',
    });
  });

  it('オーディオ要素が存在する', () => {
    render(<AivisCloudAPIPage />);
    const audio = document.querySelector('audio');
    expect(audio).toBeInTheDocument();
  });

  it('スペクトラムコンテナが存在する', () => {
    render(<AivisCloudAPIPage />);
    const spectrumContainer = document.querySelector('.spectrum-container');
    expect(spectrumContainer).toBeInTheDocument();
  });
});
