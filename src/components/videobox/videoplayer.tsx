import React, {
  useCallback,
  useEffect,
  useMemo,
  //   useReducer,
  useRef,
  useState,
} from 'react';

// import { useSelector } from 'react-redux';
// import { State } from 'pages/app/index.slice';

import classsNames from 'classnames';

import { Modal } from 'antd';
import { ImgCanvasBox } from './children/canvas';
import videojs from 'plugins/videojs-flvjs';

// import { initialState, reducer } from './reducer';

import 'assets/iconfont/video/iconfont.css';
import 'video.js/dist/alt/video-js-cdn.css';

import styles from './videoplayer.module.scss';

interface Props {
  videoUrl: string;
}

const playerOptions = {
  bigPlayButton: true,
  textTrackDisplay: false,
  errorDisplay: false,
  overNative: true,
  autoplay: false, // 如果true,浏览器准备好时开始播放。
  controls: false, //video 中的‘播放’标记
  loop: false, // true导致视频一结束就重新开始。
  preload: 'auto',
  language: 'zh-CN',
  aspectRatio: '4:3',
  techOrder: ['html5', 'flvjs'], // ["html5",'flvjs'],//兼容顺序
  width: 700,
  notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
  fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  sourceOrder: true,
  // flash: {
  //     swf: 'videojs-swf/dist/video-js.swf'
  // },
  html5: { hls: { withCredentials: false } },
  flvjs: {
    mediaDataSource: {
      isLive: true,
      cors: true,
      withCredentials: false,
    },
    MediaSegment: {
      autoCleanupSourceBuffer: true,
    },
  },
  sources: [
    {
      src:
        'https://d1--cn-gotcha04.bilivideo.com/live-bvc/115553/live_7734200_bs_1348183_1500.flv?cdn=cn-gotcha04\u0026expires=1587027348\u0026len=0\u0026oi=2105261353\u0026pt=web\u0026qn=150\u0026trid=9b4fd78561e040a3a3f719dc78c0e397\u0026sigparams=cdn,expires,len,oi,pt,qn,trid\u0026sign=dfe30dba8b258293227b81b9c503a42e\u0026ptype=0',
      type: 'video/flv',
    },
  ],
  poster: '',
};

const VideoPlayerBox: React.FC<Props> = (props) => {
  const isMobile = false;
  //   const { isMobile } = useSelector((state: State) => state.appPage);
  const [player, setPlayer] = useState<undefined | videojs.Player>(undefined);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isplaying, setIsplaying] = useState<boolean>(false);
  const [islive, setIslive] = useState<boolean>(true);
  const [isfullscreen, setIsfullscreen] = useState<boolean>(false);
  // const [isPC] = useState<boolean>(false); //是否是电脑，反之则为移动端，非鼠标操作

  const videobox = useRef<HTMLDivElement>(null);
  const videodiv = useRef<HTMLDivElement>(null);
  const videobar = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState<boolean>(false);
  const [iscanplay, setIscanplay] = useState<boolean>(false);

  // const [imgDataURL, dispatch] = useReducer(reducer, initialState);

  const initPlayer = useCallback(() => {
    const newsources = [
      {
        src: props.videoUrl,
        type: 'video/flv',
      },
    ];
    // 获取原始视频宽度；
    // console.log(
    //   this.state.player ? this.state.player.videoWidth() : null
    // );

    const newplayer = videojs(
      (videodiv.current as HTMLDivElement).children[0],
      Object.assign({}, playerOptions, { sources: newsources }),
      () => {
        // console.log('onPlayerReady');
        if (newplayer) {
          newplayer.on('fullscreenchange', () => {
            // videojs.log('Awww...over so soon?!');
            setIsfullscreen(newplayer ? newplayer.isFullscreen() : false);
          });
          newplayer.on('canplay', () => {
            setIscanplay(true);
          });
        }
      }
    );
    setPlayer(newplayer);
    return newplayer;
  }, [props.videoUrl]);

  useEffect(() => {
    let newplayer: videojs.Player;
    // 只有输入的 视频地址大于 5位字字符 才进行初始化;
    if (props.videoUrl.length > 5) {
      newplayer = initPlayer();
      console.log(newplayer);
    }
    return () => {
      if (newplayer) {
        newplayer.dispose();
      }
    };
  }, [props.videoUrl, initPlayer]);

  const play = () => {
    // console.log(player);
    // 播放
    if (player) {
      player.play();
      setIsplaying(true);
    }
  };
  const pause = () => {
    // 暂停
    if (player) {
      player.pause();
      setIsplaying(false);
    }
  };

  const togVideo = () => {
    if (isplaying) {
      pause();
    } else {
      play();
    }
  };

  const toglv = () => {
    setIslive((prev) => !prev);
    // this.setState({
    //   islive: !this.state.islive,
    // });
  };
  const togScreen = () => {
    if (player) {
      // console.log(this.state.player.isFullscreen() )
      if (player.isFullscreen()) {
        player.exitFullscreen();
      } else {
        player.requestFullscreen(); // 进入全屏
      }
    }
    // this.state.player.isFullscreen() 是否全屏
    // this.state.player.exitFullscreen()  //退出全屏
  };

  const screenshot = () => {
    if (!iscanplay) {
      alert('视频未准备好');
      return;
    }

    // const video = this.state.videodiv.current.children[0] as HTMLVideoElement;
    showModal();
  };

  // event: MouseEvent<T, MouseEvent>
  const mouseMoveFnc = (e: React.MouseEvent<HTMLDivElement>) => {
    // e.nativeEvent.offsetY  //鼠标在的高度
    // 当  鼠标 位于  视频的 70% 以下 y坐标 或  在videobar 时， 视频控制栏出现
    if (!player) {
      return;
    }
    if (
      e.nativeEvent.offsetY >
        (isfullscreen
          ? document.body.clientHeight * 0.7
          : (videobox.current as HTMLDivElement).clientHeight * 0.7) ||
      (videobar.current as HTMLDivElement).contains(e.target as Node)
    ) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
    // const {clientWidth, clientHeight} = e.target;
  };
  const mouseLeaveFnc = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsShow(false);
  };

  const tapFnc = (e: React.TouchEvent<any>) => {
    //触摸屏事件
    if (!(videobar.current as HTMLDivElement).contains(e.target as Node)) {
      setIsShow(!isShow);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  // const callFn = (dateUrl: string) => {
  //   setImgDataURL(dateUrl);
  // };

  const toSave = () => {
    // const save_link = document.createElementNS(
    //   'http://www.w3.org/1999/xhtml',
    //   'a'
    // ) as HTMLAnchorElement;
    // // console.log(imgDataURL);
    // save_link.href = imgDataURL.imgDataURL;
    // save_link.download = '下载';
    // const event = document.createEvent('MouseEvents');
    // event.initMouseEvent(
    //   'click',
    //   true,
    //   false,
    //   window,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   false,
    //   false,
    //   false,
    //   false,
    //   0,
    //   null
    // );
    // save_link.dispatchEvent(event);
    // document.execCommand('SaveAs');
  };

  // const str = useCallback(() => {
  //   return visible || isShow ? ' ' : ' hide';
  // }, [visible, isShow]);

  const barClassNames = useMemo(() => {
    console.log(
      classsNames(visible || isShow ? '' : styles.hide, styles.videobar)
    );
    return classsNames(visible || isShow ? '' : styles.hide, styles.videobar);
  }, [visible, isShow]);

  // let videobox=this.state.videobox.current;

  const drawImageOptions = {
    img: videodiv.current ? (videodiv.current.children[0] as any) : null,
    x: 0,
    y: 0,
    width: player ? player.videoWidth() : 720,
    height: player ? player.videoHeight() : 540,
  };
  // const key = 'videojs_'+this.state.key;
  const boxClassNames = classsNames(styles.mainbox, 'clearfix', {
    [styles.mobile]: isMobile,
  });
  const videoClassNames = classsNames(styles['video-js'], 'video-js');
  return (
    <React.Fragment>
      <div className={boxClassNames} ref={videobox}>
        <div
          data-vjs-player={true}
          ref={videodiv}
          onMouseMove={mouseMoveFnc}
          onMouseLeave={mouseLeaveFnc}
          onTouchEnd={tapFnc}
        >
          <video id="my-player" className={videoClassNames} />
          <div className={barClassNames} ref={videobar}>
            <button
              onClick={togVideo}
              className={
                isplaying
                  ? 'icon-zanting iconfont'
                  : 'icon-bofangsanjiaoxing iconfont'
              }
            />
            <button
              onClick={toglv}
              className={
                islive ? 'icon-huifang iconfont' : 'icon-live iconfont'
              }
            >
              {' '}
            </button>
            <button onClick={screenshot} className={'iconfont icon-paizhao'}>
              {' '}
            </button>
            <button className={'iconfont icon-luxiang'} />
            <button
              className={
                isfullscreen ? 'iconfont icon-suoxiao' : 'iconfont icon-suofang'
              }
              onClick={togScreen}
            />
            <button className={'iconfont icon-Shape'} />
          </div>
        </div>
        <Modal
          title="Modal"
          visible={visible}
          centered={true}
          onOk={toSave}
          onCancel={hideModal}
          destroyOnClose={true}
          width={768}
          getContainer={() => {
            return isfullscreen
              ? (videodiv.current as HTMLDivElement)
              : document.body;
          }}
          okText="确认"
          cancelText="取消"
        >
          <div>
            {/* {this.state.visible?111:222} */}
            <ImgCanvasBox
              drawImageOptions={drawImageOptions}
              width={player ? player.videoWidth() : 720}
              height={player ? player.videoHeight() : 540}
              // dispatch={dispatch}
              dispatch={() => {}}
            />
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export { VideoPlayerBox };
