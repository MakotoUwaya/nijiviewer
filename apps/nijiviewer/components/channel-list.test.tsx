import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ChannelList from '@/components/channel-list';
import type { Channel, Organization } from '@/lib/holodex';

const mockOrg: Organization = {
  id: 'Nijisanji',
  name: 'にじさんじ',
  channelId: 'UCNiji',
};

const mockChannels: Channel[] = [
  {
    id: 'c1',
    name: '月ノ美兎',
    english_name: 'Tsukino Mito',
    org: 'Nijisanji',
    group: 'First Generation',
    suborg: '10First Generation',
    photo: 'https://example.com/mito.png',
    type: 'vtuber',
    subscriber_count: '1200000',
    video_count: '500',
  },
  {
    id: 'c2',
    name: '勇気ちひろ',
    english_name: 'Yuki Chihiro',
    org: 'Nijisanji',
    group: 'First Generation',
    suborg: '10First Generation',
    photo: 'https://example.com/chihiro.png',
    type: 'vtuber',
    subscriber_count: '600000',
    video_count: '300',
  },
  {
    id: 'c3',
    name: '剣持刀也',
    english_name: 'Kenmochi Toya',
    org: 'Nijisanji',
    group: '2nd Generation',
    suborg: '20Second Generation',
    photo: 'https://example.com/kenmochi.png',
    type: 'vtuber',
    subscriber_count: '900000',
    video_count: '400',
  },
];

describe('ChannelList', () => {
  it('renders organization name and total channels', () => {
    render(<ChannelList organization={mockOrg} channels={mockChannels} />);

    expect(screen.getByText('にじさんじ')).toBeInTheDocument();
    expect(screen.getByText(/全 3 チャンネル/)).toBeInTheDocument();
  });

  it('groups channels and renders group titles', () => {
    render(<ChannelList organization={mockOrg} channels={mockChannels} />);

    expect(screen.getByText('First Generation')).toBeInTheDocument();
    expect(screen.getByText('2nd Generation')).toBeInTheDocument();
    expect(screen.getByText('月ノ美兎')).toBeInTheDocument();
    expect(screen.getByText('剣持刀也')).toBeInTheDocument();
  });

  it('filters channels by search query', () => {
    render(<ChannelList organization={mockOrg} channels={mockChannels} />);

    const searchInput = screen.getByPlaceholderText(
      'ライバー名・グループ名で検索...',
    );
    fireEvent.change(searchInput, { target: { value: '剣持' } });

    expect(screen.getByText('剣持刀也')).toBeInTheDocument();
    expect(screen.queryByText('月ノ美兎')).not.toBeInTheDocument();
    expect(screen.getByText(/絞り込み: 1 件/)).toBeInTheDocument();
  });

  it('shows empty message when no channels match query', () => {
    render(<ChannelList organization={mockOrg} channels={mockChannels} />);

    const searchInput = screen.getByPlaceholderText(
      'ライバー名・グループ名で検索...',
    );
    fireEvent.change(searchInput, { target: { value: '存在しないライバー' } });

    expect(
      screen.getByText('該当するチャンネルが見つかりませんでした'),
    ).toBeInTheDocument();
  });

  it('handles expand all and collapse all buttons', () => {
    render(<ChannelList organization={mockOrg} channels={mockChannels} />);

    const collapseButton = screen.getByText('すべて折りたたむ');
    fireEvent.click(collapseButton);

    const expandButton = screen.getByText('すべて展開');
    fireEvent.click(expandButton);
  });

  it('keeps API order of groups (list API does not return suborg)', () => {
    // 実 API と同様に suborg を含まないデータ。API が返した順序を保持すること
    const apiOrdered = [
      { id: 'o1', name: 'Official Ch', group: 'Official' },
      { id: 'f1', name: 'Zeta', group: 'First Generation' },
      { id: 'f2', name: 'Alpha', group: 'First Generation' },
      { id: 's1', name: 'Beta', group: 'Second Generation' },
    ].map((c) => ({ ...c, org: 'Nijisanji', photo: '', type: 'vtuber' }));

    render(<ChannelList organization={mockOrg} channels={apiOrdered} />);

    const groupTitles = screen
      .getAllByRole('button', { expanded: true })
      .map((b) => b.textContent ?? '');
    expect(groupTitles[0]).toContain('Official');
    expect(groupTitles[1]).toContain('First Generation');
    expect(groupTitles[2]).toContain('Second Generation');

    // グループ内も API 順（名前順に並べ替えない）
    const names = screen
      .getAllByRole('link', { name: /^(Zeta|Alpha)$/ })
      .map((a) => a.textContent);
    expect(names).toEqual(['Zeta', 'Alpha']);
  });

  it('does not render a stray "0" when video_count is 0', () => {
    const zero = [
      {
        id: 'z1',
        name: 'ZeroVideo',
        org: 'Nijisanji',
        group: 'G',
        photo: '',
        type: 'vtuber',
        video_count: 0 as unknown as string,
      },
    ];
    const { container } = render(
      <ChannelList organization={mockOrg} channels={zero} />,
    );
    expect(container.textContent).toContain('0 本');
    expect(container.textContent).not.toMatch(/(^|[^\d,])0(?! 本)/);
  });
});
