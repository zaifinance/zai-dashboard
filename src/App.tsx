/** @jsx jsx */
import { jsx, ThemeProvider } from '@emotion/react'
import { Web3ReactProvider } from '@web3-react/core'

import { RecoilRoot } from 'recoil'

import { useThemeName } from './components/Theme'
import Styles from './components/Styles'
import Routes from './components/Routes'
import { Main, SiteWrapper } from './components/Layout'
import Footer from './components/Footer'
import AutoConnect from './components/AutoConnect'

import { getLibrary } from './utils/infura'

import { makeTheme } from './components/Theme'
import { lightTheme, darkTheme, colorsGreen, colorsGreenBW } from './theme'

const AppRoot = () => {
  const [themeName] = useThemeName()

  const theme =
    themeName === 'light'
      ? makeTheme(lightTheme, {
          colorPairs: colorsGreen,
        })
      : makeTheme(darkTheme, { colorPairs: colorsGreenBW })

  return (
    <ThemeProvider theme={theme}>
      <Styles />

      <SiteWrapper>
        <AutoConnect />
        <Main>
          <Routes />
        </Main>

        <Footer />
      </SiteWrapper>
    </ThemeProvider>
  )
}

const App = () => {
  return (
    <RecoilRoot>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AppRoot />
      </Web3ReactProvider>
    </RecoilRoot>
  )
}

export default App
