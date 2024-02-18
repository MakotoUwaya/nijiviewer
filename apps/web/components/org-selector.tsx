'use client';

import { Avatar, Select, SelectItem } from '@nextui-org/react';

type OrgSelectorProps = {
  onUpdateSelected?: (org: string) => void;
};

export default function OrgSelector({
  onUpdateSelected,
}: OrgSelectorProps): JSX.Element {
  return (
    <Select
      aria-labelledby='Organization Selector'
      className='max-w-80'
      defaultSelectedKeys={['Nijisanji']}
      onChange={(e) => {
        onUpdateSelected?.(e.target.value);
      }}
    >
      <SelectItem
        aria-labelledby='Nijisanji'
        key='Nijisanji'
        value='Nijisanji'
        startContent={
          <Avatar
            alt='Nijisanji'
            className='w-6 h-6'
            src='https://yt3.ggpht.com/ytc/AKedOLSWxXsb2nHf7l5JIOhHr1G_DXAIvBTfZatmsimn=s88-c-k-c0x00ffffff-no-rj'
          />
        }
      >
        にじさんじ
      </SelectItem>
    </Select>
  );
}
