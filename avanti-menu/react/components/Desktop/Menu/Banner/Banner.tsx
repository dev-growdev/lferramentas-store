import React, { useEffect, useState } from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useAvantiMenuDesktop } from "../../../../context/AvantiMenuContext"
import { OthersProps } from "../../../../typings/types"
import { FormatText } from "../../../Utils/FormatString"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { Link } from "vtex.render-runtime"

export const Banner = ({ banner, alt }: OthersProps) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuDesktop()
  const [newWidth, setNewWidth] = useState(0)
  const [newHeight, setNewHeight] = useState(0)

  useEffect(() => {
    const setImageSize = () => {
      banner?.map(({ src }) => {
        if (src) {
          const img = new Image();
          if (img) {
            img.src = src;
            img.onload = () => {
              setNewWidth(img.width)
              setNewHeight(img.height)
            };
          }
        }
      })
    };

    setImageSize()
  }, [banner])

  return (
    <>
      {banner?.map(({ link, src, target }) =>
        src ?
          <div key={`${src}-${alt}`} className={css['desktop-bannerContent']}>
            <Link to={link}
              target={target ? '_blank' : '_self'}
              className={applyModifiers(
                css['desktop-bannerLink'],
                alt ? FormatText(alt) : ''
              )}
            >
              <img src={src}
                alt={alt}
                style={{
                  maxWidth: props.bannerSize.width ? `${props.bannerSize.width}px` : '',
                  maxHeight: props.bannerSize.height ? `${props.bannerSize.height}px` : '',
                }}
                height={newHeight}
                width={newWidth}
                className={applyModifiers(
                  css['desktop-bannerImage'],
                  alt ? FormatText(alt) : ''
                )}
              />
            </Link>
          </div>
          : ''
      )
      }
    </>
  )
}
