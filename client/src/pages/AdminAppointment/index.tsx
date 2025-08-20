import React from 'react';
import Lucide from '@/components/Base/Lucide';
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/stores/userSlice"; 
import Nodata from '@/assets/images/doctorino/nodata.svg'


const Main = () => {
    const [appointments, setAppointment] = useState([]);

      const userFromLocalStorage = localStorage.getItem("user")
        const userFromStore = useSelector(selectUser)
        const userIdFromStore = userFromStore.user?.id;
        const user = userFromLocalStorage || userIdFromStore;

    const getAppointment = async () => {
        try {
          const response = await axios.get(`http://localhost:7000/api/v1/appointment`)
          setAppointment(response.data.data.updatedAppointments)
      
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {  
        getAppointment();
      }, []);
    

    return (
      <div className="flex flex-row flex-wrap gap-5">
        <div className="text-base font-medium group-[.mode--light]:text-white">
          Appointments List
        </div>
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
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
                      Position: {appointment.doctor_id?.placement},{" "}
                      {appointment.doctor_id?.location}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-slate-500">
                    Doctor info
                  </div>
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
                        {appointment.doctor_id?.phone_number}
                      </div>
                    </div>
                    <div className=" mt-3">
                      <div className="text-xs uppercase text-slate-500">
                        Patient info
                      </div>
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
                            {appointment.patient_id?.phone_number}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex bg-white p-7 rounded-sm flex-col gap-4 justify-center items-center w-full">
            <img width={90} src={Nodata} alt="no-data" />
            <span>No appointments available</span>
          </div>
        )}
      </div>
    );
}

export default Main;
