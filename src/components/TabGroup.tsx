/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { rem } from 'polished'
import { useEffect } from 'react'
import { atomFamily, useRecoilState } from 'recoil'
import { Themed } from './Theme'

export const TabGroupContainer = styled.div`
  width: 100%;
`

export const TabGroupOptions = styled.div`
  width: 100%;
  z-index: 1;
  display: flex;
`

const Line = styled.div`
  background-color: rgba(170, 184, 193, 0.3);
  height: 1px;
  margin-top: -1px;
`

interface TabOptionProps {
  active?: boolean
}

export const TabOption = styled.div<Themed<TabOptionProps>>`
  position: relative;
  font-size: ${rem(13)};
  font-weight: 500;
  margin-left: 0;
  text-align: center;
  text-transform: uppercase;
  width: 50%;

  color: rgb(170, 184, 193);

  cursor: pointer;

  padding: ${rem(13)};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: ${rem(2)};
    background-color: ${(props) => props.theme.colorPairs[0].start};
    opacity: 0.3;
    transition: all 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  ${(props) =>
    props.active
      ? css`
          color: ${props.theme.colorPairs[0].start};

          &::after {
            height: ${rem(3)};
            opacity: 1;
          }
        `
      : css`
          &:hover {
            color: rgb(85, 92, 95);

            &::after {
              height: ${rem(2)};
            }
          }
        `}
`

export const tabStateAtom = atomFamily({
  default: null,
  key: 'TabState',
})

const TabGroup = ({ tabs = [], name = '' }) => {
  const [currentTab, setCurrentTab] = useRecoilState(tabStateAtom(name))

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setCurrentTab(tabs?.[0])

    return () => {
      setCurrentTab(tabs[0])
    }
  }, [])

  return (
    <TabGroupContainer>
      <TabGroupOptions>
        {tabs.map((name) => {
          return (
            <TabOption
              key={name}
              active={name === currentTab}
              onClick={() => {
                setCurrentTab(name)
              }}
            >
              {name}
            </TabOption>
          )
        })}
      </TabGroupOptions>
      <Line />
    </TabGroupContainer>
  )
}

export default TabGroup
