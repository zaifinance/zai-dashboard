/** @jsx jsx */
import { jsx } from '@emotion/react'
import styled from '@emotion/styled'
import { rem, transparentize } from 'polished'

import { Flex } from '../Elements'
import { Themed, useThemeName } from '../Theme'

type FooterLinkProp = {
  icon: any
  href: string
}

const Icon = styled.span`
  font-size: ${rem(18)};
`

const A = styled.a<Themed>`
  color: ${(props) => props.theme.textColorLight};
  padding: ${rem(2)} ${rem(8)};

  cursor: pointer;
`

const FooterLink = ({ icon, href }: FooterLinkProp) => {
  return (
    <A href={href} target="_blank" rel="noopener noreferrer">
      <Icon>{icon}</Icon>
    </A>
  )
}

const FooterWrapper = styled.div<Themed>`
  position: fixed;
  z-index: 2;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: ${rem(12)};
  padding: ${rem(12)};
  background: ${(props) => props.theme.backgroundColor};
  border-top: ${rem(1)} solid
    ${(props) => transparentize(0.9, props.theme.textColor)};
`

function Footer() {
  const [themeName, setThemeName] = useThemeName()

  return (
    <FooterWrapper>
      <Flex>
        <FooterLink
          icon={<i className="fab fa-twitter" />}
          href={'https://www.twitter.com/zaifinance'}
        />
        <FooterLink
          icon={<i className="fab fa-medium" />}
          href={'https://www.medium.com/@zaifinance'}
        />
        <FooterLink
          icon={<i className="fab fa-github" />}
          href={'https://www.github.com/zaifinance/zai-protocol'}
        />
        <FooterLink
          icon={<i className="fab fa-telegram" />}
          href={'https://t.me/ZAIcommunitygroup'}
        />
        <FooterLink
          icon={<i className="fab fa-discord" />}
          href={'https://discord.gg/39gJDPdeke'}
        />

        {/* <div>
            Made with{' '}
            <span role="img" aria-labelledby="heartbreak">
              💔️
            </span>{' '}
            by the Zero Collateral Devs
          </div> */}
      </Flex>
      <div>
        <A
          onClick={() => setThemeName(themeName === 'light' ? 'dark' : 'light')}
        >
          <Icon>
            <i className={`fas fa-${themeName === 'light' ? 'moon' : 'sun'}`} />
          </Icon>
        </A>
      </div>
    </FooterWrapper>
  )
}

export default Footer
