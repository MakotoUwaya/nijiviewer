import type { Channel } from "@/lib/holodex";
import { CalendarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, Image, Link } from "@heroui/react";

export function SearchResult({ channel }: { channel: Channel }) {
  return (
    <Card>
      <CardBody>
        <div className="flex gap-4">
          <div className="w-24 h-24">
            <Image
              alt={channel.name}
              className="object-cover rounded-lg"
              height={96}
              src={channel.photo}
              width={96}
            />
          </div>
          <div className="flex-1">
            <Link
              className="text-lg font-bold line-clamp-2"
              href={`https://youtube.com/channel/${channel.id}`}
              isExternal
            >
              {channel.name}
            </Link>
            <div className="flex flex-col gap-1 text-default-500 text-sm">
              <div className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4" />
                <span>
                  {Number(channel.subscriber_count).toLocaleString("ja-JP")}
                </span>
              </div>
              <div>
                {channel.org || "未所属"}{" "}
                {channel.suborg ? `/ ${channel.suborg.substring(2)}` : ""}
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {channel.published_at
                    ? new Date(channel.published_at).toLocaleDateString(
                        "ja-JP",
                        { year: "numeric", month: "long" },
                      )
                    : "不明"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function SearchResultList({ channels }: { channels: Channel[] }) {
  return (
    <div className="grid gap-4">
      {channels.map((channel) => (
        <SearchResult key={channel.id} channel={channel} />
      ))}
    </div>
  );
}
