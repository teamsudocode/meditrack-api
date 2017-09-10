'use strict';

const controller = require('./controllers');

module.exports = function(app) {

    // /user(s)
    app.route('/users')
        .post(controller.userControls.create);

    app.route('/user/:objectId')
        .get(controller.userControls.read)
        .patch(controller.userControls.update)
        .delete(controller.userControls.delete);

    app.route('/username/:username')
        .get(controller.userControls.readByName);

    app.route('/user/:objectId/bills')
        .get(controller.userControls.bills);

    app.route('/user/:objectId/orders')
        .get(controller.userControls.orders);


    // /medicine(s)
    app.route('/medicines')
        .post(controller.medicineControls.create);

    app.route('/medicine/:objectId')
        .get(controller.medicineControls.read);

    app.route('/medicines/search')
        .get(controller.medicineControls.search);


    // /order(s)
    app.route('/orders')
        .post(controller.orderControls.create);

    app.route('/order/:objectId')
        .get(controller.orderControls.read)
        .patch(controller.orderControls.update);


    // /bill(s)
    app.route('/bills')
        .post(controller.billControls.create);

    app.route('/bill/:objectId')
        .get(controller.billControls.read)
        .patch(controller.billControls.update);

    app.route('/bill/:objectId/orders')
        .get(controller.billControls.orders);

};
