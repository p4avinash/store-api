const Product = require("../models/product")

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price")
  res.status(200).json({ message: products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query

  const queryObject = {}

  if (featured) {
    queryObject.featured = featured === "true" ? true : false
  }

  if (company) {
    queryObject.company = company
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" }
  }

  //numeric filters (price, rating)
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    }
    const regEx = /\b(<|<=|=|>|>=)\b/g
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )

    const options = ["price", "rating"]
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-")

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })

    console.log(numericFilters, filters)
  }

  let result = Product.find(queryObject)

  //sort products
  if (sort) {
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  } else {
    result = result.sort("createdAt")
  }

  //select fields
  if (fields) {
    const fieldList = fields.split(",").join(" ")
    result = result.select(fieldList)
  }

  console.log(queryObject)

  let page = Number(req.query.page) || 1
  let limit = Number(req.query.limit) || 10
  let skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const products = await result.find(queryObject)
  res
    .status(200)
    .json({ products: products, nbHits: products.length, message: "success" })
}

module.exports = { getAllProducts, getAllProductsStatic }
