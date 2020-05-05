import React, { useEffect, useMemo, useRef } from 'react';

// type Dispatch<A> = (value: A) => void;

type CanvasImageSource =
  | HTMLImageElement
  | SVGImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | null;
interface Props {
  drawImageOptions: {
    img: CanvasImageSource;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  width?: number;
  height?: number;
  dispatch?: any;
}

const ImgCanvasBox: React.FC<Props> = (props) => {
  const canvasObj = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const { img, x, y, width, height } = props.drawImageOptions;
    if (img) {
      const canvas = canvasObj.current as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(img, x, y, width, height);
      const url = canvas.toDataURL('image/png');

      if (props.dispatch) {
        props.dispatch({ type: 'set', payload: { url } });
      }
    }
  }, [props]);

  const styleHeight = useMemo(() => {
    return props && props.height && props.width
      ? (props.height / props.width) * 720
      : 540;
  }, [props]);

  return (
    <canvas
      ref={canvasObj}
      width={props.width}
      height={props.height}
      style={{ width: 720, height: styleHeight }}
    />
  );
};

export { ImgCanvasBox };
