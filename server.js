let portf=require('./config.json');
var PORT=process.env.PORT||portf.port||8083;
var express = require('express');
var app = express();
const path = require('path');
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
const request = require('request');
const cron = require('node-cron');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// console.log(__dirname)
app.set('views', path.join(__dirname, 'views')); 
 
app.use(cookieParser())
const axios = require('axios');
const low = require('lowdb');
app.set('view engine', 'ejs');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');
// const { get } = require('request');
const adapter = new FileSync(__dirname+'/db.json');
const db = low(adapter);
db.defaults({ posts: [], user: []})
  .write();
function checkToken (req, res, next) {
//get authcookie from request
    const authcookie = req.cookies.authcookie
//verify token which is in cookie value
    jwt.verify(authcookie,"demoapi",(err,data)=>{
    if(err){
     res.redirect("login")
    } 
    else if(data.user){
      req.user = data.user
      next()
    }
})};

// let test=db.get('posts')
//       .find({ "apikey": "b386257b-31cd-43d7-b89a-c23b45aa5cb6" }).get('data').find({id:id})
//       .assign(rq)
//       .write();
      // let test=db.get('posts')
      // .find({ "apikey": "b386257b-31cd-43d7-b89a-c23b45aa5cb6" }).get("usem").value();  
      // console.log(test) 
      // let update=db.get('posts')
      // .find({ "apikey": "b386257b-31cd-43d7-b89a-c23b45aa5cb6" }).get("usem").get('2020').assign({ "1A": '41000'})
      // .write();  
      // console.log(update[1]) 
      function getalldt(){
        console.log("runing")
        return db.get('posts').value();
      }
    var dataall=getalldt();
    function getvl(k){
      for(x in dataall){
        if(dataall[x]['apikey']==k){
          return dataall[x];
        }
      }
    }
    cron.schedule('0 0 * * *', function() {
      db.get('posts')
      .assign(dataall)
      .write()
    });
    // function intervalFunc() {
    //   console.log('Cant stop me now!');
    // }
    
    // setInterval(intervalFunc, 1500);
var sumrq=0;

app.get('/', function (req, res) {
  let timen = Date.now();
  let api_key=req.query.api_key;
  const url=req.query.url;
  let keep_headers=req.query.keep_headers;
  let headers="";
  let limitu=2097152;
  if(keep_headers){
    header=sreq.headers;
  }
  // console.log(api_key)
  // let testapi=db.get('posts')
  // .find({ "apikey": api_key })
  // .value()
  let testapi=getvl(api_key)
  
  // if(typeof testapi.tt=="undefined"){
  //   testapi.test=timen;
  //   testapi.tt=0;
  // }
  
  const todaysDate = new Date();

  // if(api_key==api_key){
  //   sumrq=sumrq+1;
  // }
  // console.log(sumrq)
  // console.log(timen)
  let year=todaysDate.getFullYear();
  let month=todaysDate.getMonth()+'A';
  // console.log(month)
  // console.log(testapi)
  if(typeof testapi!="undefined" && typeof url!="undefined" ){
  if(typeof testapi.test!="undefined" && timen-testapi.test<10000){
    testapi.tt=testapi.tt+1;
    if(testapi.tt>2){
      // testapi.rfalse=rfalse+1;
      return res.status(403).send("Limited concurrent requirements")
    }
  }else{
    testapi.test=timen;
    testapi.tt=0;
  }
    let use=parseInt(testapi.use);
    let rfalse=parseInt(testapi.rfalse);
    let limitm=parseInt(testapi.limitm);
    if(testapi.limitu){
      limitu=Number(testapi.limitu)*1048576;
    }
    // let chky=db.get('posts')
    // .find({ "apikey": api_key }).get("usem").get(year).value();
    // console.log(chky)
    let chky=testapi["usem"][year];
    if(typeof chky=="undefined"){
      let usemn={
        [year]:{"0A":0,"1A":0,"2A":0,"3A":0,"4A":0,"5A":0,"6A":0,"7A":0,"8A":0,"9A":0,"10A":0,"11A":0}
     }
      db.get('posts')
      .find({ "apikey": api_key }).get("usem").assign(usemn)
      .write();  
    }
    let usem=Number(testapi.usem[year][month]);
    let amount={[month]:usem+1};
    if(usem<limitm){
        var opts = {
          method: 'GET',
          uri: url,
          timeout:20000,
          headers:headers
       };
// const URL = 'http://old-releases.ubuntu.com/releases/16.04.3/ubuntu-16.04-desktop-amd64.iso';
let total_bytes_read = 0;
// console.log(opts)
  let data='';
  try {
    var test=request
    .get(opts)
    .on('error', function (error) {
      testapi.rfalse=rfalse+1;
        //TODO: error handling
        // console.error('ERROR::', error.code);
        if(error.code=="ETIMEDOUT"){
          return res.status(500).send('Internal Server Error')
        }
        if(error.code=="ENOTFOUND"){
          return res.status(404).send('Error 404 Not Found')
        }
    })
    .on('response', function (response) {
        response.on('data', function (chunk) {
          data+=chunk;
            //compressed data
            // console.log('Recived chunck:' + chunk.length, ': Total downloaded:', total_bytes_read)
            total_bytes_read += chunk.length;
            if (total_bytes_read >= limitu) {
                //TODO: handle exceeds max size event
                // console.error("Request as it exceds max size:")
                test.abort();
                // console.log(data)
            }
            // console.log("...");
        });
    })
    .on('end', function () {
      testapi.use= use+1;
      // db.get('posts')
      // .find({ "apikey": api_key })
      // .assign({"use":use+1})
      // .write();
      testapi.usem[year][month]= usem+1;
      //                   let test=db.get('posts')
      // .find({ "apikey": api_key }).get("usem").get(year).assign(amount)
      // .write();  
      return res.send(data);
        // console.log(data)
        // console.log('Request completed! Total size downloaded:', total_bytes_read)
        });
      } catch (error) {
        return res.status(404).send('Error 404 Not Found')
      }
    
    }else{
      testapi.rfalse=rfalse+1;
      return res.status(403).send('Limited!');
    }
  }else{
    return res.status(401).send('Unauthorized request, please make sure your API key is valid.');
  }
});
app.post('/', function (req, res) {
  let timen = Date.now();
  let api_key=req.query.api_key;
  const url=req.query.url;
  let keep_headers=req.query.keep_headers;
  let form=req.body;
  let headers="";
  let limitu=2097152;
  if(keep_headers){
    header=sreq.headers;
  }
  // console.log(api_key)
  // let testapi=db.get('posts')
  // .find({ "apikey": api_key })
  // .value()
  let testapi=getvl(api_key)
  
  // if(typeof testapi.tt=="undefined"){
  //   testapi.test=timen;
  //   testapi.tt=0;
  // }
  
  const todaysDate = new Date();

  // if(api_key==api_key){
  //   sumrq=sumrq+1;
  // }
  // console.log(sumrq)
  // console.log(timen)
  let year=todaysDate.getFullYear();
  let month=todaysDate.getMonth()+'A';
  // console.log(month)
  // console.log(testapi)
  if(typeof testapi!="undefined" && typeof url!="undefined" ){
  if(typeof testapi.test!="undefined" && timen-testapi.test<10000){
    testapi.tt=testapi.tt+1;
    if(testapi.tt>2){
      // testapi.rfalse=rfalse+1;
      return res.status(403).send("Limited concurrent requirements")
    }
  }else{
    testapi.test=timen;
    testapi.tt=0;
  }
    let use=parseInt(testapi.use);
    let rfalse=parseInt(testapi.rfalse);
    let limitm=parseInt(testapi.limitm);
    if(testapi.limitu){
      limitu=Number(testapi.limitu)*1048576;
    }
    // let chky=db.get('posts')
    // .find({ "apikey": api_key }).get("usem").get(year).value();
    // console.log(chky)
    let chky=testapi["usem"][year];
    if(typeof chky=="undefined"){
      let usemn={
        [year]:{"0A":0,"1A":0,"2A":0,"3A":0,"4A":0,"5A":0,"6A":0,"7A":0,"8A":0,"9A":0,"10A":0,"11A":0}
     }
      db.get('posts')
      .find({ "apikey": api_key }).get("usem").assign(usemn)
      .write();  
    }
    let usem=Number(testapi.usem[year][month]);
    let amount={[month]:usem+1};
    if(usem<limitm){
        var opts = {
          method: 'GET',
          uri: url,
          timeout:20000,
          headers:headers,
          form:form
       };
// const URL = 'http://old-releases.ubuntu.com/releases/16.04.3/ubuntu-16.04-desktop-amd64.iso';
let total_bytes_read = 0;
// console.log(opts)
  let data='';
  try {
    var test=request
    .post(opts)
    .on('error', function (error) {
      testapi.rfalse=rfalse+1;
        //TODO: error handling
        // console.error('ERROR::', error.code);
        if(error.code=="ETIMEDOUT"){
          return res.status(500).send('Internal Server Error')
        }
        if(error.code=="ENOTFOUND"){
          return res.status(404).send('Error 404 Not Found')
        }
    })
    .on('response', function (response) {
        response.on('data', function (chunk) {
          data+=chunk;
            //compressed data
            // console.log('Recived chunck:' + chunk.length, ': Total downloaded:', total_bytes_read)
            total_bytes_read += chunk.length;
            if (total_bytes_read >= limitu) {
                //TODO: handle exceeds max size event
                // console.error("Request as it exceds max size:")
                test.abort();
                // console.log(data)
            }
            // console.log("...");
        });
    })
    .on('end', function () {
      testapi.use= use+1;
      // db.get('posts')
      // .find({ "apikey": api_key })
      // .assign({"use":use+1})
      // .write();
      testapi.usem[year][month]= usem+1;
      //                   let test=db.get('posts')
      // .find({ "apikey": api_key }).get("usem").get(year).assign(amount)
      // .write();  
      return res.send(data);
        // console.log(data)
        // console.log('Request completed! Total size downloaded:', total_bytes_read)
        });
      } catch (error) {
        return res.status(404).send('Error 404 Not Found')
      }
    
    }else{
      testapi.rfalse=rfalse+1;
      return res.status(403).send('Limited!');
    }
  }else{
    return res.status(401).send('Unauthorized request, please make sure your API key is valid.');
  }
});
app.get('/account', function(req, res) {
  let timen = Date.now();
  let api_key=req.query.api_key;
  let testapi=getvl(api_key);
  if(typeof testapi.test!="undefined" && timen-testapi.test<3000){
    testapi.tt=testapi.tt+1;
  }else{
    testapi.test=timen;
    testapi.tt=0;
  }
  let rfasle=parseInt(testapi.rfalse);
  let rcount=parseInt(testapi.use);
  let rlimit=parseInt(testapi.limitm);
  let rc=(typeof testapi.tt!="undefined")?parseInt(testapi.tt):0
  if(testapi){
    return res.json({"concurrencyLimit":5,"concurrentRequests":rc,"failedRequestCount":rfasle,"requestCount":rcount,"requestLimit":rlimit})
  }else{
    return res.status(403).json({error: "Unauthorized request. Please check your credentials and try again."
  });
  }
});
app.get('/register', function(req, res) {
    let error=[];
    res.render('register',{error});
});
app.get('/abc', function(req, res) {
    console.log(req.headers)
    res.json("success")
});
app.get('/password', function(req, res) {
  let error=[];
  res.render('password',{error});
});
app.post('/password', async function(req, res) {
  let error=[];
    let isPasswordMatch=false;
   
    let ifus=db.get('user').find({username: req.body["username"]}).value();
    if(typeof ifus !="undefined"){
      isPasswordMatch = await bcrypt.compare(req.body["oldpass"], ifus.password)
    }else{
      error.push('Username exists!');
      rser()
    }
    if(!isPasswordMatch){
      error.push('Wrong old password!')
      rser()
    }
    if(req.body["newpass"]!=req.body["newpasss"]){
      error.push("The new password doesn't match!");
      rser()
    }
    function rser(){
      res.render('password',{error});
    }
    let pws=await bcrypt.hash(req.body["newpass"], 8)
    let username=req.body["username"];
    if(error.length==0){
      db.get('user')
      .find({'username':username})
      .assign({'password':pws})
      .write();
      res.cookie('authcookie',"token",{maxAge:0,httpOnly:true}) 
      res.redirect("login")
    }
});
app.post('/register', async function(req, res) {
    let error=[];
    let pws=await bcrypt.hash(req.body["psw"], 8)
    let username=req.body["username"];

    let ttus = db
    .get('user')
    .find({ username: username })
    .value();
    if(typeof ttus=="undefined"){
      let user={
        "username":username,
        "password":pws
      }
      db.get('user')
      .push(user)
      .write();
      res.redirect('login');
    }else{
      error.push("Username exists!");
      res.render('register',{error});
    }
  });

app.get('/login', function(req, res) {
    let error=[];
    res.render('login',{error});
});
app.post('/login',async function(req, res) {
    let error=[];
    let isPasswordMatch=false;
    let ifus=db.get('user').find({username: req.body["username"]}).value();
    if(typeof ifus !="undefined"){
      isPasswordMatch = await bcrypt.compare(req.body["psw"], ifus.password)
    }
    let username = req.body.username;
    if(isPasswordMatch){
      const token = jwt.sign({user:username},'demoapi')
      //save token in cookie
      res.cookie('authcookie',token,{maxAge:86400000,httpOnly:true}) 
      res.redirect("manage")
    }else{
      error.push("Username or password is incorrect !")
      res.render("login",{error})
    }
  });
  app.get('/user/:us', function (req, res) {
    let us=req.params.us;
    let resu= db.get('user')
    .remove({username:us})
    .write()
    if(resu.length>0){
      res.json("success")
    }else{
      res.json("no success")
    }
   });
  
   
   
  app.all('*', checkToken);
app.post('/api/insert',function(req,res){
  let dt=req.body;
  db.get('posts').push(dt)
.write();
res.json({"status":"success"})
});
app.put('/api/update/:id',function(req,res){
  let id=req.params.id;
  let dt=req.body;
  let apikey={"apikey":id};
  db.get('posts')
  .find(apikey)
  .assign(dt)
  .write();
res.json({"status":"success"})
});
app.delete('/api/delete/:id',function(req,res){
  let id=req.params.id;
  db.get('posts')
    .remove({apikey:id})
    .write()
res.json({"status":"success"})
});
app.get('/logout', function (req, res) {
    res.cookie('authcookie',"token",{maxAge:0,httpOnly:true}) 
    res.redirect("login")
});
app.get('/manage' ,function(req, res) {
    // console.log(req)
    let dtall=db.get('posts').value();
    let user=req.user;
    const todaysDate = new Date();
    let year=todaysDate.getFullYear();
    let month=todaysDate.getMonth()+'A';
    // let usem=dtall[year][month];
    res.render('manage',{dtall,user,year,month});
});
// var http = require('http');
// var server=http.createServer(app).listen(PORT, function (req,res) {
//   var host = server.address().address
//   var port = server.address().port
//   console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port)
// });
// console.log(server)
var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port)
  });

