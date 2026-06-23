import Product from "../models/productModel.js";
import { connectDB } from "../lib/db.js";

const batch = 5000;
const totalProducts = 200000;
const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys', 'Sports', 'Beauty', 'Automotive', 'Garden', 'Health'];


const seedProducts = async () => {
    await connectDB();

    // delete existing products
    await Product.deleteMany({});
    console.log("Existing products deleted");

    const products = [];
    for (let i = 1; i <= totalProducts; i++) {
        products.push({
            name: `Product ${i}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            price: Math.floor(Math.random() * 10000) + 100,
        });

        if (products.length === batch){
            await Product.insertMany(products);
            console.log(`Inserted ${i} products`);
            products.length = 0;
        }
    }

    if (products.length > 0) {
        await Product.insertMany(products);
    }

}

seedProducts()
    .then(() => {
        console.log('All products seeded successfully');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error seeding products:', err);
        process.exit(1);
    });