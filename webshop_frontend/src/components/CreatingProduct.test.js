import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import CreatingProduct from './CreatingProduct'

test('<CreatingProduct /> updates parent state and calls createProduct', async () => {
  const createProductMock = jest.fn()
  const user = userEvent.setup()

  render(<CreatingProduct createProduct={createProductMock} />)

  const nameInput = screen.getByLabelText(/Name:/)
  const brandInput = screen.getByLabelText(/Brand:/)
  const descriptionInput = screen.getByLabelText(/Description:/)
  const priceInput = screen.getByLabelText(/Price \(€\):/)
  const imageInput = screen.getByLabelText(/Image URL:/)
  const stockInput = screen.getByLabelText(/Stock:/)
  const categoryInput = screen.getByLabelText(/Category:/)
  const submitButton = screen.getByText(/Add product/)

  await user.type(nameInput, 'New Product')
  await user.type(brandInput, 'Brand X')
  await user.type(descriptionInput, 'Amazing new product')
  await user.type(priceInput, '200')
  await user.type(stockInput, '10')
  await user.type(categoryInput, 'Gadgets')

  await user.click(submitButton)

  expect(createProductMock).toHaveBeenCalledTimes(1)
  expect(createProductMock.mock.calls[0][0]).toEqual({
    name: 'New Product',
    brand: 'Brand X',
    description: 'Amazing new product',
    price: 200,
    image: '',
    stock: 10,
    category: 'Gadgets',
  })
})
