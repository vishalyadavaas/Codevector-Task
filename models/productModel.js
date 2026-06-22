import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, index: true},
    category: {type: String, required: true, index: true},
    price: {type: Number, required: true},
}, {timestamps: true});

productSchema.index({
    category: 1,
    _id: -1
})

const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product
