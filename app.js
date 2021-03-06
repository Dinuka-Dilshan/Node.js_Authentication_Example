require('dotenv').config()
const express = require("express");
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

mongoose.connect(process.env.DB,{ useNewUrlParser: true , useUnifiedTopology: true } );

const usersSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'username cannot empty!']
    },
    password:{
        type:String,
        required:[true,'password cannot empty!']
    }
});

usersSchema.plugin(encrypt,{ secret: process.env.SECRET ,encryptedFields: ['password'] });


const User = new mongoose.model('User',usersSchema);



app.get("/",(req,res)=>{
    res.render('home');
});



app.get("/register",(req,res)=>{
    res.render('register');
});

app.post("/register",(req,res)=>{

    const newUser = new User({
        username:req.body.username,
        password:req.body.password
    })

    newUser.save((error)=>{
        if(error){
            res.send(error);
        }else{
            res.render('secrets');
        }
    })

});



app.get("/login",(req,res)=>{
    res.render('login');
});

app.post('/login',(req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        User.findOne({username:username},(error,foundUser)=>{
            if(error){
                res.send(error);
            }else{
                if(foundUser){
                    if(password === foundUser.password){
                        res.render('secrets');
                    }else{
                        res.send("wrong password");
                    }
                }else{
                    res.send("no user");
                }
                
            }
        });
    }else{
        res.send("empty");
    }


});



app.listen(3000,()=>{
    console.log('server started on port 3000');
});