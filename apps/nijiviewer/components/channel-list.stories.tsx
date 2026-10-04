import type { Meta, StoryObj } from '@storybook/react';
import ChannelList from './channel-list';

const meta = {
  title: 'Components/ChannelList',
  component: ChannelList,
  tags: ['autodocs'],
  args: {
    organization: {
      id: 'Nijisanji',
      name: 'にじさんじ',
      channelId: 'UCX7YkU9nEeaoZbkVLVajcMg',
    },
    channels: [
      {
        id: 'c1',
        name: '月ノ美兎',
        english_name: 'Tsukino Mito',
        org: 'Nijisanji',
        group: 'First Generation',
        suborg: '10First Generation',
        photo: 'https://yt3.ggpht.com/sample1.png',
        type: 'vtuber',
        subscriber_count: '1250000',
        video_count: '850',
      },
      {
        id: 'c2',
        name: '勇気ちひろ',
        english_name: 'Yuki Chihiro',
        org: 'Nijisanji',
        group: 'First Generation',
        suborg: '10First Generation',
        photo: 'https://yt3.ggpht.com/sample2.png',
        type: 'vtuber',
        subscriber_count: '640000',
        video_count: '520',
      },
      {
        id: 'c3',
        name: '剣持刀也',
        english_name: 'Kenmochi Toya',
        org: 'Nijisanji',
        group: '2nd Generation',
        suborg: '20Second Generation',
        photo: 'https://yt3.ggpht.com/sample3.png',
        type: 'vtuber',
        subscriber_count: '980000',
        video_count: '430',
      },
      {
        id: 'c4',
        name: '伏見ガク',
        english_name: 'Fushimi Gaku',
        org: 'Nijisanji',
        group: '2nd Generation',
        suborg: '20Second Generation',
        photo: 'https://yt3.ggpht.com/sample4.png',
        type: 'vtuber',
        subscriber_count: '450000',
        video_count: '310',
      },
    ],
  },
} satisfies Meta<typeof ChannelList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
