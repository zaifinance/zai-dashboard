/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { rem, transparentize } from 'polished'
import { atomFamily, useRecoilState } from 'recoil'
import BigNumber from 'bignumber.js'

import { Text, Spacer, Input, Flex } from '../Elements'
import { IconLocked } from '../Icons'
import { Themed } from '../Theme'
import NumberFormat from 'react-number-format'

interface InputProps {
  max: BigNumber
  name: string
  disabled?: boolean
  unit?: string
}

export const formInputAtomFamily = atomFamily({
  key: 'FormInputFamily',
  default: null,
})

const NumberInput = Input.withComponent(NumberFormat)

export const InputContainer = styled(Flex)`
  align-items: center;
  position: relative;
  width: 100%;
  appearance: none;
  outline: none;

  padding: ${rem(16)};

  border-radius: ${rem(12)};
  border-style: solid;
  border-width: ${rem(1)};

  border-color: #d8e0e3;
  background-color: #fff;

  font-weight: 400;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;

  font-size: ${rem(20)};
  line-height: 1.35;

  transition: all 150ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s;

  &:focus {
    border-color: var(--theme-ui-colors-primary, #25273d);
    color: var(--theme-ui-colors-primary, #25273d);
  }
`

const InputUnit = styled.div`
  flex: 0 0 auto;
  font-weight: 400;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;

  font-size: ${rem(20)};
  line-height: 1.55;

  color: #708390;
`

const MaxText = styled.div<Themed<any>>`
  opacity: 0.4;

  font-size: ${rem(14)};
  font-weight: 400;
  padding: ${rem(4)} ${rem(8)};
  margin-left: ${rem(8)};
  margin-right: ${rem(16)};
  margin-top: ${rem(2)};

  border-radius: ${rem(8)};

  background-color: ${(props) => props.theme.colorPairs[0].start};

  transition: all 0.1s ease-in-out;

  color: #fff;

  ${(props) =>
    props.disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        `}
`

export const FigureInput = ({
  max,
  name,
  disabled,
  unit,
  ...props
}: InputProps) => {
  const [value, setValue] = useRecoilState(formInputAtomFamily(name))
  return (
    <Flex
      css={css`
        flex-direction: column;
        /* justify-content: space-between; */
        align-items: flex-start;

        padding-top: ${rem(16)};
      `}
    >
      <InputContainer>
        <NumberInput
          placeholder="0"
          autoFocus={true}
          thousandSeparator={true}
          decimalScale={19}
          allowNegative={false}
          isAllowed={(values) => {
            if (!values.floatValue) {
              return true
            }
            return true
            // return new BigNumber(values.floatValue).lte(max)
          }}
          value={value || ''}
          onChange={(e) => {
            const value = e.target.value
            setValue((value || '').replaceAll(',', ''))
          }}
          disabled={disabled}
          {...props}
        />
        <MaxText
          onClick={
            !disabled
              ? () => {
                  setValue(max.toString())
                }
              : undefined
          }
        >
          MAX
        </MaxText>
        {unit && <InputUnit>{unit}</InputUnit>}
      </InputContainer>
    </Flex>
  )
}

interface ActionLabelProps {
  label: string
  value?: any
  locked?: boolean
}

export const ActionLabel = ({ label, value, locked }: ActionLabelProps) => {
  return (
    <React.Fragment>
      {locked ? (
        <React.Fragment>
          {label}
          <Spacer col size={16} />
          <IconLocked stroke="#fff" />
        </React.Fragment>
      ) : (
        `${label} ${value ? value : ''}`
      )}
    </React.Fragment>
  )
}

const ToggleBorder = styled(Flex)<Themed>`
  flex: 0 0 ${rem(54)};
  width: ${rem(54)};
  height: ${rem(28)};
  padding: ${rem(3)};

  border-radius: ${rem(20)};
  border: ${rem(2)} solid
    ${(props) => transparentize(0.2, props.theme.colorPairs[0].start)};

  align-items: center;

  margin: 0 ${rem(12)};
  cursor: pointer;
`

const ToggleDot = styled.div<Themed>`
  width: ${rem(18)};
  height: ${rem(18)};
  border-radius: ${rem(18)};
  background: ${(props) => transparentize(0.5, props.theme.textColor)};
`

const Toggle = ({ setter, selectedIdx }: any) => {
  return (
    <ToggleBorder
      onClick={() => {
        selectedIdx === 0 ? setter(1) : setter(0)
      }}
      css={css`
        justify-content: ${selectedIdx === 0 ? 'flex-start' : 'flex-end'};
      `}
    >
      <ToggleDot />
    </ToggleBorder>
  )
}

const SwitchLabel = styled(Flex)<any>`
  flex: 1;
  align-items: center;

  font-size: ${rem(13)};
  font-weight: 500;

  color: ${(props) => props.theme.textColor};
  cursor: pointer;

  opacity: 0.2;

  transition: all 0.1s ease-in-out;

  ${(props) =>
    props.selected &&
    css`
      opacity: 0.7;
    `};

  &:hover {
    opacity: 0.7;
  }
`

export const optionStateAtomFamily = atomFamily({
  key: 'FormOptionIndex',
  default: 0,
})

export const TwoWaySwitch = ({ name, options }) => {
  const option0 = options[0]
  const option1 = options[1]
  const [selectedIdx, setSelectedIdx] = useRecoilState(
    optionStateAtomFamily(name),
  )

  return (
    <Flex
      css={css`
        flex: 1;
        width: 100%;
        justify-content: center;
      `}
    >
      <SwitchLabel
        css={css`
          justify-content: flex-end;
        `}
        selected={selectedIdx === 0}
        onClick={() => setSelectedIdx(0)}
      >
        {option0}
      </SwitchLabel>

      <Toggle setter={setSelectedIdx} selectedIdx={selectedIdx} />

      <SwitchLabel
        css={css`
          justify-content: flex-start;
          align-items: center;
        `}
        selected={selectedIdx === 1}
        onClick={() => setSelectedIdx(1)}
      >
        {option1}
      </SwitchLabel>
    </Flex>
  )
}

export const HelpText = styled(Text)`
  opacity: 0.7;

  padding: 0 ${rem(40)};
`
