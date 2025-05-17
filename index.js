
const express = require("express");  //imported express
const app = express();   //created our server
const {DBConnection}=require("./database/db"); //imported
const User=require("./model/User"); //imported
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

app.use(express.json());

DBConnection(); //called

app.get("/", (req,res) => {   
    res.send("Hello, world!");
});  //making request. get request: expcting nothing from your frontend, its just sending you some response

app.post("/register", async (req,res) => {   //post needs input from frontend
  try {
    // get all the data from the frontend
  const {firstname, lastname, email, password} = req.body;
  
  //check that all the data should exists
  if(!(firstname && lastname && email && password)){  // whether user has provided with the information or not
    return res.status(400).send("Please enter all the information");
  }

  //check if the user aready exists
  const existingUser= await User.findOne({email});
  if(existingUser){
    return res.status(400).send("User already exists with the same email");
  }

  //hashing/encrypt the password
  const hashedPassword= await bcrypt.hash(password,10);

  //save user in the db
  const user= await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  

  //generate a token for user and send it 
  const token= jwt.sign({id: user._id, email}, process.env.SECRET_KEY,{
    expiresIn: '1h',
  })
  user.token=token;
  user.password=undefined;
  res.status(200).json({message: 'You have successfully registered!', user});
    
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}!`);
});

