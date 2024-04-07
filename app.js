//async errors
require("express-async-errors")

require("dotenv").config()
const connectDB = require("./db/connect")
const productsRoute = require("./routes/products")

const express = require("express")
const app = express()

const notFoundMiddleware = require("./middleware/not-found")
const errorMiddleware = require("./middleware/error-handler")

//middleware
app.use(express.json())

//routes
app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>products</a>")
})
app.use("/api/v1/products", productsRoute)

//products route
app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    //connect to DB
    await connectDB(process.env.CONNECTION_URL)
    app.listen(port, () => console.log(`Server is listening on port: ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
