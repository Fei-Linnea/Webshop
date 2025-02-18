const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema ({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', required: true 
    },
    products: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product',
          required: true
        },
        quantity: { 
          type: Number, 
          required: true, 
          default: 1 
          },
        _id: false
      },
    ],
  }, { timestamps: true, versionKey: false })


  cartSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })
  
  module.exports = mongoose.model('Cart', cartSchema)