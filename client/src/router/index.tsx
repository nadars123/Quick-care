import { useRoutes, Navigate } from "react-router-dom";
import Layout from "../themes";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useSelector } from "react-redux";
import { selectUser } from "../stores/userSlice";
import SettingsUser from "../pages/SettingsUser";
import DoctorsPage from "../pages/DoctorsPage";
import AppointmentPage from "../pages/Appointment";
import Logout from "../pages/Logout";
import Stats from "../pages/Stats"
import Speciality from "../pages/Specialities"
import DoctorsListForAdmin from "../pages/DoctorsList";
import PatientsListForAdmin from "../pages/PatientList";
import AdminStats from "@/pages/AdminStats";
import AdminAppointment from "@/pages/AdminAppointment";
import ForgetPassword from "@/pages/ForgetPassword";
import ResetPassword from "@/pages/ResetPassword";
import Message from '../pages/Contacts'

function Router() {
  const user = useSelector(selectUser);
  const role = user?.user?.role || localStorage.getItem("role");

  const patientRoutes = [
    { path: "statistiques", element: <Stats /> },
    { path: "docteurs", element: <DoctorsPage /> },
    { path: "appointments", element: <AppointmentPage /> },
    { path: "settings", element: <SettingsUser /> },
    { path: "Logout", element: <Logout /> },
  ];

  const docteurRoutes = [
    { path: "statistiques", element: <Stats /> },
    { path: "appointments", element: <AppointmentPage /> },
    { path: "settings", element: <SettingsUser /> },
    { path: "Logout", element: <Logout /> },
  ];

  const adminRoutes = [
    { path: "statistiques", element: <AdminStats /> },
    { path: "docteurslist", element: <DoctorsListForAdmin /> },
    { path: "patients", element: <PatientsListForAdmin /> },
    { path: "appointments", element: <AdminAppointment /> },
    { path: "specialities", element: <Speciality /> },
    { path: "Messages", element: <Message /> },
    { path: "settings", element: <SettingsUser /> },
    { path: "Logout", element: <Logout /> },
  ];

  let roleBasedRoutes:any = [];
  if (role === "Patient") roleBasedRoutes = patientRoutes;
  if (role === "Docteur") roleBasedRoutes = docteurRoutes;
  if (role === "Admin") roleBasedRoutes = adminRoutes;

  const protectedRoutes = [
    {
      path: "/dashboard",
      element: role ? <Layout /> : <Navigate to="/login" replace />,
      children: role
        ? roleBasedRoutes.concat([
            { path: "*", element: <Navigate to="/dashboard/statistiques" replace /> },
          ])
        : [],
    },
  ];

  const routes = [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgetPassword", element: <ForgetPassword /> },
    { path: "/resetPassword/:token", element: <ResetPassword /> },
    ...protectedRoutes,
    {
      path: "*",
      element: (
        <Navigate to={role ? "/dashboard/statistiques" : "/login"} replace />
      ),
    },
  ];

  return useRoutes(routes);
}

export default Router;
