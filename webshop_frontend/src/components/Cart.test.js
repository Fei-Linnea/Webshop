import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Cart from './Cart'

test('renders empty cart message when no items are present', () => {
  render(<Cart cartItems={[]} user={{ id: '67adf2c77c674e41a1ac186a', token: 'token' }} />)
  expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument()
})

test('renders items in the cart', () => {
  const cartItems = [
    { productId: { 
        id: '67adf2c77c674e41a1ac1871', 
        name: 'Laptop', 
        brand: 'Lenovo', 
        price: 1200, 
        description: 'High-performance laptop', 
        stock: 10, 
        category: 'Electronics',
    }, quantity: 1 },
    { productId: {
        id: '67adf2c77c674e41a1ac1873',
        name: 'Headphones', 
        brand: 'Sony', 
        price: 150, 
        description: 'Noise-cancelling headphones', 
        stock: 20, 
        category: 'Electronics'
    }, quantity: 2 }
  ]

  render(<Cart cartItems={cartItems} user={{ id: '67adf2c77c674e41a1ac186a', token: 'token' }}/>)

  expect(screen.getByText(/Laptop/)).toBeInTheDocument()
  expect(screen.getByText(/Headphones/)).toBeInTheDocument()
  expect(screen.getByText(/Total: 1500 €/)).toBeInTheDocument()
})

test('calls removeItem when clicking remove button', async () => {
  const removeItemMock = jest.fn()
  const user = userEvent.setup()
  const cartItems = [{ 
    productId: { 
        id: '67adf2c77c674e41a1ac1871', 
        name: 'Laptop', 
        brand: 'Lenovo', 
        price: 1200, 
        stock: 10, 
        category: 'Electronics' 
    }, quantity: 1 }]

  render(<Cart cartItems={cartItems} removeItem={removeItemMock} updateQuantity={jest.fn()} 
  user={{ id: '67adf2c77c674e41a1ac186a', token: 'token' }} />)

  const removeButton = screen.getByText(/Remove/)
  await user.click(removeButton)

  expect(removeItemMock).toHaveBeenCalledTimes(1)
})