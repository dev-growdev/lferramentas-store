import React from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { imageUrl } from '../utils/aspectRatioUtil'

type Props = {
  images: TImage[],
  aspectRatio?: AspectRatio,
  maxHeight?: number | string
}

type TImage = {
  imageLabel: string,
  imageText: string,
  imageUrl: string
}

type TImageProps = {
  img: TImage,
  aspectRatio?: AspectRatio,
  maxHeight?: number | string
}

type AspectRatio = string | number

const CSS_HANDLES = ['productImage360', 'productImage360Slide', 'selected', 'dragging']
const IMAGE_SIZES = [600, 800, 1200]
const DEFAULT_SIZE = 800
const MAX_SIZE = 2048

const Image = ({ img, aspectRatio, maxHeight = 600 }: TImageProps) => {
  const src = img.imageUrl;
  const srcSet = React.useMemo(
    () =>
      IMAGE_SIZES.map(
        size => `${imageUrl(src, size, MAX_SIZE, aspectRatio)} ${size}w`
      ).join(','),
    [src, aspectRatio]
  )
  return <img
    src={imageUrl(src, DEFAULT_SIZE, MAX_SIZE, aspectRatio)}
    srcSet={srcSet}
    alt={img.imageText}
    title={img.imageLabel}
    draggable={false}
    onDragStart={e => e.preventDefault()}
    style={{
      width: '100%',
      height: '100%',
      maxHeight: maxHeight || 'unset',
      objectFit: 'contain',
    }}
    sizes="(max-width: 64.1rem) 100vw, 50vw"
    loading='eager'
    data-vtex-preload='true'
  />
}

export default function Image360({ images, ...props }: Props) {
  const TIME_TO_SHOWCASE_MS = 200;
  const { handles } = useCssHandles(CSS_HANDLES)
  const image360Ref = React.useRef(null as HTMLDivElement | null)
  const interval = React.useRef<number | undefined>(undefined);
  const lastCoord = React.useRef<number>(0);
  const toChange = React.useRef<number>(0);

  function rotate(reverse = false) {
    image360Ref?.current?.querySelector(`[data-index="${toChange.current}"]`)?.classList.remove(handles.selected)
    if (reverse) {
      toChange.current -= 1;
      if (toChange.current < 0) toChange.current = images.length - 1;
    } else {
      toChange.current += 1;
      if (toChange.current >= images.length) toChange.current = 0;
    }
    image360Ref?.current?.querySelector(`[data-index="${toChange.current}"]`)?.classList.add(handles.selected)
  }

  function onMouseDown(e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }

    image360Ref?.current?.classList.add(handles.dragging);

    let clientX: number | undefined;

    if ("touches" in e) {
      clientX = e.touches[0]?.clientX;
    } else {
      clientX = e.clientX;
    }

    lastCoord.current = clientX;

    if ("touches" in e) {
      document.body.addEventListener("touchmove", onMouseMove);
    } else {
      document.body.addEventListener("mousemove", onMouseMove);
    }
  }

  function onMouseUp() {
    image360Ref?.current?.classList.remove(handles.dragging);
    document.body.removeEventListener("touchmove", onMouseMove as EventListener);
    document.body.removeEventListener("mousemove", onMouseMove as EventListener);
  }

  function onMouseMove(e: TouchEvent | MouseEvent) {
    if (!image360Ref?.current?.classList.contains(handles.dragging)) return;

    let currentCoord: number;

    if (e instanceof TouchEvent) {
      currentCoord = e.changedTouches[0]?.clientX ?? 0;
    } else if (e instanceof MouseEvent) {
      currentCoord = e.clientX;
    } else {
      return;
    }

    const pixelsMoved = currentCoord - lastCoord.current;
    if (Math.abs(pixelsMoved) < 5) return;
    lastCoord.current = currentCoord;

    if (pixelsMoved < 0) rotate();
    if (pixelsMoved > 0) rotate(true);
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (image360Ref?.current?.classList.contains(handles.dragging)) {
      const touch = e.touches[0];

      const syntheticMouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent;

      onMouseMove(syntheticMouseEvent);
    }
  }


  React.useEffect(() => {
    document.body.addEventListener("touchend", onMouseUp);
    document.body.addEventListener("mouseup", onMouseUp);
    interval.current = setInterval(rotate, TIME_TO_SHOWCASE_MS);
    return () => {
      if (interval.current) clearInterval(interval.current);
      document.body.removeEventListener("touchend", onMouseUp);
      document.body.removeEventListener("mouseup", onMouseUp);
      toChange.current = 0;
      image360Ref?.current?.querySelector(`[data-index]`)?.classList.remove(handles.selected);
      image360Ref?.current?.querySelector(`[data-index="0"]`)?.classList.add(handles.selected);
    }
  }, [])

  return (
    <div
      className={`${applyModifiers(handles.productImage360, 'main')}`}
      onTouchStart={onMouseDown}
      onMouseDown={onMouseDown}
      onTouchMove={onTouchMove}
      ref={image360Ref}
    >
      {images.map((img, index) => (
        <div
          key={handles.productImage360 + index}
          data-index={index}
          className={`${toChange.current === index ? `${handles.productImage360Slide} ${handles.selected}` : handles.productImage360Slide}`}
        >
          <Image img={img} {...props} />
        </div>
      ))}
    </div>
  )
}
