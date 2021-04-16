var express = require("express");
var app = express(),
  path = require("path"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  cors = require("cors"),
  https = require("https"),
  config = require("./server/config.server"),
  nunjucks = require("nunjucks"),
  multer = require("multer");

console.log("url", config.serverUrl);

require("./server/models");
app.set("views", path.join(__dirname, "server/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

const routes = require("./server/routes");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(process.env.PWD, "public")));

// app.use(express.static(__dirname + "/uploads"));
app.use("/uploads", express.static("uploads"));

// Allow CORS
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["X-Requested-With", "content-type", "Authorization"],
    credentials: true,
  })
);

nunjucks.configure("server/views", {
  autoescape: true,
  express: app,
});

const fixtures = require("./server/fixtures");
fixtures.userFixture.fixtureUser();

app.use("/", routes.users);


app.get("/", function (err, res) {
  res.send("Hello There");
});

app.listen(3001, () => {
  console.log("server started on 3000");
});
