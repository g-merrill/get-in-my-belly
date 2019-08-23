const Truck = require('../models/truck');

module.exports = {
    index,
    new: newTruck,
    create
};

function index(req, res) {
    Truck.find({})
    .then(trucks => {
        res.render('index', {
            user: req.user,
            viewName: 'trucks#index',
            trucks
        });
    })
    .catch(err => {
        if (err) console.log(err);
        return res.send('Error setting up page');
    });
}

function newTruck(req, res) {
    res.render('new', {
        user: req.user,
        viewName: 'trucks#new'
    });
}

function create(req, res) {
    console.log(req.body);
    Truck.create(req.body)
    .then(truck => truck.save())
    .then(() => res.redirect('/'))
    .catch(err => {
        if (err) console.log(err);
        return res.redirect('/new');
    });
}