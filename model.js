const mongoose = require('mongoose')
const fs = require('fs')
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

partSchema.statics.fetchDataByKeyword = function(where, page = 1, limit = 5){
    return this.aggregate([
        {
            $facet: {
                pagination: [
                    {
                        $match: {
                            $or: [
                                { type: { $regex: where, $options: 'i' } },
                                { name: { $regex: where, $options: 'i' } }
                            ]
                        }
                    },
                    { $count: 'totalCount' },
                    { $addFields: { page: { $literal: page }, limit: { $literal: limit } } }
                ],
                data: [
                    {
                        $match: {
                            $or: [
                                { type: { $regex: where, $options: 'i' } },
                                { name: { $regex: where, $options: 'i' } }
                            ]
                        }
                    },
                    { $project: { type: 1, name: 1, hp: 1, str: 1, tec: 1, wlk: 1, fly: 1, tgh: 1, cost: 1 } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit }
                ]
            }
        },
        {
            $addFields: {
                'data': {
                    $map: {
                        input: { $range: [0, { $size: "$data" }] },
                        as: "index",
                        in: {
                            $mergeObjects: [
                                { $arrayElemAt: ["$data", "$$index"] },
                                { no: { $add: [ { $multiply: [ (page - 1), limit ] }, { $add: ["$$index", 1] } ] } }
                            ]
                        }
                    }
                }
            }
        }
    ])
}
const Part = mongoose.model('Part', partSchema)
const data = JSON.parse(fs.readFileSync('./init_db/parts.json', 'utf-8'))
Part.countDocuments().then(function(count){
    if(count === 0 && data){
        Part.insertMany(data).catch(function(err){
            console.log(`Error occurred during insertMany() operation in "Part" collection: ${err}`)
        })
    }
})

const typeSchema = new mongoose.Schema({ name: { type: String, required: true } },
    {
        statics: {
            fetchAll(){
                return this.find().exec()
            }
        }
    }
)
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
            console.log(`Error occurred during insertMany() operation in "Type" collection: ${err}`)
        })
    }
})

module.exports = {
    Part: Part,
    Type: Type
}