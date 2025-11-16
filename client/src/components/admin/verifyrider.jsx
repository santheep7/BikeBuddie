import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";

export default function VerifyRider() {
  const [riders, setRiders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/viewriders`)
      .then((res) => {
        const filteredRiders = res.data.filter((r) => r?.userId);
        setRiders(filteredRiders);
      })
      .catch((err) => console.log("Error fetching riders:", err));
  }, []);

  const handleOpen = (rider) => {
    setSelectedRider(rider);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRider(null);
  };

  const verifyUser = (id) => {
    axios
      .put(`${API_BASE_URL}/admin/verifyrider/${id}`)
      .then(() => {
        toast.success("Rider verified successfully!");
        setRiders((prev) =>
          prev.map((r) =>
            r.userId?._id === id ? { ...r, verifieddriver: !r.verifieddriver } : r
          )
        );
      })
      .catch((err) => console.log(err));
  };

  const deleteUser = (id) => {
    axios
      .delete(`${API_BASE_URL}/admin/deleteuser/${id}`)
      .then(() => {
        toast.success("User deleted successfully!");
        setRiders((prev) => prev.filter((r) => r.userId?._id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        transition={Bounce}
        theme="dark"
      />

      <div className="p-4 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Verify Riders</h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Vehicle</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {riders.length > 0 ? (
                riders.map((rider, index) => (
                  <tr key={index} className="border">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">
                      {rider?.userId?.fullname || "No Name"}
                    </td>
                    <td className="px-4 py-2 border">
                      {rider?.userId?.email || "No Email"}
                    </td>
                    <td className="px-4 py-2 border">
                      {rider?.vehicleName || "No Vehicle"}
                    </td>

                    <td className="px-4 py-2 border flex gap-2">
                      <button
                        onClick={() => handleOpen(rider)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Details
                      </button>

                      {!rider?.userId?.verifieddriver ? (
                        <button
                          onClick={() => verifyUser(rider?.userId?._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteUser(rider?.userId?._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-gray-500 border"
                  >
                    No Riders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      {open && selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4">Rider Details</h3>

            <p><b>Name:</b> {selectedRider?.userId?.fullname}</p>
            <p><b>Email:</b> {selectedRider?.userId?.email}</p>
            <p>
              <b>Vehicle:</b> {selectedRider?.vehicleName} ({selectedRider?.model})
            </p>
            <p><b>Registration No:</b> {selectedRider?.regNo}</p>
            <p><b>Location:</b> {selectedRider?.place}</p>
            <p>
              <b>Created At:</b>{" "}
              {selectedRider?.createdAt
                ? new Date(selectedRider.createdAt).toLocaleString()
                : "N/A"}
            </p>

            {/* Vehicle Image */}
            <div className="mt-4">
              <p className="font-semibold mb-1">Vehicle Image:</p>
              {selectedRider?.vehicleImage?.length > 0 ? (
                <img
                  src={`${API_BASE_URL}/${selectedRider.vehicleImage[0]}`}
                  className="w-full rounded"
                />
              ) : (
                <p>No Vehicle Image</p>
              )}
            </div>

            {/* RC Book */}
            <div className="mt-4">
              <p className="font-semibold mb-1">RC Book:</p>
              {selectedRider?.rcBookImage?.length > 0 ? (
                selectedRider.rcBookImage.map((img, i) => (
                  <img
                    key={i}
                    src={`${API_BASE_URL}/${img}`}
                    className="w-full rounded mb-2"
                  />
                ))
              ) : (
                <p>No RC Book Images</p>
              )}
            </div>

            {/* License */}
            <div className="mt-4">
              <p className="font-semibold mb-1">License:</p>
              {selectedRider?.licenseImage?.length > 0 ? (
                <img
                  src={`${API_BASE_URL}/${selectedRider.licenseImage[0]}`}
                  className="w-full rounded"
                />
              ) : (
                <p>No License Image</p>
              )}
            </div>

            {/* Insurance */}
            <div className="mt-4">
              <p className="font-semibold mb-1">Insurance:</p>
              {selectedRider?.insuranceImage?.length > 0 ? (
                <img
                  src={`${API_BASE_URL}/${selectedRider.insuranceImage[0]}`}
                  className="w-full rounded"
                />
              ) : (
                <p>No Insurance Image</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
