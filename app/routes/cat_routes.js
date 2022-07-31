// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for cats
const Cat = require('../models/cat')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

//index
router.get('/cats', (req,res,next) =>{
    Cat.find()
    //find cats
        .then((cats) => {
            return cats.map((cat) => cat.toObject())
        })
    //respond with status
        .then((cats) => res.status(200).json({cats: cats}))
    //if error, pass
        .catch(next)

})

//show
router.get('/cats/:id', (req,res,next) =>{
    Cat.findById(req.params.id)
    //in case 404
    .then(handle404)
    .then((cat) => res.status(200).json({cat: cat.toObject() }))
    //if error, pass
    .catch(next)
})

//POST
router.post('/cats', (req,res,next) => {
    Cat.create(req.body.cat)
    .then((cat) => {
        res.status(201).json({cat: cat.toObject()})
    })
    .catch(next)
})

//UPDATE
router.patch('/cats/:id', removeBlanks, (req,res,next) =>{
    //if the client attempts to change the 'owner' propety by including a new owner, prevent that
    delete req.body.cat.owner

    Cat.findById(req.params.id)
        .then(handle404)
        .then((cat) => {
            return cat.updateOne(req.body.cat)
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

//DESTROY
router.delete('/cats/:id', (req,res,next) => {
    Cat.findById(req.params.id)
    .then(handle404)
    .then((cat) => {
        cat.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
