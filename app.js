require("./connection/connection");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
const morgan = require('morgan');
app.use(morgan('dev'));
const path = require("path");
app.use(express.static(path.join(__dirname, "./public")));
const adminrouter = require("./Admin/router/admin_login");
const userrouter = require("./Client/router/client_login");
const productrouter = require("./Client/router/product");
app.use(adminrouter);
app.use(userrouter);
app.use(productrouter);

app.listen(port, () => {
  console.log(`App runing on ${port}`);
});
