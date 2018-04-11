var express=require("express")
var bodyParser=require("body-parser")
var expressSanitizer=require("express-sanitizer")
 var methodOverride=require("method-override")
var app=express()
// mongoose.connect("mongodb://localhost/blog")
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer());
app.use(methodOverride("_method"))
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/blog");
var blogShema = new mongoose.Schema({
  title:String,
     image:String,
     body:String,
     created:{type:Date,default:Date.now}
})
var Blog=mongoose.model("Blog",blogShema)



app.get("/",function(req,res){
  res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log("You got an error");
    }
    else {
      res.render("index",{blogs:blogs})

    }
  })
})
app.get("/blogs/new",function(req,res){
  res.render("new")
})
app.post("/blogs",function(req,res){
  req.body.blog.body=req.sanitize(req.body.blog.body)
  Blog.create(req.body.blog,function(err,newBlog){
    if(err){
      res.redirect("/blogs/new");
    }
    else {
      res.redirect("/blogs")
    }
  })
})


app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    }
    else {
      res.render("show",{blog:foundBlog});
    }
  })
})


app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,update){
    if(err){
      res.redirect("/blogs")
    }
    else {
      res.render("edit",{blog:update});
    }
  })
})


app.put("/blogs/:id",function(req,res){
  req.body.blog.body=req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updaate){
    if(err){
      res.redirect("/blogs/"+req.params.id);

    }
    else {
      res.redirect("/blogs/"+req.params.id);
    }
  })
})

app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/blogs")
    }
    else {
      res.redirect("/blogs")

    }
  })
})

app.listen(3000,function(){
  console.log("server is ready for connection");
})
