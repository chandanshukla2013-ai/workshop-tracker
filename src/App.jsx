import { useState, useEffect } from "react";
import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

function App() {
const [equipmentList, setEquipmentList] = useState([]);
const [equipmentId, setEquipmentId] = useState("");
const [equipmentName, setEquipmentName] = useState("");
const [location, setLocation] = useState("");
const [status, setStatus] = useState("Running");
const [category, setCategory] = useState("Motor");
const [searchTerm, setSearchTerm] = useState("");
const [editIndex, setEditIndex] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const fetchEquipment = async () => {

  const querySnapshot = await getDocs(
    collection(db, "equipment")
  );

  const equipmentData = querySnapshot.docs.map((doc) => ({
  firebaseId: doc.id,
  ...doc.data()
}));

  setEquipmentList(equipmentData);
};
useEffect(() => {
  fetchEquipment();
}, []);
const handleDeleteEquipment = async (idToDelete) => {

  await deleteDoc(doc(db, "equipment", idToDelete));

  fetchEquipment();
};
const handleEditEquipment = (item, index) => 
  {

    setEquipmentId(item.id);
    setEquipmentName(item.name);
    setCategory(item.category);
    setLocation(item.location);
    setStatus(item.status);

    setEditIndex(index);
    setIsEditing(true);
  };

const handleAddEquipment = async () => {
  const newEquipment = {
    id: equipmentId,
    name: equipmentName,
    category: category,
    location: location,
    status: status
  };
  await addDoc
  (
  collection(db, "equipment"),
  newEquipment
  );
  if (isEditing) {

  const updatedList = [...equipmentList];

  updatedList[editIndex] = newEquipment;

  setEquipmentList(updatedList);

  setIsEditing(false);
  setEditIndex(null);

} else {

  setEquipmentList([...equipmentList, newEquipment]);

}

  setEquipmentId("");
  setEquipmentName("");
  setLocation("");
  setStatus("Running");
};

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5">

        <h1 className="text-2xl font-bold mb-10">
          Workshop Tracker
        </h1>

        <ul className="space-y-4">

          <li className="bg-blue-700 p-3 rounded-lg">
            Dashboard
          </li>

          <li className="hover:bg-blue-700 p-3 rounded-lg cursor-pointer">
            Equipment
          </li>

          <li className="hover:bg-blue-700 p-3 rounded-lg cursor-pointer">
            Repairs
          </li>

          <li className="hover:bg-blue-700 p-3 rounded-lg cursor-pointer">
            Reports
          </li>

        </ul>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        <h2 className="text-3xl font-bold mb-8">
          Dashboard
        </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">
              Total Equipment
          </h3>

          <p className="text-5xl font-bold text-blue-600 mt-4">
            {equipmentList.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">
              Under Repair
          </h3>

          <p className="text-5xl font-bold text-red-500 mt-4">
            {
              equipmentList.filter(
                (item) => item.status === "Under Repair"
                ).length
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">
              Available
          </h3>

          <p className="text-5xl font-bold text-green-600 mt-4">
              {
                equipmentList.filter(
              (item) => item.status === "Running"
              ).length
              }
          </p>
        </div>

    </div>
        {/* Cards */}
        {/* Add Equipment Form */}

<div className="bg-white p-6 rounded-xl shadow mb-10">

  <h3 className="text-2xl font-bold mb-6">
    Add New Equipment
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <label className="block mb-2 font-semibold">
        Equipment ID
      </label>

     <input
      type="text"
      placeholder="Enter ID"
      value={equipmentId}
      onChange={(e) => setEquipmentId(e.target.value)}
      className="w-full border p-3 rounded-lg"
    />
    </div>

    <div>
      <label className="block mb-2 font-semibold">
        Equipment Name
      </label>

    <input
      type="text"
      placeholder="Enter Equipment Name"
      value={equipmentName}
      onChange={(e) => setEquipmentName(e.target.value)}
      className="w-full border p-3 rounded-lg"
    />

    </div>
    <div>
       <label className="block mb-2 font-semibold">
       Category
       </label>

      <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full border p-3 rounded-lg"
      >
      <option>Motor</option>
      <option>Pump</option>
      <option>Transformer</option>
      <option>Panel</option>
      </select>
    </div>
    <div>
      <label className="block mb-2 font-semibold">
        Location
      </label>

    <input
      type="text"
      placeholder="Enter Location"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      className="w-full border p-3 rounded-lg"
    />
    </div>

    <div>
      <label className="block mb-2 font-semibold">
        Status
      </label>

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="w-full border p-3 rounded-lg"
    >

        <option>Running</option>
        <option>Under Repair</option>
        <option>Standby</option>

      </select>
    </div>

  </div>

 <button
  onClick={handleAddEquipment}
  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
 >

    Save Equipment

  </button>

</div>
        {/* Equipment Table */}

<div className="bg-white mt-10 p-6 rounded-xl shadow">

<div className="flex justify-between items-center mb-6">

  <h3 className="text-2xl font-bold">
    Equipment List
  </h3>

  <div className="flex gap-4">

  <input
    type="text"
    placeholder="Search equipment..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
    Add Equipment
  </button>

</div>

</div>

  <table className="w-full border-collapse">

    <thead>

      <tr className="bg-gray-200">

        <th className="text-left p-3">ID</th>
        <th className="text-left p-3">Equipment</th>
        <th className="text-left p-3">Category</th>
        <th className="text-left p-3">Location</th>
        <th className="text-left p-3">Status</th>
        <th className="text-left p-3">Action</th>

      </tr>

    </thead>

    <tbody>
      {equipmentList
  .filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((item, index) => (

  <tr key={index} className="border-b">

    <td className="p-3">
      {item.id}
    </td>

    <td className="p-3">
      {item.name}
    </td>

    <td className="p-3">
      {item.category}
    </td>

    <td className="p-3">
      {item.location}
    </td>

    <td className="p-3">

  <span
    className={`px-3 py-1 rounded-full text-white font-semibold
    ${
      item.status === "Running"
        ? "bg-green-500"
        : item.status === "Under Repair"
        ? "bg-red-500"
        : "bg-blue-500"
    }`}
  >
    {item.status}
  </span>

</td>

    <td className="p-3">
    <button
       onClick={() => handleEditEquipment(item, index)}
        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2"
      >
      Edit
    </button>

      <button
        onClick={() => handleDeleteEquipment(item.firebaseId)}
        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
      >
        Delete
      </button>

    </td>

  </tr>

))}

    </tbody>

  </table>

</div>

  </div>

    </div>
  )
}

export default App