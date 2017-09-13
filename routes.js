'use strict';

const controller = require('./controllers');

module.exports = function(app) {

    app.route('/')
        .get((req, res) => { res.send('Meditrack : Tracking medications the easy way'); });

    /* ------------------------------------------------------------- */

    // /user(s)
    app.route('/api/users')
        .post(controller.userControls.create);

    app.route('/api/user/:objectId')
        .get(controller.userControls.read)
        .patch(controller.userControls.update)
        .delete(controller.userControls.delete);

    app.route('/api/username/:username')
        .get(controller.userControls.readByName);

    app.route('/api/user/:objectId/bills')
        .get(controller.userControls.bills);

    app.route('/api/user/:objectId/orders')
        .get(controller.userControls.orders);

    app.route('/api/user/:objectId/orders/:timeOfDay')
        .get(controller.userControls.orders_tod);

    /* ------------------------------------------------------------- */

    // /medicine(s)
    app.route('/api/medicines')
        .post(controller.medicineControls.create);

    app.route('/api/medicine/:objectId')
        .get(controller.medicineControls.read)
        .patch(controller.medicineControls.update)
        .delete(controller.medicineControls.delete);

    app.route('/api/medicines/search')
        .get(controller.medicineControls.search);

    /* ------------------------------------------------------------- */

    // /order(s)
    app.route('/api/orders')
        .post(controller.orderControls.create);

    app.route('/api/order/:objectId')
        .get(controller.orderControls.read)
        .patch(controller.orderControls.update)
        .delete(controller.orderControls.delete);

    /* ------------------------------------------------------------- */

    // /bill(s)
    app.route('/api/bills')
        .post(controller.billControls.create);

    app.route('/api/bill/:objectId')
        .get(controller.billControls.read)
        .patch(controller.billControls.update)
        .delete(controller.billControls.delete);

    app.route('/api/bill/:objectId/orders')
        .get(controller.billControls.orders);

    /* ------------------------------------------------------------- */

    app.route('/api/dosagelogs')
        .post(controller.logControls.create);

    app.route('/api/dosagelog/:objectId')
        .get(controller.logControls.read)
        .patch(controller.logControls.update)
        .delete(controller.logControls.delete);

    /* ------------------------------------------------------------- */

};
