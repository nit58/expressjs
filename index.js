const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
const courses = [{id: 1, name: 'Physics'}, {id: 2, name: 'Maths'}];
const port = process.env.port || 8090;
/**
 * Basic CRUD operations like GET. POST, PUT and DELETE
 */
app.get('/', (req, res) => {
    res.send('Hello, in the world of APIs.');
    res.end();
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
    res.end();
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course requested for the id was not found!');
    res.send(course);
    res.end();
});

app.post('/api/courses', (req, res) => {
    const validationResult = validateCourse(req.body);
    if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course requested for the id was not found!');
    const result = validateCourse(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);
    course.name = req.body.name;
    res.send(course);
});
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course requested for the id was not found!');
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
});


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
};


app.listen(port, () => {console.log(`App started at port number ${port}.`)});
