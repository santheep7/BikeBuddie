const express=require('express');
const adminRouter=express.Router();
const {viewUsers,viewRiders,verifyRider,deleteUser, countDetails, viewRides, update, fetchMessage}=require('../controls/adminControl');

adminRouter.route('/viewusers').get(viewUsers);
adminRouter.route('/viewriders').get(viewRiders);
adminRouter.route('/verifyrider/:id').put(verifyRider);
adminRouter.route('/deleteuser/:id').delete(deleteUser);
adminRouter.route('/viewCount').get(countDetails)
adminRouter.route('/viewrides').get(viewRides)
adminRouter.route('/viewreviews').get(viewRides)
adminRouter.route('/review').put(update)
adminRouter.route('/viewmessage').get(fetchMessage)

module.exports=adminRouter;