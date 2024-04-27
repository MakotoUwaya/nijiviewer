'use client';

import { Avatar, Select, SelectItem } from '@nextui-org/react';

import type { Organization } from '@/lib/holodex';

type OrgSelectorProps = {
  items: Organization[];
  defaultSelectedKeys: string[];
  onChange: (organization: Organization) => void;
};

export default function OrgSelector({
  items,
  defaultSelectedKeys,
  onChange,
}: OrgSelectorProps): JSX.Element {
  return (
    <Select
      aria-labelledby='Organization Selector'
      className='w-80'
      defaultSelectedKeys={defaultSelectedKeys}
      items={items}
      onChange={(e) => {
        const organization = items.find(i => i.id === e.target.value);
        if (organization) {
          onChange(organization);
        }
      }}
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <Avatar
              alt={item.data?.name}
              className="flex-shrink-0"
              size="sm"
              src={item.data?.logoUrl}
            />
            <div className="flex flex-col">
              <span>{item.data?.name}</span>
            </div>
          </div>
        ));
      }}
    >

      {(organization) => (
        <SelectItem key={organization.id} textValue={organization.name}>
          <div className="flex gap-2 items-center">
            <Avatar alt={organization.name} className="flex-shrink-0" size="sm" src={organization.logoUrl} />
            <div className="flex flex-col">
              <span className="text-small">{organization.name}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
