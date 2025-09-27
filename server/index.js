const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { user, tasks } = require('./model');
require('dotenv').config();
const jwt = require('jsonwebtoken');
// const jwtkey="surajit@2001";

const app = express();
app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use(express.json());

const authenticate = (req, res, next) => {
    let token=req.headers['authorization'];
    console.log("recove.............", token)
    // next();
    if(token){
        
        jwt.verify(token,process.env.jwt,(err,item)=>{
            if(err){
                res.status(201).json({err,msg:'Token Expire.'})
               
                console.log("Token Expire......",err)
            }else{
                console.log("middle ware called   ",token)
                console.log("ites",item)
                req.user = item;
                next();
            }
        })
    }else{
        res.status(201).json({result:'please add token your header'})
    }
    };



app.post("/sign-up", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const exists = await user.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const newUser = new user({ name, email, password });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id, username: newUser.name }, process.env.jwt, { expiresIn: '1d' });
        return res.status(200).json({ token, msg: "Sign Up Successfully", user: newUser });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const exists = await user.findOne({ email });
        if (!exists) {
            return res.status(400).json({ error: "Email do not exists" });
        }
        if (exists.password == password) {
            const token = jwt.sign({ id: exists._id, username: exists.name }, process.env.jwt, { expiresIn: '1d' });
            return res.status(200).json({ token, msg: "Sign In Successfully", user: exists });
        }
    } catch (error) {
        console.error("SignIn Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/add-task', async (req, res) => {
    try {
        const { name, starttime, endtime, description, user_id } = req.body;
        console.log(name);
        const data = new tasks({ name, starttime, endtime, description, user_id });
        await data.save();
        return res.status(200).json({ data: data, msg: 'Save All Details...' });
    } catch (error) {
        res.status(500).json({ error, msg: 'Not Submit' });
    }
})


app.get('/get-work',authenticate,async(req,res)=>{
    const data=await tasks.find({user_id:req.user.id});
   if(data){
     return res.status(200).json(data);
   }else{
    return res.status(400).json({msg:'No Record...'});
   }
})


app.delete('/delete/:id', async(req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const dlt =await tasks.findOneAndDelete({ _id: id }); 
        console.log(dlt)
        if (dlt) {
            return res.json({ msg: "Deleted", deletedTask: dlt });

        } else {
            return res.status(404).json({ msg: 'Not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error });
    }
});

app.post('/status-update',async(req,res)=>{
    try {
        const {id,status}=req.body;
        console.log(id,status)
        const updatedTask = await tasks.findByIdAndUpdate(id, { status }, { new: true });
        if (updatedTask) {
            return res.status(200).json({ msg: 'Status updated', updatedTask });
        } else {
            return res.status(404).json({ msg: 'Task not found' });
        }   
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error });
    }   
});































mongoose.connect(process.env.mongoURL)
    .then(() => {
        app.listen(process.env.PORT,"0.0.0.0", () => {
            console.log('server is running on port', process.env.PORT)
        })
    })
    .catch(err => {
        console.error('Database connection error:', err)
    })

