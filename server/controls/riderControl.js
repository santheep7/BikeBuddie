const vehicleModel = require('../models/bikemodel');
const riderModel = require('../models/bookride')

const addVehicle = async (req, res) => {
    const userId = req.headers.id
    const {vehicleName, model, regNo,place } = req.body;
    const rcBookImage = req.files.rcBookImage.map(file => file.path);
    const insuranceImage = req.files.insuranceImage.map(file => file.path);
    const licenseImage = req.files.licenseImage.map(file => file.path);
    const vehicleImage = req.files.vehicleImage.map(file => file.path);
    try {
        const newVehicle = new vehicleModel({
            userId,
            vehicleName,
            model,
            regNo,
            rcBookImage,
            insuranceImage,
            licenseImage,
            vehicleImage,
            place
        });
        await newVehicle.save();
        res.status(201).json({ message: 'Vehicle added successfully' });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


const viewVehicle = async (req, res) => {
    const userId = req.headers._id
    console.log(userId)
    try {
        const vehicle = await vehicleModel.find({ userId });
        console.log(vehicle);
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const viewRides = async (req, res) => {
    try {
      const userId = req.headers._id; // Get userId from headers
      console.log(userId)
      // Find all the rides and populate the vehicleId field
      const rides = await riderModel.find({}).populate('vehicleId');
      console.log(rides)
      // Filter the rides to only include those where the userId matches
      const userRides = rides.filter(ride => ride.vehicleId.userId.toString() === userId.toString());
      console.log(userRides)
      if (userRides.length > 0) {
        // Return the filtered rides (bookings)
        res.json(userRides);
      } else {
        // If no matching rides, return an empty array
        res.json([]);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Error fetching rides' });
    }
  };

  const deleteVehicle=async(req,res)=>{
    try{
      const id=req.headers.id
      await vehicleModel.findByIdAndDelete({_id:id})
      res.json("Vehicle Deleted Successfully")
    }
    catch(err){
      console.log(err)
    }
  }
  
  const updateStatus=async(req,res)=>{
    try{
     const {status,id}=req.body
     const booking=await riderModel.findOne({_id:id})
     booking.status=status
     booking.save()
     res.json(`The Ride is ${status} successfully`)
    }catch(err){
      console.log(err)
    }
  }

  const updateVehicle = async (req, res) => {
    try {
      const vehicleId =  req.headers.id; 
    
      if (!vehicleId) {
        return res.status(400).json({ message: "Vehicle ID is required" });
      }
  
      const { vehicleName, model, regNo, place } = req.body;
     console.log(req.body)
      // Initialize the update object
      const updatedVehicleData = {
        vehicleName,
        model,
        regNo,
        place,
      };
  
      // Handle image uploads if files are provided
      if (req.files) {
        if (req.files.vehicleImage) {
          updatedVehicleData.vehicleImage = req.files.vehicleImage.map((file) => file.path);
        }
  
        if (req.files.rcBookImage) {
          updatedVehicleData.rcBookImage = req.files.rcBookImage.map((file) => file.path);
        }
  
        if (req.files.insuranceImage) {
          updatedVehicleData.insuranceImage = req.files.insuranceImage.map((file) => file.path);
        }
  
        if (req.files.licenseImage) {
          updatedVehicleData.licenseImage = req.files.licenseImage.map((file) => file.path);
        }
      }
  
      // Find and update the vehicle document in the database
      const updatedVehicle = await vehicleModel.findByIdAndUpdate(vehicleId, updatedVehicleData, { new: true });
  
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
  
      // Respond with the updated vehicle details
      res.status(200).json(updatedVehicle);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }


  const riderDashboard = async (req, res) => {
    try {
      const id = req.headers.id;
  
      // Find all vehicles owned by this user
      const vehicles = await vehicleModel.find({ userId: id });
  
      // Initialize accumulators for total kilometers, total earnings, and total completed rides
      let totalKilometers = 0;
      let totalEarnings = 0;
      let totalRidesCount = 0;
  
      // Loop through each vehicle to fetch rides and sum distances, fares, and completed rides
      for (const vehicle of vehicles) {
        // Find all rides associated with each vehicle
        const rides = await riderModel.find({ vehicleId: vehicle._id });
  
        // Loop through each ride to calculate total distance, earnings, and completed rides count
        rides.forEach(ride => {
          // If totalDistance exists, add it to totalKilometers
          if (ride.totalDistance ) {
            totalKilometers += ride.totalDistance;
          }
  
          // If the ride is completed, add to the total rides count
          if (ride.status === "Completed") {
            totalRidesCount += 1;
  
            // If there's a fare, add it to totalEarnings
            if (ride.fare) {
              totalEarnings += ride.fare;
            }
          }
        });
      }
  
      // Send the results back to the client
      res.status(200).json({
        totalKilometers,
        totalEarnings,
        totalRidesCount
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while fetching rider dashboard data' });
    }
  };

  const viewRating = async (req, res) => {
    try {
      const id = req.headers.id; // Get the userId from the request headers
      // Fetch vehicles associated with the userId
      const vehicles = await vehicleModel.find({ userId: id });
  
      if (!vehicles || vehicles.length === 0) {
        return res.status(404).json({ message: 'No vehicles found for this user.' });
      }
      const vehicleIds = vehicles.map(vehicle => vehicle._id); 
      const rides = await riderModel.find({ vehicleId: { $in: vehicleIds }, status: 'Completed' });
      console.log(rides);
      res.json(rides); 
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  


module.exports = { addVehicle,viewVehicle,viewRides,updateStatus,deleteVehicle,updateVehicle,riderDashboard,viewRating};