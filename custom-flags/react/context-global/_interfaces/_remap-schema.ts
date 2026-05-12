import React from "react"

type T_styles = {} & React.CSSProperties

export type RemappperQuadrantHorizontal = {
  position?: string
  display?: string
  alignItems?: string
} & T_styles





export interface RemapperQuadrantTopRight {
  right?: string
  top?: string
  maxWidth?: string
  display?: string
  flexDirection?: string
  rowGap?: string
}

export interface RemapperQuadrantTopLeft {
  left?: string
  top?: string
  maxWidth?: string
  display?: string
  flexDirection?: string
  rowGap?: string
}

export interface RemapperQuadrantBottom {
  bottom?: string
  display?: string
  position?: string
  width?: string
  alignItems?: string
  rowGap?: string
  columnGap?: string
  flexWrap?: string
  right?: string
  justifyContent?: string
  left?: string
  transform?: string
  flexDirection?: string
}

export interface RemapperContentImage {
  src?: string
  alt?: string
  width?: string
  height?: string
}

export interface RemapperStylesApp {
  containerBadge?: {
    flexGrow?: string
    flexBasis?: string
  }
}

export interface RemapperContentContent {
  text?: string
  color?: string
  fontSize?: string
  lineHeight?: string
  fontWeight?: string
  borderRadius?: string
  backgroundColor?: string
  width?: string
  height?: string
  display?: string

  flexGrow?: string
  flexBasis?: string

  alignItems?: string
  justifyContent?: string
  textAlign?: string
  zIndex?: number
}
