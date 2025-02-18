import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import UpdatingProduct from './UpdatingProduct'

test('<UpdatingProduct /> updates parent state and calls updateProduct', async () => {
  const updateProductMock = jest.fn()
  const user = userEvent.setup()

  render(<UpdatingProduct product={{ id: 'p1' }} updateProduct={updateProductMock} />)

  const nameInput = screen.getByLabelText(/Name:/)
  const brandInput = screen.getByLabelText(/Brand:/)
  const descriptionInput = screen.getByLabelText(/Description:/)
  const priceInput = screen.getByLabelText(/Price/)
  const stockInput = screen.getByLabelText(/Stock:/)
  const categoryInput = screen.getByLabelText(/Category:/)
  const submitButton = screen.getByText(/Update product/)

  await user.type(nameInput, 'Updated Product')
  await user.type(brandInput, 'Brand B')
  await user.type(descriptionInput, 'Updated description')
  await user.type(priceInput, '100')
  await user.type(stockInput, '5')
  await user.type(categoryInput, 'Tech')

  await user.click(submitButton)

  expect(updateProductMock).toHaveBeenCalledTimes(1)
  expect(updateProductMock.mock.calls[0][1]).toEqual({
    name: 'Updated Product',
    brand: 'Brand B',
    description: 'Updated description',
    price: 100,
    image: '',
    stock: 5,
    category: 'Tech',
  })
})
