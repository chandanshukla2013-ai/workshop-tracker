import Select from "react-select";
import {
  auth,
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc
} from "./firebase";
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
  Package,
  ShoppingCart,
  Wrench,
  ClipboardList,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
const equipmentCategories = [

  "Motor",

  "Pump",

  "Transformer",

  "Panels",

  "Belt Materials",

  "Skat Materials",

  "Fabrication Items",

  "Others"

];

const pumpTypes = [

  "6L3 Pump",

  "T-III,2CHR",

  "T-III,3CHR",

  "T-III,5CHR",

  "T-III,6CHR",

  "T-III,7CHR",

  "T-III,8CHR",

  "T-III,9CHR",

  "T-III,10CHR",

  "T-II,5CHR",

  "T-II,6CHR",

  "T-II,9CHR",

  "T-IIA,3CHR",

  "T-IIA,5CHR",

  "T-IIA,7CHR"

];

const motorTypes = [

  "0.50 HP",
  "0.75 HP",
  "1.00 HP",
  "2.00 HP",
  "2.50 HP",
  "3.00 HP",
  "3.70 HP",
  "5.00 HP",
  "7.50 HP",
  "10.00 HP",
  "15.00 HP",
  "20.00 HP",
  "22.00 HP",
  "25.00 HP",
  "30.00 HP",
  "35.00 HP",
  "40.00 HP",
  "50.00 HP",
  "55.00 HP",
  "60.00 HP",
  "75.00 HP",
  "100.00 HP",
  "120.00 HP",
  "125.00 HP",
  "135.00 HP",
  "150.00 HP",
  "160.00 HP",
  "175.00 HP",
  "250.00 HP",
  "260.00 HP",
  "275.00 HP",
  "350.00 HP",
  "2.2 kW",
  "3 kW",
  "3.7 kW",
  "15 kW",
  "22 kW",
  "26 kW",
  "30 kW",
  "37 kW",
  "45 kW",
  "50 kW",
  "55 kW",
  "63 kW",
  "75 kW",
  "90 kW",
  "150 kW",
  "157 kW",
  "160 kW",
  "185 kW",
  "200 kW",
  "210 kW",
  "220 kW",
  "294 kW",
  "300 kW",
  "320 kW",
  "350 kW",
  "400 kW",
  "Vibrator Motor",
  "Road Header Motor"

];

const transformerTypes = [

  "500kVA",

  "1MVA",

  "2MVA",

  "5MVA",

  "10MVA"

];

const beltMaterialTypes = [

  "Gearbox",

  "Pulley",

  "Takeup Winch"

];

const skatMaterialTypes = [

  "Gearbox",

  "Pan",

  "Chain"

];

const fabricationTypes = [

  "Cutting & Welding",

  "Lathe Machine Work"

];

const receivedFromList = [

  "Sijua Colliery",

  "Bhelatand Colliery",

  "Jamadoba Colliery",

  "Digwadih Colliery",

  "6&7 Pit Colliery",

  "JCPP",

  "BCPP",

  "WTP-Sijua",

  "WTP-Jamadoba",

  "TMD-Sijua",

  "TMD-Jamadoba",

  "RS-Sijua",

  "RS-Jamadoba",

  "Workshop",

  "Store"

];

const bayList = [

  "Received Bay",

  "Overhauling Bay",

  "Repair Bay",

  "Finished Bay",

  "Fabrication Yard"

];

const statusList = [

  "Received",

  "Work Under Progress",

  "Dismantling",

  "Overhauling",

  "Repair",

  "Sent for Repair to Other Party",

  "Discarded",

  "Specification Change",

  "Completed"

];

const pumpingStationList = [

  "6 Incline Pumping Station",

  "12 Pit bottom Pumping Station",

  "12 Seam Pumping Station",

  "0' Dip Pumping Station",

  "10 Seam Pumping Station",

  "10 Seam 15's panel",

  "19dip/8L Pumping Station",

  "24dip/6L Pumping Station",

  "8 Pit 6L 210 Pumping Station",

  "Surface Pumping Station",

  "17 Seam",

  "16 Seam Pit Bottom",

  "16 Seam NOF",

  "15 Seam 29 Dip",

  "14 Seam 0 Dip",

  "12 Seam 5 Dip",

  "12 Seam 4 Dip",

  "12 Seam 39 Dip",

  "12 Seam West 30 Dip",

  "11 Seam West",

  "15 Seam SOF",

  "Surface Reservoir",

  "11 Seam West NOF",

  "Jamadoba Shaft Pumping Station",

  "Jamadoba Surface Pumping Station",

  "Digwadih Shaft Pumping Station",

  "Digwadih Surface Pumping Station",

  "6&7 Pit Surface Pumping Station"

];

const installedPumpData = [

  {
    type: "6L3 Pump",
    installedQty: 14
  },

  {
    type: "T-III,3CHR",
    installedQty: 7
  },

  {
    type: "T-III,2CHR",
    installedQty: 5
  },

  {
    type: "T-III,10CHR",
    installedQty: 5
  },

  {
    type: "T-III,9CHR",
    installedQty: 4
  },

  {
    type: "T-III,7CHR",
    installedQty: 3
  },

  {
    type: "T-III,5CHR",
    installedQty: 3
  },

  {
    type: "T-III,8CHR",
    installedQty: 3
  },

  {
    type: "T-II,3CHR",
    installedQty: 3
  },

  {
    type: "T-IIA,3CHR",
    installedQty: 1
  },

  {
    type: "T-IIA,5CHR",
    installedQty: 1
  },

  {
    type: "T-III,6CHR",
    installedQty: 1
  },

  {
    type: "T-IIA,7CHR",
    installedQty: 1
  },

  {
    type: "T-II,5CHR",
    installedQty: 1
  },

  {
    type: "T-II,9CHR",
    installedQty: 1
  },

  {
    type: "T-I,6CHR",
    installedQty: 1
  }

];

function App() {
const [equipmentList, setEquipmentList] = useState([]);
const [equipmentCategory, setEquipmentCategory] =
  useState("");
const [showPumpForm, setShowPumpForm] =
  useState(false);
const [equipmentType, setEquipmentType] =
  useState("");
const [pumpDepartment, setPumpDepartment] =
  useState("");
const [pumpingStation, setPumpingStation] =
  useState("");
const [pumpId, setPumpId] =
  useState("");
const [pumpType, setPumpType] =
  useState("");
const [previousOHDate, setPreviousOHDate] =
  useState("");
const [nextOHDate, setNextOHDate] =
  useState("");
const [showScheduleForm, setShowScheduleForm] =
  useState(false);
const [selectedDepartment, setSelectedDepartment] =
  useState("All Departments");
const [selectedStatus, setSelectedStatus] =
  useState("All");
const [status, setStatus] = useState("Received");
const [currentBay, setCurrentBay] = useState("");
const [receivedDate, setReceivedDate] = useState("");
const [workOrderNo, setWorkOrderNo] = useState("");
const [receivedFrom, setReceivedFrom] = useState("");
const [remark, setRemark] = useState("");
const [tentativeDate, setTentativeDate] = useState("");
const [completionDate, setCompletionDate] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [editIndex, setEditIndex] = useState(null);
const [editFirebaseId, setEditFirebaseId] = useState(null);
const [loading, setLoading] = useState(false);
const [darkMode, setDarkMode] = useState(false);
const [activeBay, setActiveBay] = useState("All");
const [activeMenu, setActiveMenu] = useState("Dashboard");
const [user, setUser] = useState(null);
const [role, setRole] = useState("");
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
const [excelFile, setExcelFile] = useState(null);
const [filterCategory, setFilterCategory] = useState("All");
const [filterType, setFilterType] = useState("All");
const [historySearch, setHistorySearch] = useState("");

const fetchPumpSchedule = async () => {

  const querySnapshot =
    await getDocs(
      collection(db, "pumpSchedule")
    );

  const data =
    querySnapshot.docs.map((doc) => ({
      firebaseId: doc.id,
      ...doc.data()
    }));

  setPumpScheduleList(data);

};

const fetchPumpHistory = async () => {

  const querySnapshot =
    await getDocs(
      collection(db, "pumpOHHistory")
    );

  const historyData =
    querySnapshot.docs.map((doc) => ({

      firebaseId: doc.id,

      ...doc.data()

    }));

  setHistoryList(
    historyData
  );

};

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

const fetchRequirements = async () => {

    const querySnapshot = await getDocs(

      collection(db, "requirements")

    );

    const requirementsData =
      querySnapshot.docs.map((doc) => ({

        firebaseId: doc.id,

        ...doc.data()

      }));

    setRequirementsList(requirementsData);

  };

if (user) {

  fetchEquipment();

  fetchRequirements();

  fetchPumpSchedule();

  fetchPumpHistory();

}

}, [user]);
useEffect(() => {

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

    setUser(currentUser);

    setAuthLoading(false);

  });

  return () => unsubscribe();

}, []);

const [pumpScheduleList, setPumpScheduleList] = useState([]);

const [historyList, setHistoryList] = useState([]);

const getDaysRemaining = (nextOHDate) => {

  const today = new Date();

  const nextDate = new Date(nextOHDate);

  const diffTime =
    nextDate - today;

  return Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

};
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
const handleDeleteEquipment = async (
  firebaseId
) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this equipment?"
  );

  if (!confirmDelete) {

    return;

  }

  await deleteDoc(
    doc(db, "equipment", firebaseId)
  );

  fetchEquipment();

  toast.success(
    "Equipment deleted successfully"
  );

};
const handleEditEquipment = (item, index) => {

  setIsEditing(true);

  setEditIndex(index);
  setEditFirebaseId(item.firebaseId);
  setEquipmentCategory(
    item.category || ""
  );

  setEquipmentType(
    item.name || ""
  );

  setWorkOrderNo(
    item.workOrderNo || ""
  );

  setReceivedFrom(
    item.receivedFrom || ""
  );

 const formatDateForInput = (dateStr) => {

  if (!dateStr) return "";

  if (dateStr.includes("/")) {

    const [day, month, year] =
      dateStr.split("/");

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return dateStr;

};

setReceivedDate(
  formatDateForInput(item.receivedDate)
);

setTentativeDate(
  formatDateForInput(item.tentativeDate)
);

  setCurrentBay(
    item.currentBay || "Received Bay"
  );

  setStatus(
    item.status || "Received"
  );

 

  setRemark(
    item.remark || ""
  );
console.log("Received Date:", item.receivedDate);
console.log("Tentative Date:", item.tentativeDate);
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};

const handleSavePumpSchedule = async () => {

  try {

    console.log(pumpScheduleList);

    for (const pump of pumpScheduleList) {

      console.log(
        "Pump ID:",
        pump.pumpId
      );

      console.log(
        "Firebase ID:",
        pump.firebaseId
      );

      if (!pump.firebaseId) {

        console.error(
          "Missing firebaseId",
          pump
        );

        continue;

      }

      console.log({
  firebaseId: pump.firebaseId,
  previousOHDate: pump.previousOHDate,
  nextOHDate: pump.nextOHDate
});

      await updateDoc(
        doc(
          db,
          "pumpSchedule",
          pump.firebaseId
        ),
        {
          previousOHDate:
            pump.previousOHDate,

          nextOHDate:
            pump.nextOHDate
        }
      );

    }

    toast.success(
      "Schedule saved successfully"
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to save schedule"
    );

  }

};

const handleAddEquipment = async () => {

  if (

  !equipmentCategory ||

  !equipmentType ||

  !receivedFrom ||

  !receivedDate

) {

  toast.error(
    "Please fill all mandatory fields"
  );

  return;
}
const duplicate = equipmentList.find(
  (item) =>
    item.workOrderNo === workOrderNo &&
    workOrderNo &&
workOrderNo.trim().toUpperCase() !== "NA" &&
    item.firebaseId !== editFirebaseId
);

if (duplicate) {

  const proceed = window.confirm(
    "This Work Order Number already exists. Continue?"
  );

  if (!proceed) return;

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
 const equipmentData = {

  category: equipmentCategory,

  name: equipmentType,

  workOrderNo,

  receivedFrom,

  receivedDate,

  currentBay: updatedBay || currentBay,

  status,

  tentativeDate,

  actualCompletedDate:
    status === "Completed"
      ? new Date()
          .toLocaleDateString()
      : "",

  remark,

  createdAt:
    new Date()

};

if (isEditing) {

await updateDoc(
  doc(db, "equipment", editFirebaseId),
  equipmentData
);

  fetchEquipment();
  toast.success("Equipment updated successfully");

 setIsEditing(false);
setEditIndex(null);
setEditFirebaseId(null);

} else {

  await addDoc(
    collection(db, "equipment"),
    equipmentData
  );

  fetchEquipment();
  toast.success("Equipment added successfully");
}

setEquipmentCategory("");

setEquipmentType("");

setWorkOrderNo("");

setReceivedFrom("");

setReceivedDate("");

setCurrentBay("Received Bay");

setStatus("Received");

setTentativeDate("");

setRemark("");

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
}, 
{})
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

  if (item.actualCompletedDate) {

    const completedMonth = new Date(
      item.actualCompletedDate
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

    if (
      email === "admin@workshop.com"
    ) {

      setRole("admin");

    } else {

      setRole("department");

    }

    toast.success(
      "Login successful"
    );

  } catch (error) {

    toast.error(
      "Invalid email or password"
    );

  }

};
const handleGuestLogin = async () => {

  try {

    await signInWithEmailAndPassword(
      auth,
      "guest@workshop.com",
      "guest123"
    );

    setRole("guest");

    toast.success(
      "Guest login successful"
    );

  } catch (error) {

    toast.error(
      "Guest login failed"
    );

  }

};
const handleLogout = async () => {

  try {

    await signOut(auth);
    setRole("");

    toast.success("Logged out successfully");

  } catch (error) {

    toast.error("Logout failed");

  }

};

const getPumpStatus = (nextOHDate) => {

  const today = new Date();

  today.setHours(0,0,0,0);

  const scheduleDate = new Date(nextOHDate);

  scheduleDate.setHours(0,0,0,0);

  if (scheduleDate < today) {

    return {
      text: "Overdue",
      color: "bg-red-500"
    };

  }

  if (
    scheduleDate.getMonth() === today.getMonth() &&
    scheduleDate.getFullYear() === today.getFullYear()
  ) {

    return {
      text: "Due This Month",
      color: "bg-orange-500"
    };

  }

  return {
    text: "Upcoming",
    color: "bg-green-500"
  };

};

const filteredPumpList =
  pumpScheduleList.filter((pump) => {

    const departmentMatch =
      selectedDepartment ===
        "All Departments" ||
      pump.department ===
        selectedDepartment;

    const statusMatch =
      selectedStatus === "All" ||
      getPumpStatus(
        pump.nextOHDate
      ).text === selectedStatus;

    return (
      departmentMatch &&
      statusMatch
    );

  });

if (authLoading) {
  return (
    <div className="h-screen flex items-center justify-center text-2xl font-bold">
      Loading...
    </div>
  );
}

if (!user)
  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">

  <div className="w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

    {/* Logo Section */}

    <div className="text-center mb-8">

      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-xl">

        ⚙️

      </div>

      <h1 className="text-3xl font-bold text-white mt-4">
        Central Workshop
      </h1>

      <p className="text-slate-300 text-sm mt-1">
        Equipment Management System
      </p>

    </div>

    {/* Email */}

    <input
      type="email"
      placeholder="Enter Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full h-12 px-4 mb-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Password */}

    <input
      type="password"
      placeholder="Enter Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full h-12 px-4 mb-6 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Login Button */}

    <button
      onClick={handleLogin}
      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all duration-300"
    >
      Login
    </button>

    {/* Guest Login */}

    <button
      onClick={handleGuestLogin}
      className="w-full h-12 mt-3 rounded-xl border border-slate-400 text-slate-200 hover:bg-white/10 transition-all duration-300 font-medium"
    >
      Login as Guest
    </button>

    {/* Footer */}

    <div className="mt-6 text-center">

      <p className="text-xs text-slate-400">
        Version 1.0
      </p>

      <p className="text-xs text-slate-500 mt-1">
        Workshop Equipment Management Portal - Jharia Division
      </p>

    </div>

  </div>

</div>

  );

const handleSubmitRequirement = async () => {

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

    expectedDeliveryDate: "",

    approvedBy: "",

    rejectedBy: "",

    actionDate: "",

    dispatchDate: ""

  };

setRequirementsList([
  ...requirementsList,
  newRequirement
]);

// Save to Firebase
await addDoc(

  collection(db, "requirements"),

  newRequirement

);

setEquipmentList(

  equipmentList.map((equipment) => {

    const selectedItem = cartItems.find(

      (cartItem) =>
        cartItem.firebaseId === equipment.firebaseId

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
cartItems.forEach(async (item) => {

  if (item.firebaseId) {

    await updateDoc(

      doc(db, "equipment", item.firebaseId),

      {

        reserved: true,

        reservedBy: newRequirement.reqNo

      }

    );

  }

});
  // Clear form after submit

  setCartItems([]);

  setRequestDepartment("");

  setRequestPurpose("");

  setRequestPriority("Normal");

  setRequiredDate("");

  setRequestRemark("");

  alert("Requirement Submitted Successfully!");

};

const handleExcelUpload = async () => {

  if (!excelFile) {

    alert("Please select an Excel file.");

    return;

  }

  const reader = new FileReader();

  reader.readAsArrayBuffer(excelFile);

  reader.onload = async (e) => {

    const data = new Uint8Array(
      e.target.result
    );

    const workbook = XLSX.read(data, {
      type: "array"
    });

    const sheetName =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    const jsonData =
  XLSX.utils.sheet_to_json(worksheet, {
    raw: false
  });

for (const item of jsonData) {

  await addDoc(
    collection(db, "equipment"),
    {
      category: item["Equipment Category"] || "",
      name: item["Equipment Type"] || "",
      workOrderNo: item["Work Order No"] || "",
      receivedFrom: item["Received From"] || "",
      receivedDate: item["Received Date"] || "",
      currentBay: item["Current Bay"] || "Received Bay",
      status: item["Status"] || "Received",
      tentativeDate:
        item["Tentative Completion Date"] || "",
      actualCompletedDate:
        item["Actual Completed Date"] || "",
      remark: item["Remark"] || "",

      reserved: false,
      reservedBy: ""
    }
  );

}

alert(
  "Equipment uploaded successfully!"
);

fetchEquipment();

  };

};
const getEquipmentTypes = () => {

  switch (equipmentCategory) {

    case "Pump":
      return pumpTypes;

    case "Motor":
      return motorTypes;

    case "Transformer":
      return transformerTypes;

    case "Belt Materials":
      return beltMaterialTypes;

    case "Skat Materials":
      return skatMaterialTypes;

    case "Fabrication Items":
      return fabricationTypes;

    default:
      return [];

  }

};
const pumpSummary =
  installedPumpData.map(
    (pump) => {

      const filtered =
        equipmentList.filter(

          (item) =>

            item.category === "Pump" &&

            item.name === pump.type

        );

      const receivedBay =
        filtered.filter(
          (item) =>
            item.currentBay ===
            "Received Bay"
        ).length;

      const overhaulingBay =
        filtered.filter(
          (item) =>
            item.currentBay ===
            "Overhauling Bay"
        ).length;

      const finishedBay =
        filtered.filter(
          (item) =>
            item.currentBay ===
            "Finished Bay"
        ).length;

      return {

        type: pump.type,

        installedQty:
          pump.installedQty,

        receivedBay,

        overhaulingBay,

        finishedBay,

        availableQty:
          receivedBay +
          overhaulingBay +
          finishedBay,

        alert:
          receivedBay +
            overhaulingBay +
            finishedBay <
          2

      };

    }
  );
const downloadExcelTemplate = () => {

  const templateData = [

    {

      "Equipment Category": "Pump",

      "Equipment Type": "T-III,3CHR",

      "Work Order No": "WO-101",

      "Received From": "Jamadoba Colliery",

      "Received Date": "2026-05-27",

      "Current Bay": "Received Bay",

      "Status": "Received",

      "Tentative Completion Date": "2026-06-10",

      "Actual Completed Date": "",

      "Remark": "Sample Entry"

    }

  ];

  const worksheet =
    XLSX.utils.json_to_sheet(
      templateData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Equipment Template"
  );

  XLSX.writeFile(
    workbook,
    "Equipment_Upload_Template.xlsx"
  );

};
const criticalEquipmentText = pumpSummary
  .filter((pump) => pump.alert)
  .map(
    (pump) =>
      `${pump.type} - Installed: ${pump.installedQty} | Available: ${pump.availableQty}`
  )
  .join("   🔴   ");
  
const handleAddPump = async () => {

  if (
    !pumpDepartment ||
    !pumpingStation ||
    !pumpId ||
    !pumpType ||
    !previousOHDate ||
    !nextOHDate
  ) {

    toast.error(
      "Please fill all fields"
    );

    return;

  }

  const duplicatePump =
    pumpScheduleList.find(
      (item) =>
        item.pumpId.trim()
          .toUpperCase() ===
        pumpId.trim()
          .toUpperCase()
    );

  if (duplicatePump) {

    toast.error(
      "Pump ID already exists"
    );

    return;

  }

  const pumpData = {

    department: pumpDepartment,

    pumpingStation,

    pumpId,

    pumpType,

    previousOHDate,

    nextOHDate

  };

  await addDoc(
  collection(db, "pumpSchedule"),
  pumpData
);

  setPumpScheduleList([
    ...pumpScheduleList,
    pumpData
  ]);

  toast.success(
    "Pump Added Successfully"
  );

  setPumpDepartment("");
  setPumpingStation("");
  setPumpId("");
  setPumpType("");
  setPreviousOHDate("");
  setNextOHDate("");

  setShowPumpForm(false);

};

const currentYear =
  new Date().getFullYear();

const currentMonth =
  new Date().getMonth();

const totalOHCompleted =
  historyList.length;

const completedThisYear =
  historyList.filter((item) => {

    const completedDate =
      new Date(item.completedOn);

    return (
      completedDate.getFullYear() ===
      currentYear
    );

  }).length;

const completedThisMonth =
  historyList.filter((item) => {

    const completedDate =
      new Date(item.completedOn);

    return (
      completedDate.getFullYear() ===
        currentYear &&
      completedDate.getMonth() ===
        currentMonth
    );

  }).length;

const completedLast30Days =
  historyList.filter((item) => {

    const completedDate =
      new Date(item.completedOn);

    const diffDays =
      (new Date() - completedDate) /
      (1000 * 60 * 60 * 24);

    return diffDays <= 30;

  }).length;

const filteredHistory =
  historyList.filter((item) =>

    item.pumpId
      ?.toLowerCase()
      .includes(
        historySearch.toLowerCase()
      )

  );

const exportHistoryToExcel = () => {

  const exportData =
    filteredHistory.map((item) => ({

      Pump_ID:
        item.pumpId,

      Department:
        item.department,

      Pumping_Station:
        item.pumpingStation,

      Pump_Type:
        item.pumpType,

      Previous_OH_Date:
        item.previousOHDate,

      Completed_On:
        item.completedOn,

      Completed_By:
        item.completedBy

    }));

  const worksheet =
    XLSX.utils.json_to_sheet(
      exportData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "OH History"
  );

  const excelBuffer =
    XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array"
      }
    );

  const data = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    }
  );

  saveAs(
    data,
    "Pump_OH_History.xlsx"
  );

  toast.success(
    "History exported successfully"
  );

};

const handleDeletePump = async (pump) => {

  const confirmDelete =
    window.confirm(
      `Delete ${pump.pumpId}?`
    );

  if (!confirmDelete)
    return;

  try {

    await deleteDoc(
      doc(
        db,
        "pumpSchedule",
        pump.firebaseId
      )
    );

    await fetchPumpSchedule();

    toast.success(
      "Pump deleted successfully"
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to delete pump"
    );

  }

};

const equipmentTypeOptions =
  getEquipmentTypes().map(
    (type) => ({
      value: type,
      label: type
    })
  );

return (
  <div>
    <Toaster position="top-right" />
    <div
      className={`flex flex-col lg:flex-row min-h-screen transition duration-500 ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-slate-100 to-blue-100 text-slate-900"
      }`}
    >

{/* Sidebar */}

<div className="w-full lg:w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col lg:min-h-screen">

<div className="p-3 border-b border-slate-800">

  <div className="flex items-center gap-3">

    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
      ⚙
    </div>

    <div>

      <h1 className="text-base font-bold">
        Workshop Tracker
      </h1>

      <p className="text-xs text-slate-400">
        Management System
      </p>

    </div>

  </div>

</div>

<div className="border-b border-slate-800 mb-6"></div>
<ul className="space-y-1 px-2 flex-1">

<li
  onClick={() => setActiveMenu("Dashboard")}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium text-[15px] ${
    activeMenu === "Dashboard"
      ? "bg-slate-800 border border-blue-500 shadow-lg shadow-blue-900/30"
      : "text-slate-300 hover:bg-slate-800"
  }`}
>
  <LayoutDashboard size={18} />
  Dashboard
</li>

{role === "admin" && (
<li
  onClick={() => setActiveMenu("Equipment")}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium text-[15px] ${
    activeMenu === "Equipment"
      ? "bg-slate-800 border border-blue-500 shadow-lg shadow-blue-900/30"
      : "text-slate-300 hover:bg-slate-800"
  }`}
>
  <Package size={18} />
  Equipment
</li>
)}
<li
  onClick={() => setActiveMenu("Overhauling")}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium text-[15px] ${
    activeMenu === "Overhauling"
      ? "bg-slate-800 border border-blue-500 shadow-lg shadow-blue-900/30"
      : "text-slate-300 hover:bg-slate-800"
  }`}
>
  <Wrench size={18} />
  Overhauling
</li>
<li
  onClick={() => setActiveMenu("Requirements")}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium text-[15px] ${
    activeMenu === "Requirements"
      ? "bg-slate-800 border border-blue-500 shadow-lg shadow-blue-900/30"
      : "text-slate-300 hover:bg-slate-800"
  }`}
>
  <ShoppingCart size={18} />
  Requirements
</li>

<li
  onClick={() => setActiveMenu("Reports")}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium text-[15px] ${
    activeMenu === "Reports"
      ? "bg-slate-800 border border-blue-500 shadow-lg shadow-blue-900/30"
      : "text-slate-300 hover:bg-slate-800"
  }`}
>
<FileText size={18} />
  Reports
</li>
</ul>

<div className="mt-auto border-t border-slate-800 p-4">

  <div className="mb-4">

    <p className="text-xs text-slate-500">
      Logged in as
    </p>

    <p className="text-sm font-semibold text-white truncate">
      {user?.email}
    </p>

  </div>

  <div className="border-t border-slate-800 pt-3">

    <p className="text-center text-xs text-slate-500">
      Workshop Tracker
    </p>

    <p className="text-center text-[11px] text-slate-600">
      Version 1.0
    </p>

  </div>

</div>
</div>

{/* Main Content */}
<div className="flex-1 p-4 lg:p-6 overflow-auto">
<div className="flex justify-between items-start mb-4">
<div>
<h2 className={`text-2xl font-bold ${
darkMode ? "text-white" : "text-slate-800"
}`}>
{
  activeMenu === "Dashboard"
    ? "Workshop Dashboard"

    : activeMenu === "Equipment"
    ? "Equipment Management"

    : activeMenu === "Overhauling"
    ? "Pump Overhauling Management"

    : activeMenu === "Requirements"
    ? "Requirements Management"

    : activeMenu === "Reports"
    ? "Reports & Analytics"

    : ""
}
</h2>
<p className={`mt-1 ${
darkMode ? "text-slate-300" : "text-slate-500"
}`}>
{
  activeMenu === "Dashboard"

    ? "Monitor and manage workshop equipment efficiently"

    : activeMenu === "Equipment"

    ? "Add and manage workshop equipment workflow"

    : activeMenu === "Overhauling"

    ? "Manage pump overhauling schedules and history"

    : activeMenu === "Requirements"

    ? "Manage workshop equipment requirements and approvals"

    : activeMenu === "Reports"

    ? "Track equipment reports and workflow analytics"

    : ""
}
</p>
</div>
<div className="absolute top-4 right-6 flex items-center gap-2">

  <button
    onClick={() => setDarkMode(!darkMode)}
    className="bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow font-semibold text-xs"
  >
    {darkMode ? "☀ Light" : "🌙 Dark"}
  </button>

  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg shadow font-semibold text-xs"
  >
    Logout
  </button>

</div>
</div>

{activeMenu === "Dashboard" && (
  <>
<div className="mb-4 overflow-hidden">
  <marquee
    scrollamount="4"
    className="text-red-600 font-semibold text-xs"
  >
    🚨 Critical Equipment Alert :
    {criticalEquipmentText || " No Critical Equipment"}
  </marquee>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
<div
className={`backdrop-blur-lg p-4 rounded-2xl shadow-lg hover:scale-102 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">
Total Equipment
</h3>
<p className="text-3xl font-extrabold text-black-600 mt-1">
{equipmentList.length}
</p>
</div>
<div
className={`backdrop-blur-lg p-4 rounded-2xl shadow-lg hover:scale-102 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">
📥 Received Bay
</h3>
<p className="text-3xl font-extrabold text-blue-500 mt-1">
{
equipmentList.filter(
(item) =>
(item.currentBay || "Received Bay") === "Received Bay"
).length
}
</p>
</div>
<div
className={`backdrop-blur-lg p-4 rounded-2xl shadow-lg hover:scale-102 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">
🛠 Overhauling Bay
</h3>
<p className="text-3xl font-extrabold text-yellow-600 mt-1">
{
equipmentList.filter(
(item) => item.currentBay === "Overhauling Bay"
).length
}
</p>
</div>
<div
className={`backdrop-blur-lg p-4 rounded-2xl shadow-lg hover:scale-102 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">
✅ Finished Bay
</h3>
<p className="text-3xl font-extrabold text-green-600 mt-1">
{
equipmentList.filter(
(item) => item.currentBay === "Finished Bay"
).length
}
</p>
</div>
<div
className={`backdrop-blur-lg p-4 rounded-2xl shadow-lg hover:scale-102 transition duration-300 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">
🚨 Delayed Equipment
</h3>
<p className="text-3xl font-extrabold text-red-500 mt-1">
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
<div className="grid grid-cols-1 gap-4 mt-4">

<div
  className={`p-4 rounded-2xl shadow-xl ${
    darkMode
      ? "bg-slate-800"
      : "bg-white/80 backdrop-blur-lg"
  }`}
>

<div className="flex items-center justify-between mb-3">

<h2
  className={`text-lg font-semibold ${
    darkMode
      ? "text-white"
      : "text-slate-800"
  }`}
>
  🛠 Pump Availability Summary
</h2>

<span className="text-xs text-slate-500">
  Live Workshop Availability
</span>

</div>
<div className="overflow-x-auto overflow-y-auto max-h-[350px] rounded-2xl">

<table className="w-full text-xs">
<thead
  className={`sticky top-0 z-10 ${
    darkMode
      ? "bg-slate-800"
      : "bg-white"
  }`}
>

<tr
  className={`border-b ${
    darkMode
      ? "border-slate-700"
      : "border-slate-200"
  }`}
>

<th className="text-left py-2 px-2">
  Pump Type
</th>

<th className="text-center py-2 px-2">
  Installed Qty
</th>

<th className="text-center py-2 px-2">
  Received
</th>

<th className="text-center py-2 px-2">
  Overhauling
</th>

<th className="text-center py-2 px-2">
  Finished
</th>

<th className="text-center py-2 px-2">
  Available Qty
</th>

<th className="text-center py-2 px-2">
  Alert
</th>

</tr>

</thead>

<tbody>

{pumpSummary.map((pump, index) => (

<tr
  key={index}
  className={`border-b transition duration-300 hover:bg-slate-100/50 ${
    darkMode
      ? "border-slate-700 hover:bg-slate-700/30"
      : "border-slate-200"
  }`}
>

<td className="py-2 px-2 font-semibold">
  {pump.type}
</td>

<td className="text-center py-2 px-2 font-bold">

  {pump.installedQty}

</td>

<td className="text-center py-2 px-2 text-blue-600 font-bold">
  {pump.receivedBay}
</td>

<td className="text-center py-2 px-2 text-orange-500 font-bold">
  {pump.overhaulingBay}
</td>

<td className="text-center py-2 px-2 text-green-600 font-bold">
  {pump.finishedBay}
</td>

<td className="text-center py-2 px-2 font-bold text-indigo-600">

  {pump.availableQty}

</td>

<td className="text-center py-2 px-2">

{pump.alert ? (

<span className="bg-red-500 text-white px-2 py-0.5 rounded-xl text-xs font-bold">
  Critical
</span>

) : (

<span className="bg-green-500 text-white px-2 py-0.5 rounded-xl text-xs font-bold">
  Normal
</span>

)}

</td>

</tr>

))}

</tbody>

</table>

</div>
</div>
</div>

<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
{/* Department Analytics */}

<div
  className={`mt-6 p-4 rounded-2xl shadow-xl ${
    darkMode
      ? "bg-slate-800"
      : "bg-white/80 backdrop-blur-lg"
  }`}
>

  <h2
    className={`text-lg font-semibold mb-6 ${
      darkMode ? "text-white" : "text-slate-800"
    }`}
  >
    🏢 Department-wise Equipment Received
  </h2>

  <div className="w-full h-[200px]">

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
  className={`mt-6 p-4 rounded-2xl shadow-xl ${
    darkMode
      ? "bg-slate-800"
      : "bg-white/80 backdrop-blur-lg"
  }`}
>

  <h2
    className={`text-lg font-semibold mb-6 ${
      darkMode ? "text-white" : "text-slate-800"
    }`}
  >
    📅 Monthly Equipment Trend
  </h2>

  <div className="w-full h-[200px]">

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
className={`max-w-[1600px] backdrop-blur-lg p-4 rounded-2xl shadow-xl mb-4 border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<h3 className={`text-xl font-semibold mb-4 ${
darkMode ? "text-white" : "text-slate-800"
}`}>
Add New Equipment
</h3>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
<div>
<label
className={`block mb-2 text-xs font-semibold uppercase tracking-wide ${
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
className={`w-full h-11 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div>
<label
className={`block mb-2 text-xs font-semibold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Received Date
</label>
<input
type="date"
value={receivedDate}
onChange={(e) => setReceivedDate(e.target.value)}
className={`w-full h-11 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>

<div>

<label
className={`block mb-2 text-xs font-semibold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
  RECEIVED FROM
</label>

<select

  value={receivedFrom}

  onChange={(e) =>
    setReceivedFrom(
      e.target.value
    )
  }

  className="w-full h-11 px-3 rounded-lg border text-sm text-black"
>

<option value="">
  Select Source
</option>

{receivedFromList.map(
  (source, index) => (

    <option
      key={index}
      value={source}
    >

      {source}

    </option>

  )
)}

</select>

</div>

<div>

<label className={`block mb-2 text-xs font-semibold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}>
  EQUIPMENT CATEGORY
</label>

<select

  value={equipmentCategory}

  onChange={(e) => {

    setEquipmentCategory(
      e.target.value
    );

    setEquipmentType("");

  }}

  className="w-full h-11 px-3 rounded-lg border text-sm text-black"
>

<option value="">
  Select Category
</option>

{equipmentCategories.map(
  (category, index) => (

    <option
      key={index}
      value={category}
    >

      {category}

    </option>

  )
)}

</select>

</div>
<div>

<label className={`block mb-2 text-xs font-semibold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}>
  EQUIPMENT TYPE
</label>

<Select
  options={equipmentTypeOptions}
  value={
    equipmentTypeOptions.find(
      (option) =>
        option.value ===
        equipmentType
    ) || null
  }
  onChange={(selected) =>
    setEquipmentType(
      selected?.value || ""
    )
  }
  placeholder="Search Equipment Type..."
  isClearable
/>

</div>

<div>
<label
className={`block mb-2 text-xs font-semibold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Tentative Completion Date
</label>
<input
type="date"
value={tentativeDate}
onChange={(e) => setTentativeDate(e.target.value)}
className={`w-full h-11 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>
<div className="xl:col-span-4">
<label
className={`block mb-2 text-sm font-bold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
Remark
</label>
<textarea
placeholder="Please enter any remarks or special instructions regarding the equipment"
value={remark}
onChange={(e) => setRemark(e.target.value)}
rows="1"
className={`w-full p-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition border resize-none ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
</div>

<div>

<label
className={`block mb-2 text-xs font-semibold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}
>
  Current Bay
</label>

<select

  value={currentBay}

  onChange={(e) =>
    setCurrentBay(
      e.target.value
    )
  }

  className="w-full h-11 px-3 rounded-lg border text-sm text-black"
>

{bayList.map(
  (bay, index) => (

    <option
      key={index}
      value={bay}
    >

      {bay}

    </option>

  )
)}

</select>

</div>

<div>

<label className={`block mb-2 text-xs font-semibold uppercase tracking-wide ${
darkMode ? "text-slate-300" : "text-slate-600"
}`}>
  Status
</label>

<select

  value={status}

  onChange={(e) => {

    setStatus(
      e.target.value
    );

    // Auto bay update

    if (
      e.target.value ===
      "Completed"
    ) {

      setCurrentBay(
        "Finished Bay"
      );

    }

    else if (
      e.target.value ===
      "Overhauling"
    ) {

      setCurrentBay(
        "Overhauling Bay"
      );

    }

  }}

  className="w-full h-11 px-3 rounded-lg border text-sm text-black"
>

{statusList.map(
  (statusItem, index) => (

    <option
      key={index}
      value={statusItem}
    >

      {statusItem}

    </option>

  )
)}

</select>

</div>

</div>
{role === "admin" && (
<div className="mt-4 flex flex-wrap items-center gap-3">

  {/* Save Equipment */}

  <div>

    <button

      onClick={handleAddEquipment}

      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 h-9 rounded-lg text-sm"

    >

      {

        loading

          ? "Saving..."

          : isEditing

          ? "Update Equipment"

          : "Save Equipment"

      }

    </button>

  </div>

  {/* Excel Management */}

  <div className="flex flex-wrap items-center gap-2">


      {/* Choose File */}

      <label

        className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 h-10 rounded-xl flex items-center cursor-pointer transition duration-300 text-sm font-medium shadow-sm"

      >

        📂 Choose Excel File

        <input

          type="file"

          accept=".xlsx, .xls"

          onChange={(e) =>
            setExcelFile(e.target.files[0])
          }

          className="hidden"

        />

      </label>

      {/* Upload Button */}

      <button

        onClick={handleExcelUpload}

        disabled={!excelFile}

        className={`px-4 h-9 rounded-lg font-medium text-sm transition duration-300 text-white ${
          excelFile
            ? "bg-green-600 hover:bg-green-700 shadow-sm"
            : "bg-slate-400 cursor-not-allowed"
        }`}

      >

        📤 Upload

      </button>

      {/* Download Template */}

      <button

        onClick={downloadExcelTemplate}

        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 h-9 rounded-lg font-medium text-sm transition duration-300 shadow-sm"

      >

        📥 Download Template

      </button>

    {/* Selected File */}

    {excelFile && (

      <div className="mt-3 inline-flex items-center bg-emerald-100 text-emerald-700 px-3 py-2 rounded-xl text-xs font-medium">

        ✅ {excelFile.name}

      </div>

    )}
         
  </div>

</div>
)}
{isEditing && (
  <button
    onClick={() => {

      setIsEditing(false);
      setActiveMenu("Reports");
      setEditIndex(null);

      setEquipmentType("");
      setEquipmentCategory("");

      setReceivedDate("");
      setWorkOrderNo("");
      setReceivedFrom("");
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





{activeMenu === "Overhauling" && (

<div
  className={`p-6 rounded-2xl shadow-xl ${
    darkMode
      ? "bg-slate-800"
      : "bg-white/80 backdrop-blur-lg"
  }`}
>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

  <div className="bg-blue-600 text-white rounded-xl p-4 shadow-lg">
    <p className="text-sm opacity-90">
      Total Pumps
    </p>
<h3 className="text-3xl font-bold mt-2">
  {filteredPumpList.length}
</h3>
  </div>

  <div className="bg-amber-500 text-white rounded-xl p-4 shadow-lg">
    <p className="text-sm opacity-90">
      Due This Month
    </p>
<h3 className="text-3xl font-bold mt-2">
  {
filteredPumpList.filter(
  (pump) =>
    getPumpStatus(
      pump.nextOHDate
    ).text === "Due This Month"
).length
  }
</h3>
  </div>

  <div className="bg-red-500 text-white rounded-xl p-4 shadow-lg">
    <p className="text-sm opacity-90">
      Overdue
    </p>
<h3 className="text-3xl font-bold mt-2">
  {
    filteredPumpList.filter(
  (pump) =>
    getPumpStatus(
      pump.nextOHDate
    ).text === "Overdue"
).length
  }
</h3>
  </div>

  <div className="bg-green-600 text-white rounded-xl p-4 shadow-lg">
    <p className="text-sm opacity-90">
      Upcoming
    </p>
<h3 className="text-3xl font-bold mt-2">
  {
filteredPumpList.filter(
  (pump) =>
    getPumpStatus(
      pump.nextOHDate
    ).text === "Upcoming"
).length
  }
</h3>
  </div>

</div>
<div
  className={`p-4 rounded-xl mb-6 ${
    darkMode
      ? "bg-slate-700"
      : "bg-slate-100"
  }`}
>

  <div className="flex flex-wrap items-center gap-4">

    <div>

      <label className="block text-xs font-medium mb-1">
        Department
      </label>

<select
  value={selectedDepartment}
  onChange={(e) =>
    setSelectedDepartment(e.target.value)
  }
  className="h-9 px-3 rounded-lg border text-sm text-black"
>
        <option>All Departments</option>
        <option>Sijua Colliery</option>
        <option>Bhelatand Colliery</option>
        <option>Jamadoba Colliery</option>
        <option>Digwadih Colliery</option>
        <option>6&7 Pit Colliery</option>
      </select>

    </div>

    <div>

      <label className="block text-xs font-medium mb-1">
        Status
      </label>

<select
  value={selectedStatus}
  onChange={(e) =>
    setSelectedStatus(e.target.value)
  }
  className="h-9 px-3 rounded-lg border text-sm text-black"
>

  <option value="All">
    All Status
  </option>

  <option value="Upcoming">
    Upcoming
  </option>

  <option value="Due This Month">
    Due This Month
  </option>

  <option value="Overdue">
    Overdue
  </option>

</select>

</div>

    <div>

      <label className="block text-xs font-medium mb-1">
        Year
      </label>

      <select
        className="h-9 px-3 rounded-lg border text-sm text-black"
      >
        <option>2026</option>
        <option>2027</option>
        <option>2028</option>
      </select>

    </div>


<button
  onClick={handleSavePumpSchedule}
  className="bg-green-600 hover:bg-green-700 text-white px-4 h-9 rounded-lg text-sm font-medium shadow-md transition duration-300"
>
  💾 Save Schedule
</button>
  </div>

</div>

<div
  className={`rounded-xl overflow-hidden shadow-lg ${
    darkMode
      ? "bg-slate-800"
      : "bg-white"
  }`}
>

  <div className="overflow-x-auto">

    <table className="w-full border-collapse">

      <thead>

        <tr
          className={`text-xs uppercase ${
            darkMode
              ? "bg-slate-700 text-white"
              : "bg-slate-200 text-slate-800"
          }`}
        >
<th className="px-3 py-3 text-left">
  Department
</th>

<th className="px-3 py-3 text-left">
  Pumping Station
</th>

<th className="px-3 py-3 text-left">
  Pump ID
</th>

<th className="px-3 py-3 text-left">
  Pump Type
</th>

<th className="px-3 py-3 text-center">
  Previous OH Date
</th>

<th className="px-3 py-3 text-center">
  Next OH Date
</th>

<th className="px-3 py-2 text-xs text-center">
  Days Remaining
</th>

<th className="px-3 py-3 text-center">
  Status
</th>

<th className="px-3 py-3 text-center">
  Action
</th>

        </tr>

      </thead>

<tbody>

{pumpScheduleList
.filter((pump) => {

  const departmentMatch =
    selectedDepartment ===
      "All Departments" ||
    pump.department ===
      selectedDepartment;

  const statusMatch =
    selectedStatus === "All" ||

    getPumpStatus(
      pump.nextOHDate
    ).text === selectedStatus;

  return (
    departmentMatch &&
    statusMatch
  );

})

.map((pump, index) => (

<tr
  key={index}
  className={`border-b transition duration-200

  ${
    getPumpStatus(
      pump.nextOHDate
    ).text === "Overdue"

      ? darkMode
        ? "bg-red-900/30 border-red-700"
        : "bg-red-100 border-red-300"

      : getPumpStatus(
          pump.nextOHDate
        ).text === "Due This Month"

      ? darkMode
        ? "bg-orange-900/20 border-orange-700"
        : "bg-orange-50 border-orange-300"

      : darkMode
      ? "border-slate-700 hover:bg-slate-700/30"
      : "border-slate-200 hover:bg-slate-50"

  }`}
>

  <td className="px-3 py-2 text-xs">
    {pump.department}
  </td>

  <td className="px-3 py-2 text-xs">
    {pump.pumpingStation}
  </td>

  <td className="px-3 py-2 text-xs">
    {pump.pumpId}
  </td>

  <td className="px-3 py-2 text-xs">
    {pump.pumpType}
  </td>

<td className="px-3 py-2 text-center">

  <input
    type="date"
    value={pump.previousOHDate}
    className="border rounded px-2 py-1 text-xs w-[130px] text-black"
    readOnly
  />

</td>

<td className="px-3 py-2 text-center">

<input
  type="date"
  value={pump.nextOHDate}
  onChange={(e) => {

    const updatedList = [...pumpScheduleList];

    updatedList[index].nextOHDate =
      e.target.value;

    setPumpScheduleList(updatedList);

  }}
  className="border rounded px-2 py-1 text-xs w-[130px] text-black"
/>

</td>

<td className="px-3 py-2 text-center">

  <span
    className={`px-2 py-1 rounded-lg text-xs font-semibold

    ${
      getDaysRemaining(
        pump.nextOHDate
      ) < 0

        ? "bg-red-100 text-red-700"

        : getDaysRemaining(
            pump.nextOHDate
          ) <= 30

        ? "bg-orange-100 text-orange-700"

        : "bg-green-100 text-green-700"

    }`}
  >

{getDaysRemaining(
  pump.nextOHDate
) < 0

  ? `${Math.abs(
      getDaysRemaining(
        pump.nextOHDate
      )
    )} Days Overdue`

  : `${getDaysRemaining(
      pump.nextOHDate
    )} Days Left`
}

  </span>

</td>

<td className="px-3 py-2 text-center">

  <span
    className={`text-white px-2 py-1 rounded-lg text-[10px] font-medium ${
      getPumpStatus(
        pump.nextOHDate
      ).color
    }`}
  >

    {
      getPumpStatus(
        pump.nextOHDate
      ).text
    }

  </span>

</td>

{role === "admin" && (
<td className="px-3 py-2 text-center">

  <button
    onClick={async () => {
      const confirmComplete = window.confirm(
  "Mark overhauling as completed?"
);

if (!confirmComplete) return;

const today =
  new Date()
    .toISOString()
    .split("T")[0];

const nextYear =
  new Date();

nextYear.setFullYear(
  nextYear.getFullYear() + 1
);

const nextOHDate =
  nextYear
    .toISOString()
    .split("T")[0];

await addDoc(
  collection(db, "pumpOHHistory"),
  {
    pumpId: pump.pumpId,
    department: pump.department,
    pumpingStation: pump.pumpingStation,
    pumpType: pump.pumpType,

    previousOHDate:
      pump.previousOHDate,

    completedOn: today,

    completedBy:
      user?.email || "Admin",

    createdAt:
      new Date()
  }
);

await updateDoc(
  doc(
    db,
    "pumpSchedule",
    pump.firebaseId
  ),
  {
    previousOHDate: today,
    nextOHDate: nextOHDate
  }
);

await fetchPumpSchedule();
await fetchPumpHistory();

toast.success(
  "Overhauling Completed"
);
    }}

     className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 h-7 rounded-lg text-[11px] font-medium"

  >

    ✓ OH Done

  </button>

<button
  onClick={() =>
    handleDeletePump(pump)
  }
  className="mt-1 bg-red-600 hover:bg-red-700 text-white px-2 h-7 rounded-lg text-[11px] font-medium"
>
  🗑 Delete
</button>

</td>
)}
</tr>
))}

</tbody>

    </table>

  </div>

</div>

<div className="mt-8 mb-4">

  <h3 className="text-xl font-bold">
    Overhauling History
  </h3>

  <p className="text-sm text-slate-500">
    Completed pump overhauling records
  </p>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

  <div className="bg-blue-600 text-white rounded-xl p-4 shadow-lg">
    <p className="text-sm opacity-90">
      Total OH Completed
    </p>
    <h3 className="text-3xl font-bold mt-2">
      {totalOHCompleted}
    </h3>
  </div>

  <div className="bg-green-600 text-white rounded-xl p-4 shadow-lg">
    <p className="text-sm opacity-90">
      Completed This Year
    </p>
    <h3 className="text-3xl font-bold mt-2">
      {completedThisYear}
    </h3>
  </div>

  <div className="bg-amber-500 text-white rounded-xl p-4 shadow-lg">
    <p className="text-sm opacity-90">
      Completed This Month
    </p>
    <h3 className="text-3xl font-bold mt-2">
      {completedThisMonth}
    </h3>
  </div>

  <div className="bg-purple-600 text-white rounded-xl p-4 shadow-lg">
    <p className="text-sm opacity-90">
      Last 30 Days
    </p>
    <h3 className="text-3xl font-bold mt-2">
      {completedLast30Days}
    </h3>
  </div>

</div>

<div className="mb-4">

  <input
    type="text"
    placeholder="Search Pump ID..."
    value={historySearch}
    onChange={(e) =>
      setHistorySearch(
        e.target.value
      )
    }
    className="w-full md:w-80 h-10 px-4 rounded-xl border border-slate-300 text-black shadow-xs"
  />

<button
  onClick={exportHistoryToExcel}
  className="bg-white-600 hover:bg-green-700 text-black px-4 h-10 rounded-xl font-medium shadow-xs"
>
  📥 Export History
</button>

</div>


<div
  className={`rounded-xl overflow-hidden shadow-lg ${
    darkMode
      ? "bg-slate-800"
      : "bg-white"
  }`}
>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr
          className={`text-xs uppercase ${
            darkMode
              ? "bg-slate-700 text-white"
              : "bg-slate-200 text-slate-800"
          }`}
        >

          <th className="px-3 py-3 text-left">
            Pump ID
          </th>

          <th className="px-3 py-3 text-left">
            Department
          </th>

          <th className="px-3 py-3 text-center">
            Completed On
          </th>

          <th className="px-3 py-3 text-left">
            Completed By
          </th>

        </tr>

      </thead>

      <tbody>

        {filteredHistory
          .slice()
          .reverse()
          .map((item) => (

            <tr
              key={item.firebaseId}
              className="border-b"
            >

              <td className="px-3 py-2 text-xs">
                {item.pumpId}
              </td>

              <td className="px-3 py-2 text-xs">
                {item.department}
              </td>

              <td className="px-3 py-2 text-xs text-center">
                {item.completedOn}
              </td>

              <td className="px-3 py-2 text-xs">
                {item.completedBy}
              </td>

            </tr>

          ))}

      </tbody>

    </table>

  </div>

</div>

{role === "admin" && (
<div className="flex justify-end mt-4">

<button
  onClick={() =>
    setShowPumpForm(true)
  }
  className="bg-grey-600 hover:bg-green-700 text-black px-5 h-10 rounded-xl font-small shadow-md transition duration-300"
>
  + Add New Pump
</button>

</div>
)}

{showPumpForm && (

<div
  className={`mt-4 p-4 rounded-xl shadow-lg ${
    darkMode
      ? "bg-slate-700"
      : "bg-slate-100"
  }`}
>

  <div className="flex justify-between items-center">

    <h3 className="text-lg font-semibold">
      Add New Pump
    </h3>

    <button
      onClick={() =>
        setShowPumpForm(false)
      }
      className="text-red-500 font-semibold"
    >
      ✕ Close
    </button>

  </div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">

  <div>

    <label className="block text-xs font-medium mb-1">
      Department
    </label>

<select
  value={pumpDepartment}
  onChange={(e) =>
    setPumpDepartment(e.target.value)
  }
  className="w-full h-9 px-3 rounded-lg border text-sm text-black"
>
      <option>Select Department</option>
      <option>Sijua Colliery</option>
      <option>Bhelatand Colliery</option>
      <option>Jamadoba Colliery</option>
      <option>Digwadih Colliery</option>
      <option>6&7 Pit Colliery</option>
    </select>

  </div>

  <div>

    <label className="block text-xs font-medium mb-1">
      Pumping Station
    </label>

<select
  value={pumpingStation}
  onChange={(e) =>
    setPumpingStation(e.target.value)
  }
  className="w-full h-9 px-3 rounded-lg border text-sm text-black"
>

      <option>
        Select Pumping Station
      </option>

      {pumpingStationList.map((station, index) => (

        <option
          key={index}
          value={station}
        >
          {station}
        </option>

      ))}

    </select>

  </div>

  <div>

    <label className="block text-xs font-medium mb-1">
      Pump ID
    </label>

<input
  type="text"
  value={pumpId}
  onChange={(e) =>
    setPumpId(e.target.value)
  }
  placeholder="Enter Pump ID"
  className="w-full h-9 px-3 rounded-lg border text-sm text-black"
/>
  </div>

  <div>

    <label className="block text-xs font-medium mb-1">
      Pump Type
    </label>

<select
  value={pumpType}
  onChange={(e) =>
    setPumpType(e.target.value)
  }
  className="w-full h-9 px-3 rounded-lg border text-sm text-black"
>

     <option value="">
  Select Pump Type
</option>

      {pumpTypes.map((pump, index) => (

        <option
          key={index}
          value={pump}
        >
          {pump}
        </option>

      ))}

    </select>

  </div>
<div>

  <label className="block text-xs font-medium mb-1">
    Previous OH Date
  </label>

  <input
    type="date"
    value={previousOHDate}
    onChange={(e) =>
      setPreviousOHDate(e.target.value)
    }
    className="w-full h-9 px-3 rounded-lg border text-sm text-black"
  />

</div>

<div>

  <label className="block text-xs font-medium mb-1">
    Next OH Date
  </label>

  <input
    type="date"
    value={nextOHDate}
    onChange={(e) =>
      setNextOHDate(e.target.value)
    }
    className="w-full h-9 px-3 rounded-lg border text-sm text-black"
  />

</div>

</div>

<div className="mt-4">

<button
  onClick={handleAddPump}
  className="bg-green-600 hover:bg-green-700 text-white px-5 h-9 rounded-lg text-sm font-medium"
>
  Save Pump
</button>

</div>

</div>

)}

</div>

)}
{activeMenu === "Requirements" && (

<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

<div
  className={`xl:col-span-2 p-4 rounded-2xl shadow-xl ${
      darkMode
        ? "bg-slate-800"
        : "bg-white/80 backdrop-blur-lg"
    }`}
  >

<div className="flex justify-between items-center mb-6">

  <h3 className="text-lg font-semibold">
    Available Equipment
  </h3>

  <div className="flex gap-3">

    <select
      value={filterCategory}
      onChange={(e) =>
        setFilterCategory(e.target.value)
      }
      className="h-8 px-2 border rounded-lg text-xs"
    >
      <option value="All">
        All Categories
      </option>

      {[...new Set(
        equipmentList.map(
          (item) => item.category
        )
      )].map((category) => (
        <option
          key={category}
          value={category}
        >
          {category}
        </option>
      ))}
    </select>

    <select
      value={filterType}
      onChange={(e) =>
        setFilterType(e.target.value)
      }
      className="h-9 px-3 border rounded-lg text-sm"
    >
      <option value="All">
        All Equipment Types
      </option>

      {[...new Set(
        equipmentList.map(
          (item) => item.name
        )
      )].map((type) => (
        <option
          key={type}
          value={type}
        >
          {type}
        </option>
      ))}
    </select>

  </div>

</div>
    <div className="overflow-x-auto overflow-y-auto max-h-[500px]">

      <table className="w-full border-collapse">

        <thead className="sticky top-0 z-10">

          <tr
            className={`${
              darkMode
                ? "bg-slate-700 text-white"
                : "bg-slate-200 text-slate-800"
            }`}
          >

            <th className="px-2 py-1.5 text-xs">
              Equipment Type
            </th>

            <th className="px-2 py-1.5 text-xs">
              Equipment Category
            </th>

            <th className="px-2 py-1.5 text-xs">
              Received From
            </th>

            <th className="px-2 py-1.5 text-xs">
  Status
</th>
            <th className="px-2 py-1.5 text-xs">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {equipmentList
            .filter(
  (item) =>
    item.currentBay === "Finished Bay" &&
    (filterCategory === "All" ||
      item.category === filterCategory) &&
    (filterType === "All" ||
      item.name === filterType)
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

                <td className="px-2 py-1 text-[11px]">
                  {item.name}
                </td>

                <td className="px-2 py-1 text-[11px]">
                  {item.category}
                </td>

                <td className="px-2 py-1 text-[11px]">
                  {item.receivedFrom}
                </td>

<td className="px-2 py-1 text-[11px]">

  {item.reserved ? (

    <span className="bg-yellow-500 text-white px-3 py-1 rounded-xl text-sm font-bold">
      Reserved
    </span>

  ) : (

    <span className="bg-green-500 text-white px-3 py-1 rounded-xl text-sm font-bold">
      Available
    </span>

  )}

</td>
<td className="px-2 py-1 text-center">

 <div className="flex justify-center">

  <button
    disabled={item.reserved}
    onClick={() => {

      const alreadyExists =
        cartItems.some(
          (cartItem) =>
            cartItem.firebaseId ===
            item.firebaseId
        );

      if (alreadyExists) {

        toast.error(
          "Equipment already added"
        );

        return;

      }

      setCartItems([
        ...cartItems,
        item
      ]);

      toast.success(
        "Added to cart"
      );

    }}

className={`min-w-[110px] h-9 rounded-lg text-xs font-medium text-white transition-all duration-300
${
  item.reserved
    ? "bg-amber-500 cursor-not-allowed"
    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg"
}`}

  >

    <span className="absolute top-1 left-3 right-3 h-[1px] bg-white/50 rounded-full"></span>

    {item.reserved
      ? "Reserved"
      : "Add to Cart"}

  </button>

</div>

</td>

              </tr>

            ))}

        </tbody>

      </table>

    </div>

  </div>
<div
  className={`p-4 rounded-2xl shadow-xl h-[590px] flex flex-col ${
    darkMode
      ? "bg-slate-800"
      : "bg-white/80 backdrop-blur-lg"
  }`}
>

  <div className="flex items-center justify-between mb-6">

    <h3 className="text-lg font-semibold">
      🛒 Selected Equipment
    </h3>

   <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">

      {cartItems.length} Selected

    </span>

  </div>
 <div className="flex-1 overflow-y-auto pr-1">
  {cartItems.length === 0 ? (

    <div className="text-center py-8 text-slate-500">

      No equipment selected

    </div>

  ) : (

    <div className="grid grid-cols-2 gap-3">

      {cartItems.map((item, index) => (

        <div
          key={index}
          className={`border rounded-xl p-3 shadow-sm ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >

          <h4 className="font-semibold text-sm leading-tight">

            {item.name}

          </h4>

          <p className="text-xs text-slate-500 mt-1">
            {item.category}

          </p>

          <p className="text-xs text-slate-500">

            {item.receivedFrom}

          </p>

          <button

            onClick={() => {

              setCartItems(
                cartItems.filter(
                  (cartItem) =>
                    cartItem.firebaseId !==
                    item.firebaseId
                )
              );

              toast.success(
                "Removed from cart"
              );

            }}

            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 h-8 rounded-lg text-xs font-medium w-full"

          >

            Remove

          </button>

        </div>

      ))}

    </div>

  )}

</div>
</div>

<div className="col-span-3 mt-4">
{role !== "guest" && (

<div
  className={`p-5 rounded-2xl shadow-lg ${
    darkMode
      ? "bg-slate-800"
      : "bg-white/80 backdrop-blur-lg"
  }`}
>

  <h3 className="text-base font-semibold mb-3 text-slate-800">
    📝 Submit Requirement
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div>

      <label className="block mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
        Department
      </label>

<select
  value={requestDepartment}
  onChange={(e) =>
    setRequestDepartment(e.target.value)
  }
  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
>
  <option value="">
    Select Department
  </option>

  <option value="Sijua Colliery">Sijua Colliery</option>
  <option value="Bhelatand Colliery">Bhelatand Colliery</option>
  <option value="Jamadoba Colliery">Jamadoba Colliery</option>
  <option value="Digwadih Colliery">Digwadih Colliery</option>
  <option value="6&7 Pit Colliery">6&7 Pit Colliery</option>
  <option value="JCPP">JCPP</option>
  <option value="BCPP">BCPP</option>
  <option value="WTP-Sijua">WTP-Sijua</option>
  <option value="WTP-Jamadoba">WTP-Jamadoba</option>
  <option value="TMD-Sijua">TMD-Sijua</option>
  <option value="TMD-Jamadoba">TMD-Jamadoba</option>
  <option value="RS-Sijua">RS-Sijua</option>
  <option value="RS-Jamadoba">RS-Jamadoba</option>
  <option value="Workshop">Workshop</option>
  <option value="Store">Store</option>
  <option value="Others">Others</option>
</select>

    </div>

    <div>

      <label className="block mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
        Purpose
      </label>

      <input
        type="text"
        value={requestPurpose}
        onChange={(e) =>
          setRequestPurpose(e.target.value)
        }
        placeholder="Purpose of Requirement"
        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

    </div>

    <div>

      <label className="block mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
        Priority
      </label>

      <select
        value={requestPriority}
        onChange={(e) =>
          setRequestPriority(e.target.value)
        }
        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
      >

        <option value="Normal">
          Normal
        </option>

        <option value="Urgent">
          Urgent
        </option>

        <option value="Critical">
          Critical
        </option>

      </select>

    </div>

    <div>

      <label className="block mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
        Required Date
      </label>

      <input
        type="date"
        value={requiredDate}
        onChange={(e) =>
          setRequiredDate(e.target.value)
        }
        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
      />

    </div>

  </div>

  <div className="mt-6">

    <label className="block mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
      Remarks
    </label>

    <textarea
      value={requestRemark}
      onChange={(e) =>
        setRequestRemark(e.target.value)
      }
      
      rows={2}
      placeholder="Additional remarks..."
className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 resize-none focus:ring-2 focus:ring-blue-500"
    />

  </div>

  <div className="mt-8">

    <button

      onClick={handleSubmitRequirement}

      className="bg-green-600 hover:bg-green-700 text-white px-5 h-9 rounded-lg text-sm font-medium shadow-sm transition duration-300"

    >

      Submit Requirement

    </button>

  </div>

</div>

)}
</div>

<div className="col-span-3 mt-4">
<div
  className={`p-4 rounded-2xl shadow-xl ${
    darkMode
      ? "bg-slate-800"
      : "bg-white/80 backdrop-blur-lg"
  }`}
>

  <h3 className="text-lg font-semibold mb-4">

    📋 Submitted Requirements

  </h3>

  {requirementsList.length === 0 ? (

    <div className="text-center py-10 text-slate-500">

      No requirements submitted yet

    </div>

  ) : (

    <div className="flex-1 overflow-auto">

      <table className="w-full border-collapse">

        <thead>

          <tr
            className={`${
              darkMode
                ? "bg-slate-800 text-white"
                : "bg-slate-300 text-slate-800"
            }`}
          >

            <th className="px-2 py-2 text-xs text-left">

              Req No

            </th>

            <th className="px-2 py-2 text-xs text-left">

              Department

            </th>

            <th className="px-2 py-2 text-xs text-left">

              Equipment

            </th>

            <th className="px-2 py-2 text-xs text-left">

              Priority

            </th>

            <th className="px-2 py-2 text-xs text-left">

              Status

            </th>

            <th className="px-2 py-2 text-xs text-center">

              Details

            </th>

            {role === "admin" && (

              <th className="px-2 py-2 text-xs text-center">

                Approval

              </th>

            )}

            <th className="px-2 py-2 text-xs text-center">

              Dispatch

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
              } hover:bg-slate-50/50 transition duration-200`}
            >

              <td className="px-2 py-2 text-xs">

                {req.reqNo}

              </td>

              <td className="px-2 py-2 text-xs">

                {req.department}

              </td>

              <td className="px-2 py-2 text-xs">

                {req.items
                  .map((item) => item.name)
                  .join(", ")}

              </td>

              <td className="px-2 py-2 text-xs">

                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
                    req.priority === "Critical"
                      ? "bg-red-600"

                      : req.priority === "Urgent"
                      ? "bg-orange-500"

                      : "bg-blue-600"
                  }`}
                >

                  {req.priority}

                </span>

              </td>

              <td className="px-2 py-2 text-xs">

                <span
                  className={`px-4 py-2 rounded-full text-white text-xs font-bold shadow-sm ${
                    req.status === "Pending"
                      ? "bg-yellow-500"

                      : req.status === "Approved"
                      ? "bg-green-600"

                      : req.status === "Rejected"
                      ? "bg-red-600"

                      : "bg-blue-600"
                  }`}
                >

                  {req.status}

                </span>

              </td>

              {/* Details */}

              <td className="px-2 py-2 text-xs text-center">

                <button

                  onClick={() => {
const equipmentDetails = req.items
  .map(
    (item) =>
      `• ${item.name}
Category: ${item.category}
Received From: ${item.receivedFrom}`
  )
  .join("\n\n");

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
${equipmentDetails}
`;

                    alert(details);

                  }}

                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 h-7 rounded-lg text-xs font-medium"

                >

                  View

                </button>

              </td>

              {/* Approval */}

              {role === "admin" && (

                <td className="p-4 text-center">

                  {req.status === "Pending" ? (

                    <div className="flex gap-2 justify-center">

                      <button

                        onClick={async () => {

                          setRequirementsList(

                            requirementsList.map((r) =>

                              r.firebaseId === req.firebaseId

                                ? {

                                    ...r,

                                    status: "Approved",

                                    approvedBy:
                                      user.email,

                                    actionDate:
                                      new Date().toLocaleString()

                                  }

                                : r

                            )

                          );

                          await updateDoc(

                            doc(
                              db,
                              "requirements",
                              req.firebaseId
                            ),

                            {

                              status: "Approved",

                              approvedBy:
                                user.email,

                              actionDate:
                                new Date().toLocaleString()

                            }

                          );

                          toast.success(
                            "Requirement Approved"
                          );

                        }}

                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 h-7 rounded-lg text-xs font-medium"

                      >

                        Approve

                      </button>

                      <button

                        onClick={async () => {

                          setRequirementsList(

                            requirementsList.map((r) =>

                              r.firebaseId === req.firebaseId

                                ? {

                                    ...r,

                                    status: "Rejected",

                                    rejectedBy:
                                      user.email,

                                    actionDate:
                                      new Date().toLocaleString()

                                  }

                                : r

                            )

                          );

                          await updateDoc(

                            doc(
                              db,
                              "requirements",
                              req.firebaseId
                            ),

                            {

                              status: "Rejected",

                              rejectedBy:
                                user.email,

                              actionDate:
                                new Date().toLocaleString()

                            }

                          );
for (const item of req.items) {

  await updateDoc(

    doc(
      db,
      "equipment",
      item.firebaseId
    ),

    {

      reserved: false,

      reservedBy: ""

    }

  );

}

await fetchEquipment();
                          toast.success(
                            "Requirement Rejected"
                          );

                        }}

                        className="bg-red-600 hover:bg-red-700 text-white px-3 h-7 rounded-lg text-xs font-medium"

                      >

                        Reject

                      </button>

                    </div>

                  ) : (

                    <span className="text-slate-500 text-sm">

                      Completed

                    </span>

                  )}

                </td>

              )}

              {/* Dispatch */}

              <td className="p-4 text-center">

                {req.status === "Approved" &&
                !req.dispatchDate ? (

                  <button

                    onClick={async () => {

                      setRequirementsList(

                        requirementsList.map((r) =>

                          r.firebaseId === req.firebaseId

                            ? {

                                ...r,

                                dispatchDate:
                                  new Date().toLocaleString()

                              }

                            : r

                        )

                      );

                      await updateDoc(

                        doc(
                          db,
                          "requirements",
                          req.firebaseId
                        ),

                        {

                          dispatchDate:
                            new Date().toLocaleString()

                        }

                      );
for (const item of req.items) {

  await updateDoc(
    doc(
      db,
      "equipment",
      item.firebaseId
    ),
    {
      reserved: false,
      reservedBy: ""
    }
  );

}
await fetchEquipment();

                      toast.success(
                        "Equipment Dispatched"
                      );

                    }}

                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 h-7 rounded-lg text-xs font-medium"

                  >

                    Dispatch

                  </button>

                ) : (

                  <span className="text-sm text-slate-500">

                    {req.dispatchDate
                      ? "Dispatched"
                      : "-"}

                  </span>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
    
  )}
</div>
</div>
</div>
)}

{activeMenu === "Reports" && (
<div
className={`backdrop-blur-lg mt-4 p-3 rounded-2xl shadow-xl border ${
darkMode
? "bg-slate-800/80 border-slate-700"
: "bg-white/80 border-white/30"
}`}
>
<div className="flex flex-wrap items-center justify-between gap-3 mb-4">
<h3 className={`text-xl font-semibold ${
darkMode ? "text-white" : "text-slate-800"
}`}>
Equipment List
</h3>
<div className="flex flex-wrap gap-3">
<button
onClick={() => setActiveBay("All")}
className={`px-4 h-10 rounded-xl text-sm font-medium transition duration-300 ${
activeBay === "All"
? "bg-slate-800 text-white shadow-lg"
: "bg-slate-200 text-slate-700"
}`}
>
📋 All Equipment
</button>
<button
onClick={() => setActiveBay("Received Bay")}
className={`px-4 h-10 rounded-xl text-sm font-medium transition duration-300 ${
activeBay === "Received Bay"
? "bg-blue-600 text-white shadow-lg"
: "bg-slate-200 text-slate-700"
}`}
>
📥 Received Bay
</button>
<button
onClick={() => setActiveBay("Overhauling Bay")}
className={`px-4 h-10 rounded-xl text-sm font-medium transition duration-300 ${
activeBay === "Overhauling Bay"
? "bg-orange-500 text-white shadow-lg"
: "bg-slate-200 text-slate-700"
}`}
>
🛠 Overhauling Bay
</button>
<button
onClick={() => setActiveBay("Finished Bay")}
className={`px-4 h-10 rounded-xl text-sm font-medium transition duration-300 ${
activeBay === "Finished Bay"
? "bg-green-600 text-white shadow-lg"
: "bg-slate-200 text-slate-700"
}`}
>
✅ Finished Bay
</button>
</div>
<div className="flex flex-wrap items-center gap-3">
<input
type="text"
placeholder="Search equipment..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className={`h-10 px-4 rounded-xl text-sm-2 focus:ring-blue-400 transition border ${
darkMode
? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
: "bg-white/70 border-slate-200 text-slate-900"
}`}
/>
<button
onClick={exportToExcel}
className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 h-10 rounded-xl text-sm shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300 font-bold"
>
📥 Export Excel
</button>
</div>
</div>
<div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-2xl">
<table className="w-full border-collapse">
<thead className="sticky top-0 z-10">
<tr
className={`uppercase text-[11px] tracking-normal ${
darkMode
? "bg-slate-700 text-slate-200"
: "bg-slate-100 text-slate-700"
}`}
>
<th className="text-left px-2 py-1.5">WO No</th>
<th className="text-left px-2 py-1.5">Equipment Category</th>
<th className="text-left px-2 py-1.5">Equipment Type</th>
<th className="text-left px-2 py-1.5">Current Bay</th>
<th className="text-left px-2 py-1.5">Received Date</th>
<th className="text-left px-2 py-1.5">Received From</th>
<th className="text-left px-2 py-1.5">Tentative Date</th>
<th className="text-left px-2 py-1.5">Status</th>
{role === "admin" && (
<th className="text-left px-3 py-2 w-[140px]">
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
className={`px-2 py-1.5 text-xs ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
  {item.workOrderNo}
</td>
<td
className={`px-2 py-1.5 text-xs ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.category}
</td>
<td
className={`px-2 py-1.5 text-xs ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.name}
</td>
<td
className={`px-2 py-1.5 text-xs ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.currentBay}
</td>
<td
className={`px-2 py-1.5 text-xs ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.receivedDate}
</td>
<td
className={`px-2 py-1.5 text-xs ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.receivedFrom}
</td>
<td
className={`px-2 py-1.5 text-xs ${
darkMode ? "text-slate-200" : "text-slate-700"
}`}
>
{item.tentativeDate || "-"}
</td>
<td className="p-3">
<span
className={`px-3 py-1 rounded-full text-white text-xs font-semibold shadow-md
${
item.status === "Received"
? "bg-sky-500"

: item.status === "Dismantling"
? "bg-red-500"

: item.status === "Work Under Progress"
? "bg-yellow-500 text-black"

: item.status === "Overhauling"
? "bg-orange-500"

: item.status === "Sent for Repair to Other Party"
? "bg-purple-500"

: item.status === "Specification Change"
? "bg-indigo-500"

: item.status === "Discarded"
? "bg-slate-600"

: item.status === "Completed"
? "bg-green-500"

: "bg-gray-500"
}`}
>
{item.status}
</span>
</td>
{role === "admin" && (
<td className="px-3 py-2 whitespace-nowrap">
  <div className="flex items-center gap-2">

    <button
      onClick={() => {
        setActiveMenu("Equipment");
        handleEditEquipment(item, index);
      }}
      className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 h-8 rounded-lg text-xs shadow hover:scale-105 transition duration-300 font-semibold"
    >
      Edit
    </button>

    <button
      onClick={() =>
        handleDeleteEquipment(item.firebaseId)
      }
      className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 h-8 rounded-lg text-xs shadow hover:scale-105 transition duration-300 font-semibold"
    >
      Delete
    </button>

  </div>
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
</div>
);
}
export default App;