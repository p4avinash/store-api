require("dotenv").config()

const connectDB = require("./db/connect")
const Product = require("./models/product")

const productList = require("./products.json")

const start = async () => {
  try {
    await connectDB(process.env.CONNECTION_URL)
    await Product.deleteMany()
    await Product.create(productList)
    console.log("Seeding to Database Successful..!!")
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
