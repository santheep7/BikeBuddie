import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Addvehicle() {
  const [vehicleName, setVehicleName] = useState("");
  const [model, setModel] = useState("");
  const [regNo, setRegNo] = useState("");
  const [rcBookImage, setRcBookImage] = useState([]);
  const [insuranceImage, setInsuranceImage] = useState([]);
  const [licenseImage, setLicenseImage] = useState([]);
  const [vehicleImage, setVehicleImage] = useState([]);
  const [place, setPlace] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("vehicleName", vehicleName);
    formData.append("model", model);
    formData.append("regNo", regNo);
    formData.append("place", place);

    rcBookImage.forEach((f) => formData.append("rcBookImage", f));
    insuranceImage.forEach((f) => formData.append("insuranceImage", f));
    licenseImage.forEach((f) => formData.append("licenseImage", f));
    vehicleImage.forEach((f) => formData.append("vehicleImage", f));

    axios
      .post(`${API_BASE_URL}/api/rider/addvehicle`, formData, {
        headers: { id: userId, "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert(res.data.message);
        navigate("/rider/viewvehicle");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileChange = (e, setter) => {
    setter(Array.from(e.target.files));
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Vehicle Registration Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Vehicle Name + Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Vehicle Name"
              className="border p-3 rounded-lg w-full"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Model"
              className="border p-3 rounded-lg w-full"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          {/* Reg No + Place */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Registration Number"
              className="border p-3 rounded-lg w-full"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Place"
              className="border p-3 rounded-lg w-full"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
          </div>

          {/* File Upload Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="font-medium">Upload RC Book Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-1 w-full border p-2 rounded-lg"
                onChange={(e) => handleFileChange(e, setRcBookImage)}
                required
              />
            </div>

            <div>
              <label className="font-medium">Upload Insurance Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-1 w-full border p-2 rounded-lg"
                onChange={(e) => handleFileChange(e, setInsuranceImage)}
                required
              />
            </div>

            <div>
              <label className="font-medium">Upload License Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-1 w-full border p-2 rounded-lg"
                onChange={(e) => handleFileChange(e, setLicenseImage)}
                required
              />
            </div>

            <div>
              <label className="font-medium">Upload Vehicle Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-1 w-full border p-2 rounded-lg"
                onChange={(e) => handleFileChange(e, setVehicleImage)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
