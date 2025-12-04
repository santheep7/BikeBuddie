import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Input,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ToastContainer,toast,Bounce } from "react-toastify";
import { transform } from "framer-motion";
import './viewvehicle.css';

export default function ViewVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicle] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [updatedVehicle, setUpdatedVehicle] = useState({
    vehicleName: "",
    model: "",
    regNo: "",
    place: "",
    vehicleImage: null,
    rcBookImage: null,
    insuranceImage: null,
    licenseImage: null,
  });
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const userid = localStorage.getItem("id");

    if (!userid) {
      console.log("No user ID found in localStorage");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/rider/viewvehicle`, { headers: { "_id": userid } })
      .then((res) => {
        setVehicle(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  const handleAddClick = () => {
    navigate("/rider/addvehicle");
  };

  const handleDelete = (vehicleId) => {
    const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (confirmed) {
      axios
        .delete(`${API_BASE_URL}/api/rider/deleteVehicle/`,{headers:{id:vehicleId}})
        .then(() => {
          toast.success('vehicle Deleted Succesfully');
          // alert("Vehicle Deleted Successfully")
          // Remove the deleted vehicle from state
          setVehicle(vehicles.filter((vehicle) => vehicle._id !== vehicleId));
        })
        .catch((error) => {
          toast.error('Error deleting vehicle')
          // console.log("Error deleting vehicle:", error);
        });
    }
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdatedVehicle({
      vehicleName: vehicle.vehicleName || "",
      model: vehicle.model || "",
      regNo: vehicle.regNo || "",
      place: vehicle.place || "",
      vehicleImage: null,
      rcBookImage: null,
      insuranceImage: null,
      licenseImage: null,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("vehicleName", updatedVehicle.vehicleName);
    formData.append("model", updatedVehicle.model);
    formData.append("regNo", updatedVehicle.regNo);
    formData.append("place", updatedVehicle.place);

    // Append images if they exist
    if (updatedVehicle.vehicleImage) {
      formData.append("vehicleImage", updatedVehicle.vehicleImage);
    }
    if (updatedVehicle.rcBookImage) {
      formData.append("rcBookImage", updatedVehicle.rcBookImage);
    }
    if (updatedVehicle.insuranceImage) {
      formData.append("insuranceImage", updatedVehicle.insuranceImage);
    }
    if (updatedVehicle.licenseImage) {
      formData.append("licenseImage", updatedVehicle.licenseImage);
    }

    axios
      .put(`${API_BASE_URL}/api/rider/updatevehicle`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          id:selectedVehicle._id
        },
      })
      .then((res) => {
        // Update the vehicle in the state with the updated details
        setVehicle(vehicles.map((vehicle) => (vehicle._id === selectedVehicle._id ? res.data : vehicle)));
        handleClose(); // Close the dialog
      })
      .catch((error) => {
        toast.error('Error updating vehicle!')
        // console.log("Error updating vehicle:", error);
      });
  };
  

  const handleInputChange = (e) => {
    setUpdatedVehicle({ ...updatedVehicle, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, imageType) => {
    setUpdatedVehicle({ ...updatedVehicle, [imageType]: e.target.files[0] });
  };

  return (
    <div className="view">
     <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
transition={Bounce}
/>
      <Navbar />
      <Container>
        <Typography variant="h4" style={{color:"white",textDecoration:"bold"}} gutterBottom align="center">
          Vehicle Details
        </Typography>

        {vehicles && vehicles.length > 0 ? (
          <Grid container spacing={3} marginTop={3}>
            {vehicles
              .filter((vehicle) => vehicle !== null) // Ensure vehicle is not null
              .map((vehicle) => (
                <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
                  <Card sx={{ boxShadow: 3 }}>
                    {vehicle?.vehicleImage?.length > 0 && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={`${API_BASE_URL}/${vehicle.vehicleImage[0]}`}
                        alt="Vehicle Image"
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {vehicle?.vehicleName || "Unknown Vehicle"}
                      </Typography>
                      <Typography variant="body1">
                        Model: {vehicle?.model || "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        Plate: {vehicle?.regNo || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Location: {vehicle?.place || "Unknown"}
                      </Typography>

                      {/* Expandable Sections */}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>RC Book Images</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {vehicle?.rcBookImage?.length > 0 ? (
                            vehicle.rcBookImage.map((img, index) => (
                              <img
                                key={index}
                                src={`${API_BASE_URL}/${img}`}
                                alt="RC Book"
                                style={{ width: "100%", maxWidth: "300px", borderRadius: 8, marginBottom: 10, display: "block", margin: "0 auto 10px" }}
                              />
                            ))
                          ) : (
                            <Typography>No RC Book images available</Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Insurance Image</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {vehicle?.insuranceImage?.length > 0 ? (
                            <img
                              src={`${API_BASE_URL}/${vehicle.insuranceImage[0]}`}
                              alt="Insurance"
                              style={{ width: "100%", maxWidth: "300px", borderRadius: 8, display: "block", margin: "0 auto" }}
                            />
                          ) : (
                            <Typography>No insurance image available</Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>License Image</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {vehicle?.licenseImage?.length > 0 ? (
                            <img
                              src={`${API_BASE_URL}/${vehicle.licenseImage[0]}`}
                              alt="License"
                              style={{ width: "100%", maxWidth: "300px", borderRadius: 8, display: "block", margin: "0 auto" }}
                            />
                          ) : (
                            <Typography>No license image available</Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>

                      {/* Edit and Delete Buttons */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(vehicle)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(vehicle._id)}
                        fullWidth
                        sx={{ marginTop: 1 }}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" color="textSecondary">
            No vehicles available.
          </Typography>
        )}
      </Container>

      {/* Floating Add Button */}
      <button style={styles.floatingButton} onClick={handleAddClick}>
        +
      </button>

      {/* Edit Vehicle Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            label="Vehicle Name"
            name="vehicleName"
            value={updatedVehicle.vehicleName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Model"
            name="model"
            value={updatedVehicle.model}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Registration No"
            name="regNo"
            value={updatedVehicle.regNo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="place"
            value={updatedVehicle.place}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          
          {/* Image Upload Fields */}
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={(e) => handleImageChange(e, "vehicleImage")}
            fullWidth
            margin="normal"
          />
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={(e) => handleImageChange(e, "rcBookImage")}
            fullWidth
            margin="normal"
          />
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={(e) => handleImageChange(e, "insuranceImage")}
            fullWidth
            margin="normal"
          />
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={(e) => handleImageChange(e, "licenseImage")}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = {
  floatingButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#ff6600",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "30px",
    display: "flex",
    transition: "0.3s transform ease-in",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transform: "scale(1.05)",
    ":hover": {
      transform: "scale(1.2)",   // Scale effect on hover
    }
  }
};

