import React, { useEffect } from 'react';
import { VideoPlayerBox } from 'components/videobox';
// import { ajax } from 'rxjs/ajax';
// import { map, catchError } from 'rxjs/operators';
// import { of } from 'rxjs';

import './index.scss';

export const VideoPage: React.FC = () => {
  // const obs$ = ajax(
  //   `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=48267&qn=0&platform=web`
  // ).pipe(
  //   map((userResponse) => console.log('users: ', userResponse)),
  //   catchError((error) => {
  //     console.log('error: ', error);
  //     return of(error);
  //   })
  // );

  useEffect(() => {
    console.log(1);
    // obs$.subscribe();
  });

  return (
    <div className={'box'}>
      <VideoPlayerBox
        videoUrl={
          'https://d1--cn-gotcha04.bilivideo.com/live-bvc/829664/live_9076081_6412632.flv?cdn=cn-gotcha04&expires=1588836610&len=0&oi=2105261681&pt=web&qn=10000&trid=b99e46f2d34f4c4fb4c93041d9cd37dc&sigparams=cdn,expires,len,oi,pt,qn,trid&sign=55b2081442653f731c110c439a969f11&ptype=0'
        }
      />
    </div>
  );
};
