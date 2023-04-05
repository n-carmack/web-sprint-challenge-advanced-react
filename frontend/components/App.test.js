import React from 'react'

import AppFunctional from './AppFunctional'

import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

test('header renders', () => {
  render(<AppFunctional />)

  const coordinates = screen.queryByText(/coordinates/i)
  const upButton = screen.queryByText(/up/i)
  const rightButton = screen.queryByText(/right/i)
  const downButton = screen.queryByText(/down/i)
  const leftButton = screen.queryByText(/left/i)
  const resetButton = screen.queryByText(/reset/i)

  expect(coordinates).toBeInTheDocument()

  expect(upButton).toBeInTheDocument()
  expect(rightButton).toBeInTheDocument()
  expect(downButton).toBeInTheDocument()
  expect(leftButton).toBeInTheDocument()
 
  expect(resetButton).toBeInTheDocument()
})

test('typing in input results in text entered', () => {
  render(<AppFunctional />)

  const inputBox = screen.getByRole('textbox', {id:'email'})

  expect(inputBox)
    .toBeInTheDocument()
  fireEvent.change(inputBox, { target: {value: 'testing input'}})
  expect(inputBox)
    .toHaveValue('testing input')
})