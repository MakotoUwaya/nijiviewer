import type { StreamVideo } from "@/lib/holodex";
import {
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Tooltip,
  User,
} from "@heroui/react";
import { DateTime } from "luxon";
import type { JSX } from "react";

const getStarted = (target: string | undefined): string => {
  if (!target) {
    return "";
  }
  const targetDateTime = DateTime.fromISO(target);
  return targetDateTime.toRelative() || "";
};

export default function VideoCardStream(
  video: StreamVideo & { started: boolean },
): JSX.Element {
  const channelDescription = `${video.channel.org}${video.channel.suborg ? ` / ${video.channel.suborg.substring(2)}` : ""
    }`;
  const canShowViewer = video.topic_id !== "membersonly";
  const viewersCount = canShowViewer
    ? `${video.live_viewers?.toLocaleString() || ""} watching now `
    : "";
  const videoStatusText = video.started
    ? `${viewersCount}Started streaming ${getStarted(video.start_actual || "")}`
    : "Will probably start soon";

  return (
    <div className="p-2 w-full md:w-[33%] xl:w-[20%]">
      <Card>
        <CardHeader className="absolute z-10 p-1 flex-col items-start">
          <Chip color="default" radius="sm" size="sm" variant="faded">
            {video.topic_id || video.type}
          </Chip>
        </CardHeader>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt={video.title}
            className={`z-0${video.type === "stream" ? " video-trim" : ""}`}
            removeWrapper
            radius="none"
            src={`https://i.ytimg.com/vi/${video.id}/sddefault.jpg`}
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
            <Tooltip
              content={videoStatusText}
              delay={1000}
              placement="bottom-start"
              size="sm"
            >
              <p className="text-tiny p-1 truncate">{videoStatusText}</p>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
