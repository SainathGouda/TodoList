//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();
const port = 3000 || process.env.PORT;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));



mongoose.connect("mongodb+srv://gh0st:sainath1234@cluster0.xettocq.mongodb.net/todolistDB", {

        useNewUrlParser: true});

    const itemSchema = new mongoose.Schema({

      name: String

    });

    const listSchema = new mongoose.Schema({
      name : String,
      items : [itemSchema]
    });

    const Item = mongoose.model("Item", itemSchema);

    const List = mongoose.model("List", listSchema);

    const item1 = new Item({

      name: "welcome to your todolist"

    });

    const item2 = new Item({

      name: "hit the + button to add new item"

    });



    const item3 = new Item ({

      name: "<--- hit this to delete an item"

    });



    const defaultItems = [item1, item2, item3];


    // Item.insertMany(defaultItems, function(err){

    //   if (err) {

    //     console.log(err);

    //   }else {

    //     console.log("Sucessfully saved default items into DB.");

    //   }

    // });



app.get("/", function(req, res) {

  Item.find({}, function (err, docs) {
    //res.render("list", {listTitle: "Today", newListItems: docs});
    if(docs.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        }else {
          console.log("Sucessfully saved default items into DB.");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: docs});
    }
  });

});

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;

  List.findOne({name : customListName}, function(err,foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name : customListName,
          items : defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }
      else{
        res.render("list", {listTitle: customListName, newListItems: foundList.items});
      }
    }
  });
});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name : itemName
  });

  if(listName === 'Today'){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name : listName},function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }
  

});

app.post("/delete", function(req,res){
  const isCheckedId = req.body.checkbox;

  Item.findByIdAndRemove(isCheckedId, function(err){
    if(!err){
      console.log("Successfull");
      res.redirect("/");
    }
    else{
      console.log(err);
    }
  });
});

app.get("/work", function(req, res) {

  res.render("list", {listTitle: "Work List", newListItems: workItems});

});



app.get("/about", function(req, res){

  res.render("about");

});



app.listen(port, function() {

  console.log("Server started on port 3000.");

});
