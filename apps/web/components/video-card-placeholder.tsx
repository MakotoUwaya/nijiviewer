import type { PlaceholderVideo } from "@/lib/holodex";
import {
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  User,
} from "@nextui-org/react";
import { DateTime } from "luxon";
import type { JSX } from "react";

const getDomain = (url: string): string => {
  return new URL(url).hostname;
};

const getStarted = (target: string | undefined): string => {
  if (!target) {
    return "";
  }
  const targetDateTime = DateTime.fromISO(target);
  return targetDateTime.toRelative() || "";
};

export default function VideoCardPlaceholder(
  video: PlaceholderVideo & { started: boolean },
): JSX.Element {
  const channelDescription = `${video.channel.org}${video.channel.suborg ? ` / ${video.channel.suborg.substring(2)}` : ""
    }`;
  const videoStatusText = video.started
    ? `Live - ${getDomain(video.link)} Started streaming ${getStarted(video.start_actual)}`
    : "Will probably start soon";
  return (
    <div className="p-2 w-full md:w-[33%] xl:w-[20%]">
      <Card>
        <CardHeader className="absolute z-10 p-1 flex-col items-start">
          <Chip color="default" radius="sm" size="sm" variant="faded">
            {video.topic_id || video.type}
          </Chip>
        </CardHeader>
        <a href={video.link} rel="noopener noreferrer" target="_blank">
          <Image
            alt={video.title}
            className="z-0"
            removeWrapper
            radius="none"
            src={video.thumbnail}
          />
        </a>
        <CardFooter className="bottom-0 p-0 z-10">
          <div className="flex flex-col w-full px-1">
            <p className="text-tiny break-words line-clamp-2 h-[32px] my-1">
              {video.title}
            </p>
            <User
              avatarProps={{
                src: video.channel.photo,
                className: "min-w-10",
              }}
              classNames={{
                base: "self-start",
                name: "line-clamp-1",
                description: "line-clamp-1",
              }}
              description={channelDescription}
              name={video.channel.name}
            />
            <p className="text-tiny p-1 truncate">{videoStatusText}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
