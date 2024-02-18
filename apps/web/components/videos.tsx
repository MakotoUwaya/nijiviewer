import { Card, CardFooter, Image, User } from '@nextui-org/react';
import type { Video } from '../lib/holodex';

interface VideoProps {
  videos: Video[];
}

export default function Videos(props: VideoProps): JSX.Element {
  return (
    <>
      {props.videos.map((v) => (
        <Card className='max-w-sm mx-1' key={v.id}>
          <a
            href={`https://www.youtube.com/watch?v=${v.id}`}
            rel='noopener noreferrer'
            target='_blank'
          >
            <Image
              alt={v.title}
              className='z-0 w-full object-cover'
              isZoomed
              removeWrapper
              src={`https://i.ytimg.com/vi/${v.id}/sddefault.jpg`}
            />
          </a>
          <CardFooter className='bg-black bottom-0 p-0 z-10'>
            <div className='flex flex-col w-full px-1'>
              <p className='text-tiny text-white break-words h-[32px] my-1'>
                {v.title}
              </p>
              <User
                avatarProps={{
                  src: v.channel.photo,
                }}
                className='self-start mb-1'
                description={`${v.channel.org} / ${v.channel.suborg.substring(
                  2,
                )}`}
                name={v.channel.name}
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
