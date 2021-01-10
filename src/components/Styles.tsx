/** @jsx jsx */
import { Global, jsx, css, useTheme } from '@emotion/react'
import { normalize, mix } from 'polished'

import { ThemeProps } from './Theme'

const GlobalStyles = () => {
  const theme = useTheme() as ThemeProps
  const highlight = mix(
    0.5,
    theme?.colorPairs[0].start,
    theme?.colorPairs[1].end,
  )

  return (
    <Global
      styles={css`
        ${normalize()}

        :root {
          --highlight-color: ${theme.highlightColor || highlight};

          --diamond-width: 10%;
          --center-width: 35%;
        }

        html {
          background-color: ${theme.backgroundColor};
        }

        a {
          text-decoration: none;
          color: ${theme.textColorLight};
        }
      `}
    />
  )
}

export default GlobalStyles
