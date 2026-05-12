import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

const PRIMARY_COLOR = '#e8e8e8'
const SECONDARY_COLOR = '#e0e0e0'
type Props = {
  children: any
  height?: string | number
  mobileHeight?: string | number
  width?: string | number
  mobileWidth?: string | number
  fontSize?: string | number
  lineHeight?: string | number
}

const WrapperCustomSkeleton = ({ children, height, mobileHeight, width, mobileWidth, fontSize, lineHeight }: Props) => {
  const [childVisible, setChildVisible] = React.useState(false);
  const { deviceInfo } = useRuntime();
  const boxWidth = deviceInfo.isMobile ? mobileWidth ?? width ?? "100%" : width ?? "100%";
  const boxHeigth = deviceInfo.isMobile ? mobileHeight ?? height ?? "100%" : height ?? "100%";
  React.useEffect(() => {
    setChildVisible(true);
  }, [children])

  return <div style={!childVisible ? {
    width: boxWidth,
    height: boxHeigth,
    position: 'relative',
    backgroundColor: SECONDARY_COLOR,
    backgroundImage: `linear-gradient(90deg, ${SECONDARY_COLOR}, ${SECONDARY_COLOR} 50%, ${PRIMARY_COLOR} 60%, ${SECONDARY_COLOR} 65%, ${SECONDARY_COLOR})`,
    backgroundRepeat: 'repeat-x',
    borderRadius: "8px",
    fontSize: fontSize,
    lineHeight: lineHeight
  } : {}}
    suppressHydrationWarning>
    {children}
  </div>
}

export default WrapperCustomSkeleton;
