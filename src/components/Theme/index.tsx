/** @jsx jsx */
import { jsx, css, ThemeProvider } from '@emotion/react'
import { transparentize, mix } from 'polished'
import { useEffect } from 'react'
import { useLocalStorage } from 'react-use'
import { atom, useRecoilState } from 'recoil'

export interface ThemeProps {
  padUnit: number
  highlightColor: string
  textColor: string
  textColorLight: string
  textColorLightest: string

  baseColor: string
  backgroundColor: string
  backgroundColorLight: string

  colorPairs: Array<{
    start: string
    end: string
  }>
  altColorPairs?: Array<{
    start: string
    end: string
  }>

  buttonColor: string
}

export type Themed<T = any> = T & { theme?: ThemeProps }

export const coolStuff = (props) => {
  const { theme } = props
  const colors = theme.colorPairs
  const altColors = theme.altColorPairs

  let color0start = colors[0].start
  let color0end = colors[0].end
  let color1start = colors[1].start
  let color1end = colors[1].end

  const mixRatio = 0.5
  if (altColors) {
    color0start = mix(mixRatio, color0start, altColors[0].start)
    color0end = mix(mixRatio, color0end, altColors[0].end)
    color1start = mix(mixRatio, color1start, altColors[1].start)
    color1end = mix(mixRatio, color1end, altColors[1].end)
  }

  return css`
    position: relative;
    z-index: 0;

    &::before {
      content: '';
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
      /* background: rgba(0, 0, 0, 1); */
      /* background: #fd746c; */
      /* background: linear-gradient(
          115deg,
          ${colors[0].start} 0%,
          ${colors[0].end} 33.33%,
          rgba(0, 0, 0, 0) 33.33%,
          rgba(0, 0, 0, 0) 66.66%,
          ${colors[1].start} 66.66%,
          ${colors[1].end} 100%
        ); */
      background-image: linear-gradient(
        115deg,
        ${color0start} 0%,
        ${color1end}
          calc(50% - (var(--center-width) / 2) - var(--diamond-width)),
        ${color0start}
          calc(50% - (var(--center-width) / 2) - var(--diamond-width)),
        ${color0end} calc(50% - (var(--center-width) / 2)),
        rgba(0, 0, 0, 0) calc(50% - (var(--center-width) / 2)),
        rgba(0, 0, 0, 0) calc(50% + (var(--center-width) / 2)),
        ${color1start} calc(50% + (var(--center-width) / 2)),
        ${color1end}
          calc(50% + (var(--center-width) / 2) + var(--diamond-width)),
        ${color0start}
          calc(50% + (var(--center-width) / 2) + var(--diamond-width)),
        ${color1end} 100%
      );

      opacity: 1;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      top: 0;
      width: 100%;
      height: 100%;

      background: linear-gradient(
        65deg,
        ${transparentize(0.5, color0start)} 0%,
        ${transparentize(0.5, color0end)}
          calc(50% - (var(--center-width) / 2) - var(--diamond-width)),
        ${transparentize(0.4, color1start)}
          calc(50% - (var(--center-width) / 2) - var(--diamond-width)),
        ${transparentize(0, color1end)} calc(50% - (var(--center-width) / 2)),
        rgba(0, 0, 0, 0) calc(50% - (var(--center-width) / 2)),
        rgba(0, 0, 0, 0) calc(50% + (var(--center-width) / 2)),
        ${transparentize(0, color0start)} calc(50% + (var(--center-width) / 2)),
        ${transparentize(0.4, color0end)}
          calc(50% + (var(--center-width) / 2) + var(--diamond-width)),
        ${transparentize(0.5, color1start)}
          calc(50% + (var(--center-width) / 2) + var(--diamond-width)),
        ${transparentize(0.5, color1end)} 100%
      );
    }
  `
}

export const SupplyThemeProvider = (props) => (
  <ThemeProvider
    theme={(theme: ThemeProps) => {
      return makeTheme(theme, {
        buttonColor: theme.colorPairs[0].start,
        colorPairs: [theme.colorPairs[0], theme.colorPairs[0]],
      })
    }}
    {...props}
  />
)

export const LiquidityThemeProvider = (props) => (
  <ThemeProvider
    theme={(theme: ThemeProps) => {
      return makeTheme(theme, {
        buttonColor: theme.colorPairs[1].start,
        colorPairs: [theme.colorPairs[1], theme.colorPairs[1]],
      })
    }}
    {...props}
  />
)

export const makeTheme = (base, theme) => {
  const newTheme = {
    ...base,
    ...theme,
  }
  if (!newTheme.highlightColor) {
    newTheme.highlightColor = mix(
      0.5,
      newTheme.colorPairs[0].start,
      newTheme.colorPairs[1].start,
    )
  }
  return newTheme
}

export const themeNameAtom = atom({
  key: 'ThemeName',
  default: 'light',
})

export const useThemeName = (): [string, (string) => void] => {
  const [lsThemeName, lsSetThemeName] = useLocalStorage('ThemeName', 'light')

  const [themeName, setThemeName] = useRecoilState(themeNameAtom)

  useEffect(() => {
    setThemeName(lsThemeName)
  }, [lsThemeName, setThemeName])

  return [
    themeName,
    (newThemeName: string) => {
      setThemeName(newThemeName)
      lsSetThemeName(newThemeName)
    },
  ]
}
