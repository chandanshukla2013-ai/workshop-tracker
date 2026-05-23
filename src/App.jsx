import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast, { Toaster } from "react-hot-toast";
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

function App() {
const [equipmentList, setEquipmentList] = useState([]);
const [equipmentId, setEquipmentId] = useState("");
const [equipmentName, setEquipmentName] = useState("");
const [status, setStatus] = useState("Dismantled");
const [currentBay, setCurrentBay] = useState("Received Bay");
const [category, setCategory] = useState("Motor");
const [receivedDate, setReceivedDate] = useState("");
const [workOrderNo, setWorkOrderNo] = useState("");
const [receivedFrom, setReceivedFrom] = useState("");
const [equipmentDetails, setEquipmentDetails] = useState("");
const [remark, setRemark] = useState("");
const [tentativeDate, setTentativeDate] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [editIndex, setEditIndex] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [loading, setLoading] = useState(false);
const [darkMode, setDarkMode] = useState(false);
const [activeBay, setActiveBay] = useState("All");
const [activeMenu, setActiveMenu] = useState("Dashboard");
const fetchEquipment = async () => {
const querySnapshot = await getDocs(collection(db, "equipment")
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
const exportToExcel = () => {
const exportData = equipmentList.map((item) => ({
  Work_Order_No: item.workOrderNo,
  Equipment_Name: item.name,
  Equipment_Type: item.category,
  Current_Bay: item.currentBay,
  Status: item.status,
  Received_Date: item.receivedDate,
  Received_From: item.receivedFrom,
  Tentative_Completion_Date: item.tentativeDate,
  Equipment_Details: item.equipmentDetails,
  Remark: item.remark
}));

const worksheet = XLSX.utils.json_to_sheet(exportData);
const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Equipment Report"
  );

const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

const data = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    }
  );

  saveAs(data, "equipment-report.xlsx");

  toast.success("Excel exported successfully");
};
const handleDeleteEquipment = async (idToDelete) => {
const confirmDelete = window.confirm(
  "Are you sure you want to delete this equipment?"
);

if (!confirmDelete) {
  return;
}

  await deleteDoc(doc(db, "equipment", idToDelete));

  fetchEquipment();
  toast.success("Equipment deleted successfully");
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
  setLoading(true);
  if (!equipmentId.trim()) {
  toast.error("Equipment ID is required");
  setLoading(false);
  return;
}

if (!equipmentName.trim()) {
  toast.error("Equipment Name is required");
  setLoading(false);
  return;
}

let updatedBay = "";

if (status === "Received") {
  updatedBay = "Received Bay";
}
else if (
  status === "Dismantled" ||
  status === "Work Under Progress" ||
  status === "Testing"
) {
  updatedBay = "Overhauling Bay";
}
else if (status === "Completed") {
  updatedBay = "Finished Bay";
}
 const newEquipment = {
  id: equipmentId,
  name: equipmentName,
  category: category,
  status: status,
  currentBay: updatedBay,
  receivedDate: receivedDate,
  workOrderNo: workOrderNo,
  receivedFrom: receivedFrom,
  equipmentDetails: equipmentDetails,
  remark: remark,
  tentativeDate: tentativeDate
};
if (isEditing) {

  const itemToUpdate = equipmentList[editIndex];

  await updateDoc(
    doc(db, "equipment", itemToUpdate.firebaseId),
    newEquipment
  );

  fetchEquipment();
  toast.success("Equipment updated successfully");

  setIsEditing(false);
  setEditIndex(null);

} else {

  await addDoc(
    collection(db, "equipment"),
    newEquipment
  );

  fetchEquipment();
  toast.success("Equipment added successfully");
}

setEquipmentId("");
setEquipmentName("");

setCategory("Motor");

setReceivedDate("");
setWorkOrderNo("");
setReceivedFrom("");
setEquipmentDetails("");
setRemark("");
setTentativeDate("");

setStatus("Received");
setCurrentBay("Received Bay");

setLoading(false);
};
const statusData = [
  {
    name: "Received",
    value: equipmentList.filter(
      (item) => item.status === "Received"
    ).length
  },

  {
    name: "Dismantled",
    value: equipmentList.filter(
      (item) => item.status === "Dismantled"
    ).length
  },

  {
    name: "WIP",
    value: equipmentList.filter(
      (item) =>
        item.status === "Work Under Progress"
    ).length
  },

  {
    name: "Testing",
    value: equipmentList.filter(
      (item) => item.status === "Testing"
    ).length
  },

  {
    name: "Completed",
    value: equipmentList.filter(
      (item) => item.status === "Completed"
    ).length
  }
];

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#22c55e"
];
return (
<>
<Toaster position="top-right" />
<div
className={`flex min-h-screen transition duration-500 ${
darkMode
? "bg-slate-900 text-white"
: "bg-gradient-to-br from-slate-100 to-blue-100 text-slate-900"
}`}
>

{/* Sidebar */}
<div className="w-72 bg-slate-900 text-white p-6 shadow-2xl">
<h1 className="text-3xl font-extrabold mb-12 tracking-wide text-center">
⚙ Workshop Tracker
</h1>
<ul className="space-y-4">

  <li
    onClick={() => setActiveMenu("Dashboard")}
    className={`p-3 rounded-lg cursor-pointer transition duration-300 font-semibold ${
      activeMenu === "Dashboard"
        ? "bg-blue-700 shadow-lg"
        : "hover:bg-blue-700"
    }`}
  >
    📊 Dashboard
  </li>

  <li
    onClick={() => setActiveMenu("Equipment")}
    className={`p-3 rounded-lg cursor-pointer transition duration-300 font-semibold ${
      activeMenu === "Equipment"
        ? "bg-blue-700 shadow-lg"
        : "hover:bg-blue-700"
    }`}
  >
    📦 Equipment
  </li>

  <li
    onClick={() => setActiveMenu("Reports")}
    className={`p-3 rounded-lg cursor-pointer transition duration-300 font-semibold ${
      activeMenu === "Reports"
        ? "bg-blue-700 shadow-lg"
        : "hover:bg-blue-700"
    }`}
  >
    📑 Reports
  </li>
</ul>
</div>
{/* Main Content */}
<div className="flex-1 p-10 overflow-auto">
<div className="flex justify-between items-center mb-10">
<div>
<h2 className={`text-4xl font-extrabold ${
darkMode ? "text-white" : "text-slate-800"
}`}>
{
  activeMenu === "Dashboard"
    ? "Workshop Dashboard"
    : activeMenu === "Equipment"
    ? "Equipment Management"
    : "Reports & Analytics"
}
</h2>
<p className={`mt-2 ${
darkMode ? "text-slate-300" : "text-slate-500"
}`}>
{
  activeMenu === "Dashboard"
    ? "Monitor and manage workshop equipment efficiently"
    : activeMenu === "Equipment"
    ? "Add and manage workshop equipment workflow"
    : "Track equipment reports and workflow analytics"
}
</p>
</div>
<div className="flex items-center gap-4">
<button
onClick={() => setDarkMode(!darkMode)}
className="bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition duration-300 font-semibold"
>
{darkMode ? "☀ Light" : "🌙 Dark"}
</button>
<div className="bg-white/70 backdrop-blur-lg px-5 py-3 rounded-2xl shadow-md">
<p className="text-sm text-slate-500">
Logged in as
</p>
<h4 className="font-bold text-slate-700">
Admin User
</h4>
</div>
</div>
</div>
{activeMenu === "Dashboard" && (
  <>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 mb-10">
<div
className={`backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-lg font-bold text-slate-600 uppercase tracking-wide">
Total Equipment
</h3>
<p className="text-6xl font-extrabold text-black-600 mt-4">
{equipmentList.length}
</p>
</div>
<div
className={`backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-lg font-bold text-slate-600 uppercase tracking-wide">
📥 Received Bay
</h3>
<p className="text-6xl font-extrabold text-blue-500 mt-4">
{
equipmentList.filter(
(item) =>
(item.currentBay || "Received Bay") === "Received Bay"
).length
}
</p>
</div>
<div
className={`backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-lg font-bold text-slate-600 uppercase tracking-wide">
🛠 Overhauling Bay
</h3>
<p className="text-6xl font-extrabold text-yellow-600 mt-4">
{
equipmentList.filter(
(item) => item.currentBay === "Overhauling Bay"
).length
}
</p>
</div>
<div
className={`backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-lg font-bold text-slate-600 uppercase tracking-wide">
✅ Finished Bay
</h3>
<p className="text-6xl font-extrabold text-green-600 mt-4">
{
equipmentList.filter(
(item) => item.currentBay === "Finished Bay"
).length
}
</p>
</div>
<div
className={`backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-lg font-bold text-slate-600 uppercase tracking-wide">
🚨 Delayed Equipment
</h3>
<p className="text-6xl font-extrabold text-red-500 mt-4">
{
equipmentList.filter(
(item) =>
item.tentativeDate &&
item.tentativeDate <
new Date().toISOString().split("T")[0] &&
item.status !== "Completed"
).length
}
</p>
</div>
</div>
{/* Cards */}
<div
  className={`mt-10 p-6 rounded-3xl shadow-xl ${
    darkMode
      ? "bg-slate-800"
      : "bg-white/80 backdrop-blur-lg"
  }`}
>
  <h2
    className={`text-2xl font-bold mb-6 ${
      darkMode ? "text-white" : "text-slate-800"
    }`}
  >
    🛠 Workshop Status Analytics
  </h2>

  <div className="w-full h-[400px]">

    <ResponsiveContainer width="100%" height="100%">

      <PieChart>

        <Pie
          data={statusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={140}
          label
        >

          {statusData.map((entry, index) => (

            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />

          ))}

        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>

    </ResponsiveContainer>
  </div>
</div>
 </>
  )}

{/* Add Equipment Form */}
{activeMenu === "Equipment" && (
<div
className={`backdrop-blur-lg p-8 rounded-3xl shadow-2xl mb-10 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className={`text-3xl font-extrabold mb-8 ${
darkMode ? "text-white" : "text-slate-800"
}`}>
Add New Equipment
</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}>
Equipment ID
</label>
<input
type="text"
placeholder="Enter ID"
value={equipmentId}
onChange={(e) => setEquipmentId(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div>
<label
className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Received Date
</label>
<input
type="date"
value={receivedDate}
onChange={(e) => setReceivedDate(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div>
<label
className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Work Order No
</label>
<input
type="text"
placeholder="Enter Work Order No"
value={workOrderNo}
onChange={(e) => setWorkOrderNo(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div>
<label
className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Received From
</label>

<input
type="text"
placeholder="Enter Source Department / Area"
value={receivedFrom}
onChange={(e) => setReceivedFrom(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div>
<label className="block mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
Equipment Name
</label>
<input
type="text"
placeholder="Enter Equipment Name"
value={equipmentName}
onChange={(e) => setEquipmentName(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div>
<label className="block mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
Category
</label>
<select
value={category}
onChange={(e) => setCategory(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
>
<option>Motor</option>
<option>Pump</option>
<option>Transformer</option>
<option>Panel</option>
</select>
</div>

<div className="md:col-span-2">
<label
className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Equipment Details
</label>

<textarea
placeholder="Enter equipment specifications/details"
value={equipmentDetails}
onChange={(e) => setEquipmentDetails(e.target.value)}
rows="4"
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border resize-none ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div>
<label
className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Tentative Completion Date
</label>
<input
type="date"
value={tentativeDate}
onChange={(e) => setTentativeDate(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div className="md:col-span-2">
<label
className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Remark
</label>
<textarea
placeholder="Enter remarks"
value={remark}
onChange={(e) => setRemark(e.target.value)}
rows="3"
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border resize-none ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div>
<label
className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Current Bay
</label>
<select
value={currentBay}
onChange={(e) => setCurrentBay(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
>
<option>Received Bay</option>
<option>Overhauling Bay</option>
<option>Finished Bay</option>
</select>
</div>
<div>
<label className="block mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
Status
</label>
<select
value={status}
onChange={(e) => setStatus(e.target.value)}
className={`w-full p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
>
<option>Dismantled</option>
<option>Received</option>
<option>Work Under Progress</option>
<option>Testing</option>
<option>Completed</option>
</select>
</div>
</div>
<button
onClick={handleAddEquipment}
className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300 font-bold tracking-wide"
>
{loading ? "Saving..." : "Save Equipment"}
</button>
</div>
)}


{/* Equipment Table */}
{activeMenu === "Reports" && (
<div
className={`backdrop-blur-lg mt-10 p-8 rounded-3xl shadow-2xl border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<div className="flex justify-between items-center mb-6">
<h3 className={`text-3xl font-extrabold ${
darkMode ? "text-white" : "text-slate-800"
}`}>
Equipment List
</h3>
<div className="flex gap-4 mb-8">
<button
onClick={() => setActiveBay("All")}
className={`px-6 py-3 rounded-2xl font-bold transition duration-300 ${
activeBay === "All"
? "bg-slate-800 text-white shadow-lg"
: "bg-slate-200 text-slate-700"
}`}
>
📋 All Equipment
</button>
<button
onClick={() => setActiveBay("Received Bay")}
className={`px-6 py-3 rounded-2xl font-bold transition duration-300 ${
activeBay === "Received Bay"
? "bg-blue-600 text-white shadow-lg"
: "bg-slate-200 text-slate-700"
}`}
>
📥 Received Bay
</button>
<button
onClick={() => setActiveBay("Overhauling Bay")}
className={`px-6 py-3 rounded-2xl font-bold transition duration-300 ${
activeBay === "Overhauling Bay"
? "bg-orange-500 text-white shadow-lg"
: "bg-slate-200 text-slate-700"
}`}
>
🛠 Overhauling Bay
</button>
<button
onClick={() => setActiveBay("Finished Bay")}
className={`px-6 py-3 rounded-2xl font-bold transition duration-300 ${
activeBay === "Finished Bay"
? "bg-green-600 text-white shadow-lg"
: "bg-slate-200 text-slate-700"
}`}
>
✅ Finished Bay
</button>
</div>
<div className="flex items-center gap-4 mb-6">
<input
type="text"
placeholder="Search equipment..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className={`p-3 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
<button
onClick={exportToExcel}
className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300 font-bold"
>
📥 Export Excel
</button>
</div>
</div>
<table className="w-full border-collapse">
<thead>
<tr
className={`uppercase text-sm tracking-wide ${
darkMode
? "bg-slate-700 text-slate-200"
: "bg-slate-100 text-slate-700"
}`}
>
<th className="text-left p-3">WO No</th>
<th className="text-left p-3">Equipment</th>
<th className="text-left p-3">Type</th>
<th className="text-left p-3">Current Bay</th>
<th className="text-left p-3">Received Date</th>
<th className="text-left p-3">Received From</th>
<th className="text-left p-3">Tentative Date</th>
<th className="text-left p-3">Status</th>
<th className="text-left p-3">Action</th>
</tr>
</thead>
<tbody>
{equipmentList.filter(
(item) =>
(activeBay === "All" || item.currentBay === activeBay) &&
item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).map((item, index) => (
<tr
key={index}
className={`border-b transition duration-300 ${
item.tentativeDate &&
item.tentativeDate < new Date().toISOString().split("T")[0] &&
item.status !== "Completed"
? darkMode
? "bg-red-900/30 border-red-700"
: "bg-red-100 border-red-300"
: darkMode
? "border-slate-700 hover:bg-slate-700/40"
: "border-slate-200 hover:bg-slate-50"
}`}
>
<td
className={`p-3 ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
  {item.workOrderNo}
</td>
<td
className={`p-3 ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.name}
</td>
<td
className={`p-3 ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.category}
</td>
<td
className={`p-3 ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.currentBay}
</td>
<td
className={`p-3 ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.receivedDate}
</td>
<td
className={`p-3 ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.receivedFrom}
</td>
<td
className={`p-3 ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.tentativeDate || "-"}
</td>
<td className="p-3">
<span
className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-md tracking-wide
${
item.status === "Dismantled"
? "bg-red-500"
: item.status === "Work Under Progress"
? "bg-yellow-500"
: item.status === "Testing"
? "bg-blue-500"
: "bg-green-500"
}`}
>
{item.status}
</span>
</td>
<td
className="p-3">
<button
onClick={() => handleEditEquipment(item, index)}
className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition duration-300 mr-2 font-semibold"
>
Edit
</button>
<button
onClick={() => handleDeleteEquipment(item.firebaseId)}
className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition duration-300 font-semibold"
>
Delete
</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
)}
</div>
</div>
</>
)
}
export default App