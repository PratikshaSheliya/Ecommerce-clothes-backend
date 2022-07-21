const product = require("../modules/product");
const fs = require("fs");
const path = require("path");

//Add Product
exports.AddProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      size,
      description,
      material,
      care,
      modelHeight,
      modelSize,
      quantity,
      category,
      color,
      date,
      discount,
      product_collection,
    } = req.body;

    let images = [];
    // console.log("req.body", req.body);
    // console.log("req.files", req.files);
    if (req.files) {
      for (let i = 0; i < req.files.images.length; i++) {
        const x = req.files.images[i];
        images.push({ name: x.filename });
      }
    }
    const code = Math.random().toString(36).substring(2, 10);
    const ProductData = new product({
      name,
      price,
      size,
      description,
      material,
      care,
      modelHeight,
      modelSize,
      quantity,
      category,
      color,
      date,
      discount,
      product_collection,
      code,
      images,
    });
    const result = await ProductData.save();
    res.status(200).send({
      success: true,
      msg: "Product add Successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).send({ error: error });
    console.log("error==>", error);
  }
};

//show products
exports.showProduct = async (req, res) => {
  try {
    const result = await (await product.find().lean().exec()).reverse();
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

//delete product
exports.DeleteProduct = async (req, res) => {
  try {
    const { _id } = req.query;
    console.log("_id", _id);
    const result = await product.findByIdAndDelete({ _id });
    res
      .status(200)
      .send({ success: true, msg: "Delete Successfully", data: result });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
};

//single get product
exports.GetOneProduct = async (req, res) => {
  try {
    const { _id } = req.params.id;
    const result = await product.findById({ _id: req.params.id }).lean().exec();
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
};

//DeleteImages
exports.DeleteImages = async (req, res) => {
  try {
    const p_id = req.query.pid;
    const i_id = req.query.iid;
    const image = await product
      .find({ images: { $elemMatch: { _id: i_id } } }, { "images.$": 1 })
      .lean()
      .exec();
    const image_name = image[0]?.images[0]?.name;
    if (image) {
      const result = await product
        .findByIdAndUpdate({ _id: p_id }, { $pull: { images: { _id: i_id } } })
        .lean()
        .exec();

      fs.unlink(
        path.resolve("./public/product_images/" + image_name),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("\nDeleted file: " + image_name);
          }
        }
      );
      res
        .status(200)
        .send({ success: true, msg: "delete successfully", data: image });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error });
    console.log("error", error);
  }
};

//update Product data
exports.UpdateProduct = async (req, res) => {
  try {
    const {
      product_id,
      name,
      price,
      size,
      description,
      material,
      care,
      modelHeight,
      modelSize,
      quantity,
      category,
      color,
      date,
      discount,
      product_collection,
    } = req.body;
    const found_id = await product.findById({ _id: product_id }).lean().exec();
    if (found_id) {
      // console.log("id",found_id);
      let result;
      const UpdateData = {
        name,
        price,
        size,
        description,
        material,
        care,
        modelHeight,
        modelSize,
        quantity,
        category,
        color,
        date,
        discount,
        product_collection,
      };

      result = await product
        .findByIdAndUpdate(found_id, UpdateData)
        .lean()
        .exec();

      if (req.files.images) {
        console.log('if req.files');
        for (let i = 0; i < req.files.images.length; i++) {
          const x = req.files.images[i];
          result = await product
            .findByIdAndUpdate(found_id, {
              $push: { images: { name: x.filename } },
            })
            .lean()
            .exec();
        }
      } 
      res.status(200).send({ success: true, data: result });
    }
  } catch (error) {
    res.status(400).send({ error: error });
    console.log("error", error);
  }
};
