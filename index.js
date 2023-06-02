const express=require('express')
const expressLayouts=require('express-ejs-layouts')
const dynamicResume=require('./docs/dynamic-resume')
const pdf=require('html-pdf')
const app=express()
const bodyParser = require("body-parser");
//Set up middleware
app.set('view engine','ejs')// The view engine is responsible for rendering dynamic views/templates in Express. By setting the view 
// engine, we are telling Express which templating engine to use for rendering our views.

//Set Request Size Limit
app.use(bodyParser({limit: '50mb'}));

app.use(expressLayouts); //render layout.ejs 
app.use(express.json()) // parses json 
app.use(express.urlencoded({extended: false})) // parses url encoded values
app.use(express.static('public')) //to display static files
const options={
    "height": "6.28in",        // allowed units: mm, cm, in, px
    "width": "4.9in",            // allowed units: mm, cm, in, px
}
app.get('/',(req,res,next)=>{ //by default get is used
    res.render('home');
})
app.get('/about',(req,res,next)=>{
    res.render('about')
})
app.get('/resume-maker/about',(req,res,next)=>{
    res.render('about')
})
app.get('/resume-maker/:theme',(req,res,next)=>{ //get is basically used to render a inage/pdf/webpage/file,etc(in other words routing)
    // console.log("theme: ",req.params.theme)
    theme1=req.params.theme;
    switch(req.params.theme){
        case '1':
            res.render('resume-maker',{theme2:"blue"})
            break;
        case '2':
            res.render('resume-maker',{theme2:"green"})
            break;
        default:
            res.render('resume-maker',{theme2:'green'})
            break;
    }
    // res.render('resume-maker',{theme2:req.params.theme})
})
app.post('/resume-maker',(req,res,next)=>{ //using post we can send data and also route that is performed by get
    // console.log(req.body)
    //LOWERCASE-> REMOVE SPACE-> SHORT NAME
    const userName=req.body.name;
    const lowercaseName=userName.toLowerCase();
    const noSpaceName=lowercaseName.replace(' ','');
    const shortName=noSpaceName.slice(0,10)
    let themeOptions={
        leftTextColor:"rgb(91, 88, 255)",
        leftBackgroundColor:"rgb(12, 36, 58)",
        wholeBodyColor:"rgb(183, 182, 255)",
        rightTextColor:"rgb(12, 36, 58)"
    }
    if(req.body.theme=='blue'){
        themeOptions={
            leftTextColor:"rgb(91, 88, 255)",
            leftBackgroundColor:"rgb(12, 36, 58)",
            wholeBodyColor:"rgb(183, 182, 255)",
            rightTextColor:"rgb(12, 36, 58)"
        }
        //HTML to pdf converter
    pdf.create(dynamicResume(req.body,themeOptions),options).toFile(__dirname+'/docs/' +shortName+'-resume.pdf',(error, response)=>{
        if(error) throw Error("Pdf is not created")
        // console.log(response.filename);
        res.sendFile(response.filename)
      });

    }else if(req.body.theme=='green'){
        themeOptions={
            leftTextColor:"rgb(183, 217, 255)",
            leftBackgroundColor:"rgb(0, 119, 89)",
            wholeBodyColor:"rgb(139, 247, 205)",
            rightTextColor:"rgb(0,119,89)"
        }
        //HTML to pdf converter
    pdf.create(dynamicResume(req.body,themeOptions),options).toFile(__dirname+'/docs/' +shortName+'-resume.pdf',(error, response)=>{
        if(error) throw Error("Pdf is not created")
        // console.log(response.filename);
        res.sendFile(response.filename)
      });
    }
    else{
        //HTML to pdf converter
    pdf.create(dynamicResume(req.body,themeOptions),options).toFile(__dirname+'/docs/' +shortName+'-resume.pdf',(error, response)=>{
        if(error) throw Error("Pdf is not created")
        // console.log(response.filename);
        res.sendFile(response.filename)
      });
    }
})
const port=process.env.PORT || 4000
app.listen(port,()=>console.log('Server is running on: '+port))