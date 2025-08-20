import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/stores/userSlice";
import Button from "@/components/Base/Button";

const Main = () => {
    const [stats, setStats] = useState({
        doctorCount: 0,
        appointmentCount: 0,
        patientCount: 0,
        specialitiesCount: 0,
    });

    const getAdminStats = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/v1/user/stats/stats');
            setStats(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAdminStats();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium text-white">Admin Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-1 box ">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-100">
                        <div className="flex w-full">
                            <div className="mr-auto text-black">Docteur</div>
                        </div>
                        <div className="flex items-center mt-10 mb-11">
                            <div className="flex flex-col items-center">
                                <div className="text-[2.1rem] font-medium text-black/80">
                                    {stats.doctorCount} {/* Display the doctor count here */}
                                </div>
                                <div className="mt-3.5 text-base text-black/80">
                                    Total Doctors
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-1 box ">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-100">
                        <div className="flex w-full">
                            <div className="mr-auto text-black">Appointments</div>
                        </div>
                        <div className="flex items-center mt-10 mb-11">
                            <div className="flex flex-col items-center">
                                <div className="text-[2.1rem] font-medium text-black/80">
                                    {stats.appointmentCount} {/* Display the doctor count here */}
                                </div>
                                <div className="mt-3.5 text-base text-black/80">
                                    Total Appointments
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-1 box ">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-r from-theme-2/[0.85] to-theme-1/[0.85]">
                        <div className="flex w-full">
                            <div className="mr-auto text-white">Patients</div>
                        </div>
                        <div className="flex items-center mt-10 mb-11">
                            <div className="flex flex-col items-center">
                                <div className="text-[2.1rem] font-medium text-white/90">
                                    {stats.patientCount} {/* Display the doctor count here */}
                                </div>
                                <div className="mt-3.5 text-base text-white/80">
                                    Total Patients
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-1 box ">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-r from-theme-2/[0.85] to-theme-1/[0.85]">
                        <div className="flex w-full">
                            <div className="mr-auto text-white">Specialities</div>
                        </div>
                        <div className="flex items-center mt-10 mb-11">
                            <div className="flex flex-col items-center">
                                <div className="text-[2.1rem] font-medium text-white/90">
                                    {stats.specialitiesCount} {/* Display the doctor count here */}
                                </div>
                                <div className="mt-3.5 text-base text-white/80">
                                    Total Specialities
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
}

export default Main;
