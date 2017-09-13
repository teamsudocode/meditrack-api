'use strict';


const mongoose = require('mongoose'),
      models = require('./models'),

      User = mongoose.model('Users'),
      Medicine = mongoose.model('Medicines'),
      Order = mongoose.model('Orders'),
      Bill = mongoose.model('Bills'),
      DosageLog = mongoose.model('DosageLogs');


// defining genericCRUD for basic operations

const genericCRUD = {
    read: function (model) {
        return function(req, res) {
            model.findById(req.params.objectId, function(err, object) {
                if (err) res.status(500).json(err);

                if (object === null)
                    res.status(404).json({message: 'Not found'});
                else
                    res.json(object);
            });
        };
    },

    create: function (model) {
        return function(req, res) {
            const newObject = new model(req.body);
            newObject.save(function(err, object) {
                if (err)
                    res.status(500).json(err);
                else
                    res.json(object);
            });
        };
    },

    update: function (model) {
        return function (req, res) {
            model.findOneAndUpdate(
                {_id: req.params.objectId},
                req.body,
                {new: true},
                function(err, object) {
                    if (err)
                        res.status(500).json(err);
                    else
                        res.json(object);
                });
        };
    },

    delete: function (model) {
        return function(req, res) {
            return model.remove({
                _id: req.params.objectId
            }, function(err, object) {
                if (err)
                    res.status(500).json(err);
                else
                    res.json({message: 'Successfully deleted'});
            });
        };
    }
};


const medicine__search = function(req, res) {
    let q = req.query.q;

    if (q === undefined) {
        res.status(401).json({message: 'Query string missing'});
    // } else if (q.length < 3) {
    //     res.status(401).json({message: 'At least 3 characters required'});
    } else {
        Medicine.find(
            {name: {$regex: q, $options: 'i'}},
            function(err, object) {
                if (err) res.status(500).json(err);

                if (object === null)
                    res.status(404).json({message: 'Not found'});
                else
                    res.json(object);
            });
    }
};


const user__bills = function(req, res) {
    let query = {
        $or: [{patient: req.params.objectId}, {chemist: req.params.objectId}]
    };
    if (req.query.rebooked == 'true') {
        query['rebooked'] = true;
    } else if (req.query.rebooked == 'false') {
        query['rebooked'] = false;
    }
    Bill.find(query, function(err, object) {
        if (err)
            res.status(500).json(err);
        else
            res.json(object);
    });
};


const user__orders = function(req, res) {
    Bill.find(
        {$or: [ {patient: req.params.objectId}, {chemist: req.params.objectId} ]},
        function(err, bills) {
            if (err)
                res.status(500).json(err);
            else {
                let orders = new Array();

                let billIds = [];
                for (let i = 0; i < bills.length; i++) {
                    billIds.push(bills[i]._id);
                }

                Order
                    .find({bill: {$in: billIds}, available: {$gt: 0}})
                    .populate('medicine')
                    .exec()
                    .then((result) => {
                        res.json(result);
                    });
            }
        }
    );
};


const user__orders_tod = function(req, res) {
    const tod_map = {
        morning: [1, 2, 3, 4],
        noon: [2, 3, 4],
        evening: [4],
        night: [2, 3, 4]
    };

    Bill.find(
        {$or: [ {patient: req.params.objectId}, {chemist: req.params.objectId} ]},
        function(err, bills) {
            if (err)
                res.status(500).json(err);
            else {
                let orders = new Array();

                let billIds = [];
                for (let i = 0; i < bills.length; i++) {
                    billIds.push(bills[i]._id);
                }

                Order
                    .find(
                        {
                            bill: {$in: billIds},
                            dosage: {$in: tod_map[req.params.timeOfDay]},
                            available: {$gt: 0}
                        }
                    )
                    .populate('medicine')
                    .exec()
                    .then((result) => {
                        res.json(result);
                    });
            }
        }
    );
};



const user__read_by_name = function(req, res) {
    let q = req.params.username;

    if (q === undefined)
        res.status(400).json({message: 'Missing query parameter'});
    else {
        User.findOne({username: q}, function(err, result) {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(result);
        });
    }
};


const bill__orders = function(req, res) {
    Order.find({bill: req.params.objectId}, function(err, result) {
        if (err)
            res.statu(500).json(err);
        else
            res.status(200).json(result);
    });
};


const log__create = function(req, res) {
    let _ts = new Date(req.body.date);
    console.log(_ts);
    let start_date = new Date(Date.UTC(_ts.getFullYear(), _ts.getMonth(), _ts.getDate()));
    let end_date   = new Date(Date.UTC(_ts.getFullYear(), _ts.getMonth(), _ts.getDate()+1));

    DosageLog.find(
        {order: req.body.order, date: {$gte: start_date, $lte: end_date}},
        function(err, result) {
            if (err)
                res.status(500).send(err);
            else {
                if (result.length > 0) {
                    res.status(401).json({message: 'Entry already available for this date', log: result});
                } else {
                    genericCRUD.create(DosageLog)(req, res);
                }
            }
        }
    );
};


const do_not_delete = function(req, res) {
    res.status(405).json({message: 'This method is not allowed on this resource'});
};



// mapping controls
const userControls = {
    create: genericCRUD.create(User),
    read  : genericCRUD.read  (User),
    update: genericCRUD.update(User),
    delete: do_not_delete,

    bills : user__bills,
    orders: user__orders,
    orders_tod: user__orders_tod,
    readByName: user__read_by_name
};


const orderControls = {
    create: genericCRUD.create(Order),
    read  : genericCRUD.read  (Order),
    update: genericCRUD.update(Order),
    delete: genericCRUD.delete(Order)
};


const billControls = {
    create: genericCRUD.create(Bill),
    read  : genericCRUD.read  (Bill),
    update: genericCRUD.update(Bill),
    delete: genericCRUD.delete(Bill),

    orders: bill__orders
};


const medicineControls = {
    create: genericCRUD.create(Medicine),
    read  : genericCRUD.read  (Medicine),
    update: genericCRUD.update(Medicine),
    delete: genericCRUD.delete(Medicine),

    search: medicine__search
};


const logControls = {
    // create: genericCRUD.create(DosageLog),
    create: log__create,
    read:   genericCRUD.read(DosageLog),
    update: genericCRUD.update(DosageLog),
    delete: genericCRUD.delete(DosageLog)
};


module.exports = {
    userControls,
    orderControls,
    medicineControls,
    billControls,
    logControls
};
