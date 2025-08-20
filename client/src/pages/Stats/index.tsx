import React from 'react';
import Lucide from '@/components/Base/Lucide';
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/stores/userSlice";
import ReportDonutChart7 from "@/components/ReportDonutChart7";
import clsx from "clsx";
import Tippy from "@/components/Base/Tippy";
import Button from "@/components/Base/Button";
import robotImage from "@/assets/images/miscellaneous/robot.jpg";
import _ from "lodash";
import events from "@/fakers/events";
import users from "@/fakers/users";
import {date} from "yup";
import Nodata from "../../assets/images/doctorino/nodata.svg";


const Main = () => {
    const [appointments, setAppointment] = useState([]);
    const [futureAppointments, setFutureAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [nextappointment, setNextAppointment] = useState(null);


    const userFromLocalStorage = localStorage.getItem("user")
    const userFromStore = useSelector(selectUser)
    const userIdFromStore = userFromStore.user?.id;
    const user = userFromLocalStorage || userIdFromStore;
      const userRole = localStorage.getItem("role");
      const userIdDDependOnRole =
        userRole === "Patient"
          ? localStorage.getItem("PatientID")
          : userRole === "Docteur"
          ? localStorage.getItem("DoctorID")
          : null;

  
    const getAppointment = async () => {
            let url = "";

            if (userRole === "Admin") {
              url = `http://localhost:7000/api/v1/appointment`;
            } else if (userRole === "Patient") {
              url = `http://localhost:7000/api/v1/appointment/patient/${userIdDDependOnRole}`;
            } else if (userRole === "Docteur") {
              url = `http://localhost:7000/api/v1/appointment/doctor/${userIdDDependOnRole}`;
            } else {
              console.error("Invalid user role");
              return;
            }

            console.log('url ==', url);

            try {
              const response = await axios.get(url);
              console.log('response ==', response.data.data)
              setAppointment(response.data.data);
              const updatedAppointments =
                response.data.data;
              // Filter appointments that are in the future
              const futureappointments = updatedAppointments.filter(
                (appointment) => {
                  return new Date(appointment?.appointment_date) > new Date();
                }
              );
              const pastappointments = updatedAppointments.filter(
                (appointment) => {
                  return new Date(appointment?.appointment_date) < new Date();
                }
              );
              setPastAppointments(pastappointments);
              // Sort future appointments by date
              futureappointments.sort((a, b) => {
                return (
                  new Date(a.appointment_date) - new Date(b.appointment_date)
                );
              });

              // Set the appointments and the next appointment

              if (futureappointments.length > 0) {
                setFutureAppointments(futureappointments);
                setNextAppointment(futureappointments[0]); // Set the first future appointment as the next one
              }
              console.log(futureAppointments);
            } catch (error) {
              console.log(error);
            }
    };

    useEffect(() => {
        getAppointment();
    }, []);


    return (
      <div>
        {nextappointment && (
          <div className="p-5 box box--stacked">
            <div className="flex flex-col items-center pb-8 mb-5 border-b border-dashed">
              <div className="max-w-[17rem] text-base font-medium text-white truncate">
                Your next appointment on
              </div>
              <div className="text-slate-500 mt-4">
                {new Date(
                  nextappointment.appointment_date
                ).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="text-[2.1rem] font-medium text-primary opacity-90">
                  {nextappointment.appointment_time}
                </div>
              </div>
            </div>

            {userRole === "Patient" ? (
              <div
                className={clsx([
                  "flex flex-col gap-5 relative",
                  "before:content-[''] before:w-px before:h-full before:absolute before:bg-slate-200 before:ml-5",
                ])}
              >
                <div className="flex items-center gap-3.5 relative z-5">
                  <div>
                    <div className="w-10 h-10 overflow-hidden border-2 rounded-full image-fit border-slate-200/70">
                      <img
                        alt="image-doctor"
                        src={`http://localhost:7000/${nextappointment.doctor_id.image.replace(
                          "\\",
                          "/"
                        )}`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium truncate max-w-[15rem]">
                      {nextappointment.doctorFirstName}{" "}
                      {nextappointment.doctorLastName}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {nextappointment.doctor_id.phone_number}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 relative z-5">
                  <div>
                    <div className="flex items-center justify-center w-10 h-10 border-2 rounded-full bg-slate-100 border-slate-200/70 dark:bg-darkmode-400">
                      <Lucide
                        icon="MapPin"
                        className="w-4 h-4 text-primary fill-primary/10"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium truncate max-w-[15rem]">
                      Location
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {nextappointment.doctor_id.placement},{" "}
                      {nextappointment.doctor_id.location}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={clsx([
                  "flex flex-col gap-5 relative",
                  "before:content-[''] before:w-px before:h-full before:absolute before:bg-slate-200 before:ml-5",
                ])}
              >
                <div className="flex items-center gap-3.5 relative z-5">
                  <div>
                    <div className="w-10 h-10 overflow-hidden border-2 rounded-full image-fit border-slate-200/70">
                      <img
                        alt="Tailwise - Admin Dashboard Template"
                        src={users.fakeUsers()[0].photo}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium truncate max-w-[15rem]">
                      {nextappointment.patientFirstName}{" "}
                      {nextappointment.patientLastName}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {nextappointment.patient_id.phone_number}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="m-6 text-2xl text-white">Future Appointments .</div>

        <div className="flex flex-row flex-wrap gap-5">
          {futureAppointments.length > 0 ? (
            futureAppointments.map((appointment, index) => (
              <div key={index} className="flex flex-col p-5 w-[400px] box">
                <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                  Appointments Details
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <div className="text-xs uppercase text-slate-500">
                      Appointment info
                    </div>
                    <div className="mt-3.5">
                      <div className="flex items-center">
                        <Lucide
                          icon="Clipboard"
                          className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                        />
                        Date:{" "}
                        {new Date(
                          appointment.appointment_date
                        ).toLocaleDateString()}
                      </div>

                      <div className="flex items-center mt-3">
                        <Lucide
                          icon="Clock"
                          className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                        />
                        time:
                        <div className="flex items-center text-xs font-medium rounded-md text-success bg-success/10 border border-success/10 px-1.5 py-px ml-1">
                          <span className="-mt-px">
                            {appointment.appointment_time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center mt-3">
                        <Lucide
                          icon="Map"
                          className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                        />
                        Position: {appointment.doctor_id.placement},{" "}
                        {appointment.doctor_id.location}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500">
                      {userRole === "Patient" ? " Doctor info" : "Patient Info"}
                    </div>
                    {userRole === "Patient" ? (
                      <div className="mt-3.5">
                        {" "}
                        <div className="flex items-center">
                          <Lucide
                            icon="User"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Full Name :{" "}
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.doctorFirstName}{" "}
                            {appointment.doctorLastName}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Lucide
                            icon="Mail"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Email:{" "}
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.doctorEmail}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Lucide
                            icon="Phone"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Phone
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.doctor_id.phone_number}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3.5">
                        {" "}
                        <div className="flex items-center">
                          <Lucide
                            icon="User"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Full Name :{" "}
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.patientFirstName}{" "}
                            {appointment.patientLastName}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Lucide
                            icon="Mail"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Email:{" "}
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.patientEmail}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Lucide
                            icon="Phone"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Phone
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.doctor_id.phone_number}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white px-7 w-full flex flex-col justify-center items-center gap-2 rounded-lg h-36">
              <img width={40} src={Nodata} alt="no-data-available" />
              <span> No Future appointments available.</span>
            </div>
          )}
        </div>

        <div className="m-6 text-2xl text-white ">Past Appointments .</div>
        <div className="flex flex-row flex-wrap gap-5">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment, index) => (
              <div key={index} className="flex flex-col p-5 w-[400px] box">
                <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                  Appointments Details
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <div className="text-xs uppercase text-slate-500">
                      Appointment info
                    </div>
                    <div className="mt-3.5">
                      <div className="flex items-center">
                        <Lucide
                          icon="Clipboard"
                          className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                        />
                        Date:{" "}
                        {new Date(
                          appointment.appointment_date
                        ).toLocaleDateString()}
                      </div>

                      <div className="flex items-center mt-3">
                        <Lucide
                          icon="Clock"
                          className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                        />
                        time:
                        <div className="flex items-center text-xs font-medium rounded-md text-success bg-success/10 border border-success/10 px-1.5 py-px ml-1">
                          <span className="-mt-px">
                            {appointment.appointment_time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center mt-3">
                        <Lucide
                          icon="Map"
                          className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                        />
                        Position: {appointment.doctor_id.placement},{" "}
                        {appointment.doctor_id.location}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500">
                      {userRole === "Patient" ? " Doctor info" : "Patient Info"}
                    </div>
                    {userRole === "Patient" ? (
                      <div className="mt-3.5">
                        {" "}
                        <div className="flex items-center">
                          <Lucide
                            icon="User"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Full Name :{" "}
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.doctorFirstName}{" "}
                            {appointment.doctorLastName}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Lucide
                            icon="Mail"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Email:{" "}
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.doctorEmail}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Lucide
                            icon="Phone"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Phone
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.doctor_id.phone_number}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3.5">
                        {" "}
                        <div className="flex items-center">
                          <Lucide
                            icon="User"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Full Name :{" "}
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.patientFirstName}{" "}
                            {appointment.patientLastName}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Lucide
                            icon="Mail"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Email:{" "}
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.patientEmail}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Lucide
                            icon="Phone"
                            className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                          />
                          Phone
                          <div className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                            {appointment.patient_id.phone_number}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white px-7 w-full flex flex-col justify-center items-center gap-2 rounded-lg h-36">
              <img width={40} src={Nodata} alt="no-data-available" />
              <span> No appointments available.</span>
            </div>
          )}
        </div>
      </div>
    );
}

export default Main;
