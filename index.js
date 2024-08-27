const express = require('express')
const ejs = require('ejs')
const ejsLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const db_part = require('./model')
const helper = require('./helper')

const app = express()
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.set('layout', './layouts/main')
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async function(request, response){
    let where = request.query.keyword || '';
    let fetch = await db_part.Part.fetchDataByKeyword(where)
    response.render('index', { helper: helper, keyword: where, data: fetch })
})

app.all('/add', async function(request, response){
    let data = await db_part.Type.fetchAll()
    if(!request.body.name){
        response.render('add', { helper: helper, type: data })
    }else{
        let form = request.body
        let ins = {
            type: form.type || '',
            name: form.name || '',
            hp: form.hp || 0,
            str: form.str || 0,
            tec: form.tec || 0,
            wlk: form.wlk || 0,
            fly: form.fly || 0,
            tgh: form.tgh || 0,
            cost: form.cost || 0,
            special: form.special || []
        }
        db_part.Part.create(ins).then(function(){
            response.render('add', { helper: helper, type: data, message: 'Item added' })
        }).catch(function(err){
            // response.send(err)
            response.render('add', { helper: helper, type: data, message: err })
        })
    }
})

app.get('/edit', async function(request, response){
    let where = request.query.keyword || '';
    let fetch = await db_part.Part.fetchDataByKeyword(where)
    response.render('edit', { keyword: where, data: fetch })
})

app.get('/edit/:id', function(request, response){
    let id = request.params.id || ''
    if(id == ''){
    }
})

app.post('/edit-multi', function(request, response){

})

// app.all('/edit-part', function(request, response){

// })

app.listen(3000, function(){
    console.log('Server is started, on port: 3000')
})