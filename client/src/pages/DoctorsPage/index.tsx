import Lucide from "@/components/Base/Lucide";
import {FormInput, FormLabel, FormSelect} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import axios from "axios";
import users from "@/fakers/users";
import {useEffect, useRef, useState} from "react";
import {Dialog, Menu} from "@/components/Base/Headless";
import Litepicker from "@/components/Base/Litepicker";
import {useSelector} from "react-redux";
import {selectUser} from "@/stores/userSlice";
import { toast } from "sonner";

function Main() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [datepickerModal, setDatepickerModal] = useState(false);
  const [date, setDate] = useState("23 Mar, 2025");

  const [time, setTime] = useState("14:00");
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

  const postAppoitment = async () => {

    let data = {
      patient_id: userIdDDependOnRole,
      doctor_id: selectedDoctorId,
      appointment_date: date,
      appointment_time: time,
    };

    try {
      const response = await axios.post("http://localhost:7000/api/v1/appointment/", data);
      toast.success("Appoitment added successful!");
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/v1/user/getAllUsersBySpecificRole/doctor");
      setDoctors(response.data);
      setFilteredDoctors(response.data);

      // Extract unique specialties & locations
      const allSpecialties = new Set();
      const allLocations = new Set();

      response.data.forEach((doctor) => {
        doctor.id_doctor.speciality_ids.forEach((spec) => allSpecialties.add(spec.label));
        allLocations.add(doctor.id_doctor.location);
      });

      setSpecialties(Array.from(allSpecialties));
      setLocations(Array.from(allLocations));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = doctors;

    if (selectedSpecialty) {
      filtered = filtered.filter((doctor) =>
        doctor.id_doctor.speciality_ids.some((spec) => spec.label === selectedSpecialty)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((doctor) => doctor.id_doctor.location === selectedLocation);
    }

    setFilteredDoctors(filtered);
  }, [selectedSpecialty, selectedLocation, doctors]);

  function pluralizeYear(years) {
    return years === 1 ? "year" : "years";
  }

  return (
    <div className="flex flex-row gap-3 flex-wrap ">
      <div className="flex flex-wrap col-span-12 gap-y-10 gap-x-6">
        {/* Filters */}
        <div className="flex w-full gap-4">
          <FormSelect
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </FormSelect>
        </div>

        {/* Doctors List */}
        <div className="flex flex-row flex-wrap gap-5 justify-between ">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor.id_doctor?.id} className="p-5 box w-[400px]">
                <div className="flex items-center gap-2">
                  {doctor.id_doctor?.image ? (
                    <img
                      className="w-[50px] h-[50px] rounded-full"
                      alt="image-doctor"
                      src={`http://localhost:7000/${doctor.id_doctor?.image?.replace(
                        "\\",
                        "/"
                      )}`}
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full  border-[3px] border-slate-200/70 bg-gray-300 text-black">
                      ?
                    </div>
                  )}

                  <div className="w-full">
                    <div className="text-base mb-3 flex flex-row items-center font-medium truncate max-w-[12rem] md:max-w-none">
                      <span>
                        {doctor.first_name} {doctor.last_name}
                      </span>
                      <div className="flex text-[10px] items-center px-3 py-1 font-medium border rounded-full sm:ml-auto border-success/10 bg-success/10 text-success">
                        <div className="w-1.5 h-1.5 mr-2 rounded-full border border-success/50 bg-success/50"></div>
                        {doctor.id_doctor?.experience}{" "}
                        {pluralizeYear(doctor.id_doctor?.experience)} experience
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 mt-1 truncate max-w-[12rem] md:max-w-none">
                      <Lucide icon="MapPin" className="stroke-[1.3] w-4 h-4" />
                      {doctor.id_doctor?.placement},{" "}
                      {doctor.id_doctor?.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1 truncate max-w-[12rem] md:max-w-none">
                      <Lucide icon="Phone" className="stroke-[1.3] w-4 h-4" />
                      {doctor.id_doctor?.phone_number}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1 truncate max-w-[12rem] md:max-w-none">
                      <Lucide icon="Mail" className="stroke-[1.3] w-4 h-4" />
                      {doctor?.email}
                    </div>
                  </div>
                </div>

                <div className="w-full mt-3 items-center rounded-lg border h-[80px] border-gray-400 p-2 flex flex-wrap gap-2 max-h-24 overflow-hidden hover:overflow-y-auto">
                  {doctor.id_doctor?.speciality_ids.length > 0 ? (
                    doctor.id_doctor?.speciality_ids.map((e, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 px-3 py-1 rounded-md"
                      >
                        {e.label}
                      </span>
                    ))
                  ) : (
                    <div className="w-full flex items-center justify-center text-gray-500 h-full">
                      No Specialties Affected!
                    </div>
                  )}
                </div>

                <Button
                  rounded
                  className="w-full mt-5"
                  as="a"
                  href="#"
                  variant="primary"
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    setDatepickerModal(true);
                    setSelectedDoctorId(doctor.id_doctor?._id);
                  }}
                >
                  Take Appointment
                </Button>

                <Dialog open={datepickerModal}>
                  <Dialog.Panel>
                    {/* BEGIN: Modal Header */}
                    <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">
                        Chose Appoitment Date
                      </h2>
                    </Dialog.Title>
                    {/* END: Modal Header */}
                    {/* BEGIN: Modal Body */}
                    <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
                      <div className="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-datepicker-1">Date</FormLabel>
                        <Litepicker
                          id="modal-datepicker-1"
                          value={date}
                          onChange={(e) => {
                            setDate(e.target.value);
                          }}
                          options={{
                            autoApply: false,
                            showWeekNumbers: true,
                            dropdowns: {
                              minYear: 1990,
                              maxYear: null,
                              months: true,
                              years: true,
                            },
                          }}
                        />
                      </div>
                      <div className="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-datepicker-2">Time</FormLabel>

                        <FormInput
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          type="time"
                        />
                      </div>
                    </Dialog.Description>
                    {/* END: Modal Body */}
                    {/* BEGIN: Modal Footer */}
                    <Dialog.Footer className="text-right">
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => {
                          setDatepickerModal(false);
                        }}
                        className="w-20 mr-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="button"
                        className="w-20"
                        onClick={() => {
                          postAppoitment();
                          setDatepickerModal(false);
                        }}
                      >
                        Submit
                      </Button>
                    </Dialog.Footer>
                    {/* END: Modal Footer */}
                  </Dialog.Panel>
                </Dialog>
              </div>
            ))
          ) : (
            <h2 className="text-base">No doctors found.</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
