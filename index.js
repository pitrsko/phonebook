var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser')
var path = require('path');
var fs = require('fs');
const { v4: uuidv4 } = require('uuid');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.json());
app.use(express.urlencoded({extended : false}));

var zoznam = [
    {
    name: "Peter Hrnciar",
    phone: "0910504214",
    id: uuidv4()
    },
    {
    name: "Dezider Ursiny",
    phone: "0910504214",
    id: uuidv4()
    },
    {
    name: "Jozef Cajka",
    phone: "09587589",
    id: uuidv4() 
    }

];

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// Static folder
app.use(express.static(path.join(__dirname, '/public')));
//Server start
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port')), function() {
    console.log('Server started at port: '+app.get('port'));
    loadFromJSON();
}


///Save To JSON function
function saveToJSON() {
    zoznamJSON = JSON.stringify(zoznam);
    fs.writeFile(path.join(__dirname, 'JSON', 'zoznam.json'), zoznamJSON, function(err)  {
        if (err) {console.log(err);
        }
        console.log(zoznamJSON);
        console.log('JSON sucessfully saved');
})};



//Load from JSON function
function loadFromJSON() {
   fs.readFile(path.join(__dirname, 'JSON', 'zoznam.json'), 'utf8', function(err,data){
        if (err) {console.log(err)};
        zoznam = JSON.parse(data);
        console.log('JSON loaded succesfuly');

    })
}
loadFromJSON();


// Routes - home
app.get('/', (req, res) => {
    res.render('index', {zoznam: zoznam});
});


// Add number
app.get('/add', (req, res) => {
    res.render('add', {zoznam: zoznam})
});


//Add number POST
app.post('/add', urlencodedParser, (req, res) => {
    var nove = {name: req.body.name, phone: req.body.number, id: uuidv4()};
    zoznam.push(nove);
    res.render('add-success', {data: req.body, zoznam:zoznam});
    saveToJSON();
    
  })

// Delete user
app.get('/delete/:id',  (req, res) => {
    const toBeDeleted = zoznam.filter(member => member.id == req.params.id);
    zoznam = zoznam.filter(member => member.id !== req.params.id);
    res.render('delete', {name: toBeDeleted[0].name, phone:toBeDeleted[0].phone, zoznam: zoznam});
    saveToJSON();
   
});

//Delete All Users
app.get('/deleteall',  (req, res) => {
    zoznam = [];
    res.render('index', {zoznam: zoznam});
    saveToJSON();

   
});

//Edit user

app.get('/edit/:id',  (req, res) => {
    const toBeEdited = zoznam.filter(member => member.id == req.params.id);
    res.render('edit', {edituj: toBeEdited, zoznam:zoznam});
});

//Saved edited number
app.post('/edit/:id', urlencodedParser, (req, res) => {
    const editID = req.params.id;
    const editDATA = {name: req.body.name, phone: req.body.phone};
    zoznam.forEach(function(item){
        if (editID == item.id) {
            item.name = editDATA.name;
            item.phone = editDATA.phone;
        }
    });
    res.render('edit-success', {zoznam:zoznam, editDATA: editDATA});
    saveToJSON();

});

//GET JSON FILE
app.get('/JSON/zoznam.json', (req,res) => {
    res.json(zoznam);
});


//Alphabetical sorting
var toggle = true;
app.get('/sort', (req,res) => {
    if (toggle == true){
      toggle = false;
      zoznam.sort(function(a, b){
        if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
        if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
        return 0;
        })}
    else {
      toggle = true;
      zoznam.sort(function(a, b){
        if(a.name.toLowerCase() < b.name.toLowerCase()) { return 1; }
        if(a.name.toLowerCase() > b.name.toLowerCase()) { return -1; }
        return 0;
        })
    }
    res.render('index', {zoznam: zoznam, toggle: toggle})
});


//Autocomplete
// var namesOnly = [];
// zoznam.forEach(item => {
//     namesOnly.push([item.name]); 
// });
// console.log(namesOnly);
// var acArray = [];
// var acData = {data:{}};
// namesOnly.forEach(res => {
//   acArray.push(res.join())
// })

// acArray.forEach(acObj => {
//   acData.data[acObj] = null;
// })
// console.log(acData);
// console.log(zoznam);

// jsonData = {data : {acData}};
// //jsonData = JSON.stringify(acData);
// console.log(acData);
// function zapis() {
// fs.writeFile(path.join(__dirname, 'JSON', 'autocomplete.json'), jsonData, function(err) {
//     if (err) {
//         console.log(err);
//     }
// });
// };
// zapis();
