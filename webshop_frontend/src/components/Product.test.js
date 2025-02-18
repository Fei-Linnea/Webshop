import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Product from './Product'

test('renders product details correctly', () => {
  const product = {
    id: '000111',
    name: 'Sample Product',
    brand: 'Brand A',
    description: 'A great product',
    price: 50,
    stock: 10,
    category: 'Electronics',
    image: '',
  }

  render(<Product product={product} />)

  expect(screen.getByText(/Sample Product/)).toBeInTheDocument()
  expect(screen.getByText(/Brand A/)).toBeInTheDocument()
  expect(screen.getByText(/A great product/)).toBeInTheDocument()
  expect(screen.getByText(/50 €/)).toBeInTheDocument()
  expect(screen.getByText(/10 kpl/)).toBeInTheDocument()
  expect(screen.getByText(/Electronics/)).toBeInTheDocument()
})
