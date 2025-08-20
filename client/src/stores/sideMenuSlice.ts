import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";

// Define role-based menus
const menus = {
  Patient: [
    "DASHBOARDS",
    { icon: "GaugeCircle", pathname: "/dashboard/statistiques", title: "Statistiques" },
    { icon: "ActivitySquare", pathname: "/dashboard/docteurs", title: "Docteurs" },
    { icon: "Album", pathname: "/dashboard/appointments", title: "Appointments" },
    { icon: "HardDrive", pathname: "/dashboard/settings", title: "Settings" },
    { icon: "HardDrive", pathname: "/dashboard/logout", title: "Logout" },
  ],
  Docteur: [
    "DASHBOARDS",
    { icon: "GaugeCircle", pathname: "/dashboard/statistiques", title: "Statistiques" },
    { icon: "Album", pathname: "/dashboard/appointments", title: "Appointments" },
    { icon: "HardDrive", pathname: "/dashboard/settings", title: "Settings" },
    { icon: "HardDrive", pathname: "/dashboard/logout", title: "Logout" },
  ],
  Admin: [
    "DASHBOARDS",
    { icon: "GaugeCircle", pathname: "/dashboard/statistiques", title: "Statistiques" },
    { icon: "ActivitySquare", pathname: "/dashboard/docteurslist", title: "Docteurs List" },
    { icon: "Album", pathname: "/dashboard/patients", title: "Patients" },
    { icon: "BookMarked", pathname: "/dashboard/appointments", title: "Appointments" },
    { icon: "BookMarked", pathname: "/dashboard/specialities", title: "specialities" },
    { icon: "HardDrive", pathname: "/dashboard/settings", title: "Settings" },
    { icon: "HardDrive", pathname: "/dashboard/logout", title: "Logout" },
  ],
};

// Function to get menu by role
const getMenuByRole = (role: string) => {
  return menus[role] || [];
};

// Get user role from Redux or localStorage
const getUserRole = (state: RootState) => {
  console.log('state user ==', state?.user?.user)
  return state.user?.user?.role || localStorage.getItem("role");
};


// Initialize state dynamically
const initialState = {
  menu: [],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    setRoleMenu: (state, action) => {
      state.menu = getMenuByRole(action.payload);
      localStorage.setItem("role", action.payload); // Store role in localStorage
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
        (action) => action.type === "user/setUserRole", // Listen for user role changes
        (state, action) => {
          state.menu = getMenuByRole(action.payload);
        }
    );
  },
});

export const { setRoleMenu } = sideMenuSlice.actions;
export const selectSideMenu = (state: RootState) => getMenuByRole(getUserRole(state));

export default sideMenuSlice.reducer;
