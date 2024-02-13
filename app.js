const express=require('express');
const Joi =require("joi");
const dotenv=require("dotenv");

dotenv.config();
const app=express();
app.use(express.json());

const genres = [
    { id: 1, name: 'Action' },  
    { id: 1, name: 'Zimba' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },  
  ];
  
app.get('/movies',(req, res)=>{
    if(JSON.parse(req.query.sortAsc)){
        genres.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
    }
    res.send(genres);
})

app.get('/api/movies/:id',(req, res)=>{
    const id=req.params.id;
    const movie=genres.find(c=>c.id===parseInt(id));

    if(!movie){
        return res.status(404).send('The genre with the given ID was not found.');
    }
    return res.send(movie);
})
app.put('/api/movies/:id',(req, res)=>{
    const id=req.params.id;
    let movie=genres.find(c=>c.id===parseInt(id));
    if(!movie){
        return res.status(404).send('The genre with the given ID was not found.');
    }
    const schema={
        name:Joi.string().min(3).required()
    }
    const {error}=Joi.validate(req.body, schema);
    if(error){
        return res.send(error.details[0].message);
    }
    movie.name=req.body.name;
    res.send(movie);
})
app.post('/api/movies',(req, res)=>{
    const schema={
        name:Joi.string().min(3).required()
    }
    const {error}=Joi.validate(req.body, schema);
    if(error){
        return res.send(error.details[0].message);
    }
    const movie={
        id:genres.length+1,
        name:req.body.name,
    }
    genres.push(movie);
    res.send(movie);
})

app.delete('/api/movies/:id',(req, res)=>{
    const id=req.params.id;
    let movie=genres.find(c=>c.id===parseInt(id));
    if(!movie){
        return res.status(404).send('The genre with the given ID was not found.');
    }
    const index=genres.indexOf(movie);
    genres.splice(index, 1);
    res.send(movie);
})
const port=process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`The app is running at port ${port}`);
})