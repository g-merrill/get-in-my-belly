const User = require('../models/user');
const Truck = require('../models/truck');
const Review = require('../models/review');

module.exports = {
    show,
    editTrucksPage,
    consoleLogAllData,
    clearThemAll,
    seedData
}

function show(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .populate('trucks')
        .populate('reviews')
        .then(user => {
            console.log(user);
            res.render('users/show', {
                user,
                viewName: 'users#show'
            });
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks');
        });
    } else {
        res.render('users/show', {
            user: undefined,
            viewName: 'users#show'
        });
    }
}

function editTrucksPage(req, res) {
    Truck.findById(req.params.id)
    .then(truck => res.render('trucks/edit', {
        user: req.user,
        viewName: 'trucks#edit',
        truck
    }))
    .catch(err => {
        if (err) console.log(err);
        res.redirect(`/trucks/${req.params.id}`);
    });
}

function consoleLogAllData(req, res) {
    User.find({})
    .then(users => {
        console.log('///////////////////// USERS ///////////////////////////');
        console.log(users);
        return Truck.find({});
    })
    .then(trucks => {
        console.log('///////////////////// TRUCKS ///////////////////////////');
        console.log(trucks);
        return Review.find({});
    })
    .then(reviews => {
        console.log('///////////////////// REVIEWS ///////////////////////////');
        console.log(reviews);
        res.redirect('/users/profile');
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/users/profile');
    })
}

function clearThemAll(req, res) {
    User.findById(req.user.id)
    .then(user => {
        user.trucks = [];
        user.reviews = [];
        return user.save();
    })
    .then(() => Truck.deleteMany({}))
    .then(() => Review.deleteMany({}))
    .then(() => res.redirect('/users/profile'))
    .catch(err => {
        if (err) console.log(err);
        return res.send('Error with clearing data from user array');
    });
}

function seedData(req, res) {
    User.findById(req.user.id)
    .then(user => {
        user.trucks = [];
        user.reviews = [];
        return user.save();
    })
    .then(() => Truck.deleteMany({}))
    .then(() => Review.deleteMany({}, err => {if(err) console.log(err)}));
    const seedFile = require('../config/seed');
    seedFile.runSeedFunction(req, res);
}