import { Card, CardFooter, Image, User } from '@nextui-org/react';
import type { Video } from '../lib/holodex';

interface VideoProps {
  videos: Video[];
}

export default function Videos(props: VideoProps): JSX.Element {
  return (
    <div className='flex flex-col md:flex-row flex-wrap'>
      {props.videos.map((v) => (
        <div
          className='p-3 md:max-w-[33%] xl:max-w-[20%]'
          key={v.id}
        >
          <Card>
            <a
              href={`https://www.youtube.com/watch?v=${v.id}`}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Image
                alt={v.title}
                className='video-trim'
                removeWrapper
                radius='none'
                src={`https://i.ytimg.com/vi/${v.id}/sddefault.jpg`}
              />
            </a>
            <CardFooter className='bottom-0 p-0 z-10'>
              <div className='flex flex-col w-full px-1'>
                <p className='text-tiny break-words line-clamp-2 h-[32px] my-1'>
                  {v.title}
                </p>
                <User
                  avatarProps={{
                    src: v.channel.photo,
                    className: 'min-w-10',
                  }}
                  className='grow self-start mb-1 truncate'
                  description={`${v.channel.org}${v.channel.suborg ? ` / ${v.channel.suborg.substring(
                    2,
                  )}` : ''}`}
                  name={v.channel.name}
                />
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}
