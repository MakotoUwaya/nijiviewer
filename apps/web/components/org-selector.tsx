import type { JSX } from "react";

import type { Organization } from "@/lib/holodex";
import { Avatar, Select, SelectItem } from "@heroui/react";

type OrgSelectorProps = {
  items: Organization[];
  selectedKey: string;
  onChange: (organization: Organization) => void;
};

export default function OrgSelector({
  items,
  selectedKey,
  onChange,
}: OrgSelectorProps): JSX.Element {
  return (
    <Select
      aria-labelledby="Organization Selector"
      className="w-full md:w-60"
      defaultSelectedKeys={[selectedKey]}
      selectedKeys={[selectedKey]}
      items={items}
      onChange={(e) => {
        const organization = items.find((i) => i.id === e.target.value);
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
            <Avatar
              alt={organization.name}
              className="flex-shrink-0"
              size="sm"
              src={organization.logoUrl}
            />
            <div className="flex flex-col">
              <span className="text-small">{organization.name}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
