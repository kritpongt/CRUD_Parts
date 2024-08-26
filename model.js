const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/db_part').then(function(){
    console.log('MongoDB connected')
}).catch(function(err){
    console.log('MongoDB connection error: ' + err)
})

const partSchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    hp: { type: Number, default: 0 },
    str: { type: Number, default: 0 },
    tec: { type: Number, default: 0 },
    wlk: { type: Number, default: 0 },
    fly: { type: Number, default: 0 },
    tgh: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    special: { type: Array }
})

const typeSchema = new mongoose.Schema({
    name: { type: String, required: true },
})
const Type = mongoose.model('Type', typeSchema)
Type.countDocuments().then(function(count){
    if(count === 0){
        const typeData = [
            { name: 'HP' },
            { name: 'STR' },
            { name: 'TEC' },
            { name: 'WLK' },
            { name: 'FLY' },
            { name: 'TGH' },
            { name: 'Other' },
            { name: 'Main' },
            { name: 'Sub' }
        ]
        Type.insertMany(typeData).catch(function(err){
            console.log(`insertMany() error: ${err}`)
        })
    }
})

module.exports = {
    Part: mongoose.model('Part', partSchema),
    Type: Type
}