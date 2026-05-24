import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
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
const [completionDate, setCompletionDate] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [editIndex, setEditIndex] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [loading, setLoading] = useState(false);
const [darkMode, setDarkMode] = useState(false);
const [activeBay, setActiveBay] = useState("All");
const [activeMenu, setActiveMenu] = useState("Dashboard");
const [user, setUser] = useState(null);
const [isGuest, setIsGuest] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [cartItems, setCartItems] = useState([]);
const [requestDepartment, setRequestDepartment] = useState("");
const [requestPurpose, setRequestPurpose] = useState("");
const [requestPriority, setRequestPriority] = useState("Normal");
const [requiredDate, setRequiredDate] = useState("");
const [requestRemark, setRequestRemark] = useState("");
const [requirementsList, setRequirementsList] = useState([]);
const [authLoading, setAuthLoading] = useState(true);
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

  if (user || isGuest) {
    fetchEquipment();
  }

}, [user, isGuest]);
useEffect(() => {

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

    setUser(currentUser);

    setAuthLoading(false);

  });

  return () => unsubscribe();

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
const handleEditEquipment = (item, index) => {

  setEquipmentId(item.id);

  setEquipmentName(item.name);

  setReceivedDate(item.receivedDate || "");

  setWorkOrderNo(item.workOrderNo || "");

  setReceivedFrom(item.receivedFrom || "");

  setEquipmentDetails(item.equipmentDetails || "");

  setTentativeDate(item.tentativeDate || "");

  setRemark(item.remark || "");

  setCurrentBay(item.currentBay || "Received Bay");

  setCategory(item.category);

  setStatus(item.status);

  setActiveMenu("Equipment");

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
let finalCompletionDate = completionDate;

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
if (status === "Completed") {

  finalCompletionDate =
    new Date().toISOString().split("T")[0];

}
 const newEquipment = {
  id: equipmentId,
  name: equipmentName,
  category: category,
  status: status,
  reserved: false,
  reservedBy: "",
  currentBay: updatedBay,
  receivedDate: receivedDate,
  workOrderNo: workOrderNo,
  receivedFrom: receivedFrom,
  equipmentDetails: equipmentDetails,
  remark: remark,
  tentativeDate: tentativeDate,
  completionDate: finalCompletionDate
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
const motorStatusData = [

  {
    name: "Received",
    value: equipmentList.filter(
      (item) =>
        item.category === "Motor" &&
        item.status === "Received"
    ).length
  },

  {
    name: "Dismantled",
    value: equipmentList.filter(
      (item) =>
        item.category === "Motor" &&
        item.status === "Dismantled"
    ).length
  },

  {
    name: "WIP",
    value: equipmentList.filter(
      (item) =>
        item.category === "Motor" &&
        item.status === "Work Under Progress"
    ).length
  },

  {
    name: "Testing",
    value: equipmentList.filter(
      (item) =>
        item.category === "Motor" &&
        item.status === "Testing"
    ).length
  },

  {
    name: "Completed",
    value: equipmentList.filter(
      (item) =>
        item.category === "Motor" &&
        item.status === "Completed"
    ).length
  }

];
const pumpStatusData = [

  {
    name: "Received",
    value: equipmentList.filter(
      (item) =>
        item.category === "Pump" &&
        item.status === "Received"
    ).length
  },

  {
    name: "Dismantled",
    value: equipmentList.filter(
      (item) =>
        item.category === "Pump" &&
        item.status === "Dismantled"
    ).length
  },

  {
    name: "WIP",
    value: equipmentList.filter(
      (item) =>
        item.category === "Pump" &&
        item.status === "Work Under Progress"
    ).length
  },

  {
    name: "Testing",
    value: equipmentList.filter(
      (item) =>
        item.category === "Pump" &&
        item.status === "Testing"
    ).length
  },

  {
    name: "Completed",
    value: equipmentList.filter(
      (item) =>
        item.category === "Pump" &&
        item.status === "Completed"
    ).length
  }

];
const departmentData = Object.values(

  equipmentList.reduce((acc, item) => {

    const dept = item.receivedFrom || "Unknown";

    if (!acc[dept]) {

      acc[dept] = {
        department: dept,
        count: 0
      };

    }

    acc[dept].count += 1;

    return acc;

  }, {})

);
const monthlyTrendData = [];

const monthlyMap = {};

equipmentList.forEach((item) => {

  // Received Data

  if (item.receivedDate) {

    const receivedMonth = new Date(
      item.receivedDate
    ).toLocaleString("default", {
      month: "short"
    });

    if (!monthlyMap[receivedMonth]) {

      monthlyMap[receivedMonth] = {
        month: receivedMonth,
        received: 0,
        completed: 0
      };

    }

    monthlyMap[receivedMonth].received += 1;

  }

  // Completed Data

  if (item.completionDate) {

    const completedMonth = new Date(
      item.completionDate
    ).toLocaleString("default", {
      month: "short"
    });

    if (!monthlyMap[completedMonth]) {

      monthlyMap[completedMonth] = {
        month: completedMonth,
        received: 0,
        completed: 0
      };

    }

    monthlyMap[completedMonth].completed += 1;

  }

});

Object.values(monthlyMap).forEach((item) => {
  monthlyTrendData.push(item);
});
const handleLogin = async () => {

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    toast.success("Login successful");

  } catch (error) {

    toast.error("Invalid email or password");

  }
};
const handleGuestLogin = async () => {

  try {

    await signInWithEmailAndPassword(
      auth,
      "guest@workshop.com",
      "guest123"
    );

    setIsGuest(true);

    toast.success("Guest login successful");

  } catch (error) {

    toast.error("Guest login failed");

  }

};
const handleLogout = async () => {

  try {

    await signOut(auth);

    setIsGuest(false);

    toast.success("Logged out successfully");

  } catch (error) {

    toast.error("Logout failed");

  }

};
if (authLoading) {
  return (
    <div className="h-screen flex items-center justify-center text-2xl font-bold">
      Loading...
    </div>
  );
}

if (!user && !isGuest) {
  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[400px]">

        <h2 className="text-4xl font-extrabold text-center text-slate-800 mb-8">
          Workshop Login
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 border border-slate-300 rounded-2xl mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 border border-slate-300 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition duration-300 shadow-xl"
        >
          Login
        </button>

        <button
         onClick={handleGuestLogin}
         className="w-full mt-4 bg-slate-700 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition duration-300 shadow-xl"
        >
         Login as Guest
        </button>
      </div>

    </div>

  );
}
const handleSubmitRequirement = () => {

  if (
    cartItems.length === 0 ||
    requestDepartment === "" ||
    requestPurpose === ""
  ) {

    alert("Please complete all required fields.");

    return;

  }

  const newRequirement = {

    reqNo: `REQ-${requirementsList.length + 1}`,

    id: Date.now(),

    department: requestDepartment,

    purpose: requestPurpose,

    priority: requestPriority,

    requiredDate: requiredDate,

    remark: requestRemark,

    items: cartItems,

    status: "Pending",

    expectedDeliveryDate: ""

  };

  setRequirementsList([
    ...requirementsList,
    newRequirement
  ]);
setEquipmentList(

  equipmentList.map((equipment) => {

    const selectedItem = cartItems.find(

      (cartItem) =>
        cartItem.id === equipment.id

    );

    if (selectedItem) {

      return {

        ...equipment,

        reserved: true,

        reservedBy: newRequirement.reqNo

      };

    }

    return equipment;

  })

);
  // Clear form after submit

  setCartItems([]);

  setRequestDepartment("");

  setRequestPurpose("");

  setRequestPriority("Normal");

  setRequiredDate("");

  setRequestRemark("");

  alert("Requirement Submitted Successfully!");

};
return (
<>
<Toaster position="top-right" />
<div
className={`flex flex-col lg:flex-row min-h-screen transition duration-500 ${
darkMode
? "bg-slate-900 text-white"
: "bg-gradient-to-br from-slate-100 to-blue-100 text-slate-900"
}`}
>

{/* Sidebar */}
<div className="w-full lg:w-72 bg-slate-900 text-white p-6 shadow-2xl">
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

{!isGuest && (
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
)}
    <li
    onClick={() => setActiveMenu("Requirements")}
    className={`p-3 rounded-lg cursor-pointer transition duration-300 font-semibold ${
      activeMenu === "Requirements"
        ? "bg-blue-700 shadow-lg"
        : "hover:bg-blue-700"
    }`}
  >
     🛒 Requirements
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
<div className="flex-1 p-4 lg:p-10 overflow-auto">
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
<div className="bg-white/70 backdrop-blur-lg px-5 py-3 rounded-2xl shadow-md flex items-center gap-4">

  <div>
    <p className="text-sm text-slate-500">
      Logged in as
    </p>

    <h4 className="font-bold text-slate-700">
      {user?.email}
    </h4>
  </div>

  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition duration-300"
  >
    Logout
  </button>

</div>
</div>
</div>
{activeMenu === "Dashboard" && (
  <>
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 lg:gap-8 mb-10">
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
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">

  {/* Motor Analytics */}

  <div
    className={`p-6 rounded-3xl shadow-xl ${
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
      ⚙ Motor Workflow Analytics
    </h2>

    <div className="w-full h-[240px]">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={motorStatusData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[10, 10, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  </div>
{/* Pump Analytics */}

<div
  className={`p-6 rounded-3xl shadow-xl ${
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
    🛠 Pump Workflow Analytics
  </h2>

  <div className="w-full h-[240px]">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart data={pumpStatusData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Legend />

        <Bar
          dataKey="value"
          fill="#22c55e"
          radius={[10, 10, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>
</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">
{/* Department Analytics */}

<div
  className={`mt-6 p-6 rounded-3xl shadow-xl ${
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
    🏢 Department-wise Equipment Received
  </h2>

  <div className="w-full h-[240px]">

    <ResponsiveContainer width="100%" height="100%">

      <LineChart data={departmentData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="department" />

        <YAxis />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="count"
          stroke="#f59e0b"
          strokeWidth={4}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>

{/* Monthly Trend Analytics */}

<div
  className={`mt-6 p-6 rounded-3xl shadow-xl ${
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
    📅 Monthly Equipment Trend
  </h2>

  <div className="w-full h-[240px]">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart data={monthlyTrendData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Legend />

        <Bar
          dataKey="received"
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
        />

        <Bar
          dataKey="completed"
          fill="#22c55e"
          radius={[8, 8, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

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
{
  loading
    ? "Saving..."
    : isEditing
    ? "Update Equipment"
    : "Save Equipment"
}
</button>
{isEditing && (
  <button
    onClick={() => {

      setIsEditing(false);
      setActiveMenu("Reports");
      setEditIndex(null);

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

    }}
    className="mt-4 ml-4 bg-slate-500 hover:bg-slate-600 text-white px-8 py-4 rounded-2xl shadow-lg transition duration-300 font-bold"
  >
    Cancel Edit
  </button>
)}
</div>
)}


{/* Equipment Table */}
{activeMenu === "Requirements" && (

  <div>

    <h2
      className={`text-3xl font-bold mb-6 ${
        darkMode ? "text-white" : "text-slate-800"
      }`}
    >
      🛒 Requirements Management
    </h2>

    <div
      className={`p-8 rounded-3xl shadow-xl ${
        darkMode
          ? "bg-slate-800"
          : "bg-white/80 backdrop-blur-lg"
      }`}
    >

      <div className="overflow-x-auto">

  <table className="w-full border-collapse">

    <thead>

      <tr
        className={`${
          darkMode
            ? "bg-slate-700 text-white"
            : "bg-slate-200 text-slate-800"
        }`}
      >

        <th className="p-3 text-left">
          Equipment ID
        </th>

        <th className="p-3 text-left">
          Equipment Name
        </th>

        <th className="p-3 text-left">
          Received From
        </th>

        <th className="p-3 text-left">
          Category
        </th>

        <th className="p-3 text-left">
          Status
        </th>

        <th className="p-3 text-left">
          Action
        </th>

      </tr>

    </thead>

    <tbody>

      {equipmentList
        .filter(
          (item) =>
            item.currentBay === "Finished Bay"
        )
        .map((item, index) => (

          <tr
            key={index}
            className={`border-b ${
              darkMode
                ? "border-slate-700"
                : "border-slate-200"
            }`}
          >

            <td className="p-3">
              {item.id}
            </td>

            <td className="p-3">
              {item.name}
            </td>

            <td className="p-3">
              {item.receivedFrom}
            </td>

            <td className="p-3">
              {item.category}
            </td>

            <td className="p-3">
              {item.status}
            </td>
            <td className="p-3">

{item.reserved ? (

  <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold">

    Reserved

  </span>

) : (

  <button

    onClick={() => {

      const alreadyExists = cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (!alreadyExists) {

        setCartItems([...cartItems, item]);

      }

    }}

    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition duration-300"
  >

    Add to Cart

  </button>

)}

</td>
          </tr>

      ))}

    </tbody>

  </table>

</div>
<div
  className={`mt-10 p-6 rounded-3xl shadow-xl ${
    darkMode
      ? "bg-slate-700"
      : "bg-slate-100"
  }`}
>

  <h3 className="text-2xl font-bold mb-6">

    🛒 Selected Requirements

  </h3>

  {cartItems.length === 0 ? (

    <p>No equipment selected.</p>

  ) : (

    <table className="w-full border-collapse">

      <thead>

        <tr
          className={`${
            darkMode
              ? "bg-slate-800 text-white"
              : "bg-slate-300 text-slate-800"
          }`}
        >

          <th className="p-3 text-left">
            Equipment ID
          </th>

          <th className="p-3 text-left">
            Equipment Name
          </th>

          <th className="p-3 text-left">
            Category
          </th>

          <th className="p-3 text-left">
          Action
          </th>
        </tr>

      </thead>

      <tbody>

        {cartItems.map((item, index) => (

          <tr
            key={index}
            className={`border-b ${
              darkMode
                ? "border-slate-600"
                : "border-slate-300"
            }`}
          >

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

  <button

    onClick={() =>
      setCartItems(
        cartItems.filter(
          (cartItem) =>
            cartItem.id !== item.id
        )
      )
    }

    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition duration-300"
  >

    Remove

  </button>

</td>
          </tr>

        ))}

      </tbody>

    </table>

  )}
</div>
<div
  className={`mt-10 p-6 rounded-3xl shadow-xl ${
    darkMode
      ? "bg-slate-700"
      : "bg-slate-100"
  }`}
>

  <h3 className="text-2xl font-bold mb-6">

    📝 Submit Requirement

  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>

      <label className="font-semibold">
        Department
      </label>

      <input
        type="text"
        value={requestDepartment}
        onChange={(e) =>
          setRequestDepartment(e.target.value)
        }
        className="w-full p-3 rounded-xl border mt-2 text-black"
        placeholder="Enter Department Name"
      />

    </div>

    <div>

      <label className="font-semibold">
        Purpose
      </label>

      <input
        type="text"
        value={requestPurpose}
        onChange={(e) =>
          setRequestPurpose(e.target.value)
        }
        className="w-full p-3 rounded-xl border mt-2 text-black"
        placeholder="Purpose of Requirement"
      />

    </div>

    <div>

      <label className="font-semibold">
        Priority
      </label>

      <select
        value={requestPriority}
        onChange={(e) =>
          setRequestPriority(e.target.value)
        }
        className="w-full p-3 rounded-xl border mt-2 text-black"
      >

        <option>Normal</option>

        <option>Urgent</option>

      </select>

    </div>

    <div>

      <label className="font-semibold">
        Required Date
      </label>

      <input
        type="date"
        value={requiredDate}
        onChange={(e) =>
          setRequiredDate(e.target.value)
        }
        className="w-full p-3 rounded-xl border mt-2 text-black"
      />

    </div>

  </div>

  <div className="mt-6">

    <label className="font-semibold">
      Remarks
    </label>

    <textarea
      value={requestRemark}
      onChange={(e) =>
        setRequestRemark(e.target.value)
      }
      className="w-full p-3 rounded-xl border mt-2 text-black"
      rows="4"
      placeholder="Additional remarks..."
    />

  </div>
<div className="mt-6">

  <button

    onClick={handleSubmitRequirement}

    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold transition duration-300"
  >

    Submit Requirement

  </button>

</div>
</div>
<div
  className={`mt-10 p-6 rounded-3xl shadow-xl ${
    darkMode
      ? "bg-slate-700"
      : "bg-slate-100"
  }`}
>

  <h3 className="text-2xl font-bold mb-6">

    📋 Submitted Requirements

  </h3>

  {requirementsList.length === 0 ? (

    <p>No requirements submitted yet.</p>

  ) : (

    <table className="w-full border-collapse">

      <thead>

        <tr
          className={`${
            darkMode
              ? "bg-slate-800 text-white"
              : "bg-slate-300 text-slate-800"
          }`}
        >
          <th className="p-3 text-left">
          Req No
          </th>

          <th className="p-3 text-left">
            Department
          </th>

          <th className="p-3 text-left">
            Equipment
          </th>

          <th className="p-3 text-left">
            Purpose
          </th>

          <th className="p-3 text-left">
            Priority
          </th>

          <th className="p-3 text-left">
            Status
          </th>

          <th className="p-3 text-left">
            Expected Delivery
          </th>

          <th className="p-3 text-left">
          Action
          </th>

          <th className="p-3 text-left">
          Approval
          </th>

        </tr>

      </thead>

      <tbody>

        {requirementsList.map((req, index) => (

          <tr
            key={index}
            className={`border-b ${
              darkMode
                ? "border-slate-600"
                : "border-slate-300"
            }`}
          >
            <td className="p-3">
              {req.reqNo}
            </td>

            <td className="p-3">
              {req.department}
            </td>

            <td className="p-3">
              {req.items.map((item) => item.name).join(", ")}
            </td>

            <td className="p-3">
              {req.purpose}
            </td>

            <td className="p-3">
              {req.priority}
            </td>

            <td className="p-3">
              {req.status}
            </td>

           <td className="p-3">

  <input

    type="date"

    value={req.expectedDeliveryDate}

    onChange={(e) => {

      setRequirementsList(

        requirementsList.map((r) =>

          r.id === req.id

            ? {
                ...r,
                expectedDeliveryDate:
                  e.target.value
              }

            : r

        )

      );

    }}

    className="p-2 rounded-lg border text-black"

  />

</td>

            <td className="p-3">

  <button

onClick={() => {

  const details = `

Department:
${req.department}

Purpose:
${req.purpose}

Priority:
${req.priority}

Required Date:
${req.requiredDate}
Status:
${req.status}
Remarks:
${req.remark || "N/A"}
Requested Equipment:
${req.items
  .map(
    (item) =>
`• ${item.name}
Category: ${item.category}
Equipment ID: ${item.id}
Received From: ${item.receivedFrom}
`
)
  .join("\n")}

`;

  alert(details);

}}

    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition duration-300"
  >

    View Details

  </button>

</td>
{!isGuest && req.status === "Pending" && (
<td className="p-3 flex gap-3">

  <button

    onClick={() => {

      setRequirementsList(

        requirementsList.map((r) =>

          r.id === req.id

            ? {
                ...r,
                status: "Approved"
              }

            : r

        )

      );

    }}

    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold"
  >

    Approve

  </button>

  <button

    onClick={() => {

  // Update requirement status

  setRequirementsList(

    requirementsList.map((r) =>

      r.id === req.id

        ? {
            ...r,
            status: "Rejected"
          }

        : r

    )

  );

  // Release reserved equipment

  setEquipmentList((prevEquipmentList) =>

  prevEquipmentList.map((equipment) => {

    const rejectedItem = req.items.find(

      (item) =>
        item.id === equipment.id

    );

    if (rejectedItem) {

      return {

        ...equipment,

        reserved: false,

        reservedBy: ""

      };

    }

    return equipment;

  })

);

}}

    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
  >

    Reject

  </button>

</td>
)}
          </tr>

        ))}

      </tbody>

    </table>

  )}

</div>
</div>
</div>

)}
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
<div className="overflow-x-auto">
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
{!isGuest && (
  <th className="text-left p-3">
    Action
  </th>
)}
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
{!isGuest && (
  <td className="p-3">

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
)}
</tr>
))}
</tbody>
</table>
</div>
</div>
)}
</div>
</div>
</>
)
}
export default App