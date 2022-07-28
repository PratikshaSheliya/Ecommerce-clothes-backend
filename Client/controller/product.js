const product = require("../modules/product");
const wishlist = require("../modules/wish_list");
const cart = require("../modules/cart");
const userProfile = require("../modules/client_login");
const fs = require("fs");
const path = require("path");
const e = require("express");

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
        console.log("if req.files");
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

//all products
exports.getAllProducts = async (req, res) => {
  try {
    const category_product = req.query.category;
    const collection_product = req.query.collection;
    const newIn_Product = req.query.newin;
    const allProducts = await product.find();
    const cat_Products = await product.find({ category: category_product });
    const collection_Products = await product.find({
      product_collection: collection_product,
    });

    var myCurrentDate = new Date();
    var myPastDate = new Date(myCurrentDate);
    myPastDate.setDate(myPastDate.getDate() - 5);

    myCurrentDate = myCurrentDate.toISOString().split("T")[0];
    myPastDate = myPastDate.toISOString().split("T")[0];

    const newInProduct = await product.find({
      date: { $gte: myPastDate, $lte: myCurrentDate },
    });

    if (req.query.category) {
      res.status(200).send({
        success: true,
        data: cat_Products,
        length: cat_Products.length,
      });
    } else if (req.query.collection) {
      res.status(200).send({
        success: true,
        data: collection_Products,
        length: collection_Products.length,
      });
    } else if (req.query.newin) {
      res.status(200).send({
        success: true,
        data: newInProduct,
        length: newInProduct.length,
      });
    } else {
      res
        .status(200)
        .send({ success: true, data: allProducts, length: allProducts.length });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error });
    console.log("error", error);
  }
};

//add wishlist
exports.addWishList = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    const userFindId = await wishlist.findOne({ user_id });
    const productFindId = await wishlist.findOne({ product_id });

    let ProductId = [];
    if (userFindId) {
      if (!productFindId) {
        const updateResult = await wishlist.findByIdAndUpdate(userFindId, {
          $push: { product_id: product_id },
        });
        res.status(200).send({
          success: true,
          data: updateResult,
          msg: "Successfully Add this Product to your wishlist",
        });
      } else {
        res.status(200).send({
          success: false,
          msg: "already added this product to wish list",
        });
      }
    } else {
      ProductId.push(product_id);
      const wishlistData = new wishlist({
        user_id,
        product_id: ProductId,
      });
      const result = await wishlistData.save();
      res.status(200).send({
        success: true,
        data: result,
        msg: "Successfully Add this Product to your wishlist",
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error });
    console.log("error=>", error);
  }
};

//get wishlist data
exports.getWishList = async (req, res) => {
  try {
    const user_id = req.userdata.userId;
    const getProductId = await wishlist.find({ user_id });
    console.log("getProductId[0].product_id ", getProductId[0].product_id);
    const filter = { _id: { $in: getProductId[0].product_id } };
    let result = product
      .find()
      .where(filter)
      .then((resp) => {
        console.log("res", resp);
        res.status(200).send({ success: true, data: resp });
      })
      .catch((err) => {
        res.send({ success: false, err: err, statusCode: 400 });
        console.log("err", err);
      });
    // let product_array = []
    // if (getProductId) {
    //   const products = getProductId[0].product_id;
    //   for (let i = 0; i < products.length; i++) {
    //     const element = products[i];
    //     const wishListData = await product.find({ _id: element }).lean().exec();
    //     product_array[i] = wishListData
    //   }
    //   // console.log("product_array",product_array);
    // }
  } catch (error) {
    res.status(400).send({ success: false, error: error });
    console.log("error", error);
  }
};

//remove wishlist
exports.deleteWishList = async (req, res) => {
  try {
    const user_id = req.userdata.userId;
    const { product_id } = req.body;
    console.log("productid", product_id);
    const userFindId = await wishlist.findOne({ user_id });
    const result = await wishlist
      .findByIdAndUpdate(userFindId, { $pull: { product_id: product_id } })
      .lean()
      .exec();
    res.send({ data: result, success: true });
  } catch (error) {
    res.send({ error: error, success: false });
  }
};

//add to cart
exports.addCart = async (req, res) => {
  try {
    const { product_id, user_id } = req.body;
    // let user_id = req.userdata.userId;
    const userId = await cart.findOne({ user_id });

    const productId = await cart.findOne({ user_id: user_id }).select({
      user_id: user_id,
      cart_details: { $elemMatch: { product_id: product_id } },
    });
    console.log("product_id", product_id);
    console.log("productId", productId);

    if (userId) {
      if (productId.cart_details.length != 0) {
        const updateQuantity = await cart.updateOne(
          { user_id: user_id, "cart_details.product_id": product_id },
          {
            $set: {
              "cart_details.$.quantity": productId.cart_details[0].quantity + 1,
            },
          },
          {
            new: true,
          }
        );

        console.log("updateQuantity", updateQuantity);
        res.send({ msg: "Quantity", updateQuantity: updateQuantity });
        // res.send({ msg: " ++ qunatity"  });
      } else {
        const updateResult = await cart
          .findByIdAndUpdate(userId, {
            $push: { cart_details: { product_id: product_id, quantity: 1 } },
          })
          .lean()
          .exec();
        console.log("updateResult", updateResult);

        res.send({
          success: true,
          data: updateResult,
          msg: "Successfully Add this Product to your cart",
        });
      }
    } else {
      const cartData = new cart({
        user_id: user_id,
        cart_details: {
          product_id: product_id,
          quantity: 1,
        },
      });
      const result = await cartData.save();
      res.status(200).send({
        success: true,
        data: result,
        msg: "Successfully Add this Product to your cart ===>",
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error });
    console.log("error=>", error);
  }
};

//get cart data
exports.getCart = async (req, res) => {
  try {
    const userId = req.userdata.userId;
    const matchUserId = await cart.find({ user_id: userId });
    let productArr = [];
    let quantityArr = [];
    for (let i = 0; i < matchUserId[0].cart_details.length; i++) {
      const element = matchUserId[0].cart_details[i];
      // console.log("element",element);
      productArr.push(element.product_id);
      quantityArr.push({
        product_id: element.product_id,
        quantity: element.quantity,
      });
    }

    const filter = { _id: { $in: productArr } };
    let result = product
      .find()
      .where(filter)
      .then((resp) => {
        let finalRes = [];
        for (let i = 0; i < resp.length; i++) {
          const element = resp[i];
          const ans = Object.assign(
            { cart_quantity: quantityArr[i].quantity },
            element._doc
          );
          finalRes.push(ans);
        }
        res.status(200).send({ success: true, data: finalRes });
      })
      .catch((err) => {
        res.send({ success: false, err: err, statusCode: 400 });
        console.log("err", err);
      });
  } catch (error) {
    res.send({ success: false, error: error });
    console.log("error => ", error);
  }
};

//remove cart data
exports.deleteCart = async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.userdata.userId;

  const productId = await cart.findOne({ user_id: user_id }).select({
    user_id: user_id,
    cart_details: { $elemMatch: { product_id: product_id } },
  });

  if (productId.cart_details[0].quantity != 1) {
    const updateQuantity = await cart.updateOne(
      { user_id: user_id, "cart_details.product_id": product_id },
      {
        $set: {
          "cart_details.$.quantity": productId.cart_details[0].quantity - 1,
        },
      },
      {
        new: true,
      }
    );
    res.send({ msg: "-1 quantity", data: updateQuantity });
  } else {
    const deleteProduct = await cart.findOneAndUpdate(
      { user_id: user_id },
      {
        $pull: {
          cart_details: {
            product_id: product_id,
          },
        },
      },
      {
        new: true,
      }
    );
    res.send({ msg: "delete", data: deleteProduct });
  }
};
