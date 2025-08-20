import {
  FormInput,
  FormLabel,
} from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import _ from "lodash";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import Select from "react-select"; // Import React Select
import Locations from '../../utils/Villes.json';
import {  toast } from 'sonner';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from '@/assets/images/doctorino/LOGO.png'
import LogoDark from "@/assets/images/doctorino/LOGOMARK DARK.png";


const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];


function Main() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [doctorSpecialities, setDoctorSpecialities] = useState([]);

  const getSpecialities = async () => {
    try {
        const response = await axios.get("http://localhost:7000/api/v1/speciality", {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = response.data;
        setDoctorSpecialities(responseData);
        return responseData;
    } catch (error) {
        throw error;
    }
};

useEffect(() => {
    getSpecialities();
}, []);

  function normalizeDate(inputDate) {
      const date = new Date(inputDate);
      if (isNaN(date.getTime())) {
          return null;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
  }

  const baseSchema = yup.object().shape({
      first_name: yup.string().required("First name is required"),
      last_name: yup.string().required("Last name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup
          .string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
      passwordConfirmation: yup
          .string()
          .oneOf([yup.ref("password")], "Passwords must match")
          .required("Password confirmation is required"),
      role: yup.string().required("Role is required"),
  });

  const doctorSchema = yup.object().shape({
      doctorData: yup.object().shape({
          speciality_ids: yup
              .array()
              .of(yup.string())
              .required("Speciality is required"),
          experience: yup
              .number()
              .required("Experience is required")
              .positive("Experience must be positive")
              .integer("Experience must be an integer"),
          office_Adresse: yup.string().required("Office Address is required"),
          phone_number: yup.string().required("Phone number is required"),
          location: yup.string().required("Location is required"),
        placement: yup.string().required("Placement is required"),
      }),
  });

  const patientSchema = yup.object().shape({
      patientData: yup.object().shape({
          birth_date: yup
              .date()
              .transform((value) => {
                  if (value) {
                      const normalizedDate = normalizeDate(value);
                      return normalizedDate ? new Date(normalizedDate) : null;
                  }
                  return value;
              })
              .required("Birth date is required"),
          gender: yup.string().required("Gender is required"),
          Adresse: yup.string().required("Address is required"),
          phone_number: yup.string().required("Phone number is required"),
      }),
  });

  const schema = baseSchema.concat(
      selectedRole === "Docteur"
          ? doctorSchema
          : selectedRole === "Patient"
              ? patientSchema
              : yup.object().shape({})
  );

  const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
  } = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
          gender: "Male", // or "Female" as needed
      },
  });

  const sendDataToAPI = async (data) => {
    try {
        const response = await axios.post("http://localhost:7000/api/v1/user", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        toast.success("Registration successful!");
        setTimeout(() => {
            navigate('/login');
        },2000)
        return response.data;
    } catch (error) {
        toast.error(`${error.response?.data?.message || error.message}`);        
        throw error;
    }
};

  const onSubmit = async (data, event) => {
    event.preventDefault();
    
    // Check if doctorData is empty
    if (data.role === "Docteur") {
        const isDoctorDataEmpty = Object.values(data.doctorData).every(x => x === null || x === '' || x === undefined);
        if (isDoctorDataEmpty) {
            data.doctorData = null;
        }
    } else {
        data.doctorData = null;
    }

    // Check if patientData is empty
    if (data.role === "Patient") {
        const isPatientDataEmpty = Object.values(data.patientData).every(x => x === null || x === '' || x === undefined);
        if (isPatientDataEmpty) {
            data.patientData = null;
        }
    } else {
        data.patientData = null;
    }

    try {
        await sendDataToAPI(data); 
    } catch (error) {
        console.error("Error submitting form:", error);
    }
};

  // Register the selects
  useEffect(() => {
      register("doctorData.location");
      register("patientData.gender");
      register("role");
  }, [register]);

  return (
    <>
      <div className="container grid lg:h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] py-10 px-5 sm:py-14 sm:px-10 md:px-36 lg:py-0 lg:pl-14 lg:pr-12 xl:px-24">
        <div
          className={clsx([
            "relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0 dark:bg-darkmode-600",
            "before:content-[''] before:absolute before:inset-0 before:-mb-3.5 before:bg-white/40 before:rounded-2xl before:mx-5 dark:before:hidden",
          ])}
        >
          <div className="relative z-10 flex flex-col justify-center w-full h-full py-2 lg:py-32">
            <img width={50} src={LogoDark} alt="logo" />
            <div className="text-2xl font-medium">Sign In</div>
            <div className="mt-2.5 text-slate-600 dark:text-slate-400">
              vous avez déja un compte?{" "}
              <a className="font-medium text-primary" href="/login">
                Se connectez
              </a>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6">
                <div className="flex flex-row gap-3">
                  <div>
                    <FormLabel>First Name*</FormLabel>
                    <FormInput
                      type="text"
                      placeholder="First Name"
                      {...register("first_name")}
                    />
                    {errors.first_name && (
                      <span className="text-red-500 text-sm">
                        {errors.first_name.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <FormLabel>Last Name*</FormLabel>
                    <FormInput
                      type="text"
                      placeholder="Last Name"
                      {...register("last_name")}
                    />
                    {errors.last_name && (
                      <span className="text-red-500 text-sm">
                        {errors.last_name.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-5">
                  <div>
                    <FormLabel>Email*</FormLabel>
                    <FormInput
                      type="text"
                      placeholder="Email@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-row gap-3 mt-5">
                  <div>
                    <FormLabel>Password*</FormLabel>
                    <FormInput
                      type="password"
                      placeholder="************"
                      {...register("password")}
                    />
                    {errors.password && (
                      <span className="text-red-500 text-sm">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <FormLabel>Password Confirmation*</FormLabel>
                    <FormInput
                      type="password"
                      placeholder="************"
                      {...register("passwordConfirmation")}
                    />
                    {errors.passwordConfirmation && (
                      <span className="text-red-500 text-sm">
                        {errors.passwordConfirmation.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-5">
                  <FormLabel>Role*</FormLabel>
                  <Select
                    name="role"
                    options={[
                      { value: "Docteur", label: "Docteur" },
                      { value: "Patient", label: "Patient" },
                    ]}
                    onChange={(selectedOption) => {
                      setValue("role", selectedOption?.value || "");
                      setSelectedRole(selectedOption?.value || "");
                    }}
                  />
                  {errors.role && (
                    <span className="text-red-500 text-sm">
                      {errors.role.message}
                    </span>
                  )}
                </div>
                {selectedRole === "Docteur" && (
                  <>
                    <div className="mt-5">
                      <FormLabel>Speciality*</FormLabel>
                      <Select
                        isMulti
                        name="doctorData.speciality_ids"
                        options={doctorSpecialities.map((s) => ({
                          value: s._id,
                          label: s.label,
                        }))}
                        onChange={(selectedOptions) => {
                          setValue(
                            "doctorData.speciality_ids",
                            selectedOptions
                              ? selectedOptions.map((option) => option.value)
                              : []
                          );
                        }}
                      />
                      {errors.doctorData?.speciality_ids && (
                        <span className="text-red-500 text-sm">
                          {errors.doctorData.speciality_ids.message}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <FormLabel>Experience*</FormLabel>
                      <FormInput
                        type="number"
                        placeholder="Enter your experience"
                        {...register("doctorData.experience")}
                      />
                      {errors.doctorData?.experience && (
                        <span className="text-red-500 text-sm">
                          {errors.doctorData.experience.message}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <FormLabel>Office Adresse*</FormLabel>
                      <FormInput
                        type="text"
                        placeholder="Enter your office address"
                        {...register("doctorData.office_Adresse")}
                      />
                      {errors.doctorData?.office_Adresse && (
                        <span className="text-red-500 text-sm">
                          {errors.doctorData.office_Adresse.message}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <FormLabel>Phone Number*</FormLabel>
                      <FormInput
                        type="text"
                        placeholder="Enter your phone number"
                        {...register("doctorData.phone_number")}
                      />
                      {errors.doctorData?.phone_number && (
                        <span className="text-red-500 text-sm">
                          {errors.doctorData.phone_number.message}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <FormLabel>Location*</FormLabel>
                      <Select
                        name="doctorData.location"
                        options={Locations.map((location) => ({
                          value: location.ville,
                          label: location.ville,
                        }))}
                        onChange={(selectedOption) => {
                          setValue(
                            "doctorData.location",
                            selectedOption?.value || ""
                          );
                        }}
                      />
                      {errors.doctorData?.location && (
                        <span className="text-red-500 text-sm">
                          {errors.doctorData.location.message}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <FormLabel>Placement*</FormLabel>
                      <FormInput
                        type="text"
                        placeholder="Enter your placement"
                        {...register("doctorData.placement")}
                      />
                      {errors.doctorData?.placement && (
                        <span className="text-red-500 text-sm">
                          {errors.doctorData.placement.message}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {selectedRole === "Patient" && (
                  <>
                    <div className="mt-5">
                      <FormLabel>Birth Date*</FormLabel>
                      <FormInput
                        type="date"
                        {...register("patientData.birth_date")}
                      />
                      {errors.patientData?.birth_date && (
                        <span className="text-red-500 text-sm">
                          {errors.patientData.birth_date.message}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <FormLabel>Gender*</FormLabel>
                      <Select
                        name="patientData.gender"
                        options={genderOptions}
                        onChange={(selectedOption) => {
                          setValue(
                            "patientData.gender",
                            selectedOption?.value || ""
                          );
                        }}
                      />
                      {errors.patientData?.gender && (
                        <span className="text-red-500 text-sm">
                          {errors.patientData.gender.message}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <FormLabel>Address*</FormLabel>
                      <FormInput
                        type="text"
                        placeholder="Enter your address"
                        {...register("patientData.Adresse")}
                      />
                      {errors.patientData?.Adresse && (
                        <span className="text-red-500 text-sm">
                          {errors.patientData.Adresse.message}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <FormLabel>Phone Number*</FormLabel>
                      <FormInput
                        type="text"
                        placeholder="Enter your phone number"
                        {...register("patientData.phone_number")}
                      />
                      {errors.patientData?.phone_number && (
                        <span className="text-red-500 text-sm">
                          {errors.patientData.phone_number.message}
                        </span>
                      )}
                    </div>
                  </>
                )}

                <div className="mt-5 text-center">
                  <Button
                    type="submit"
                    variant="outline-secondary"
                    rounded
                    className="bg-white/70 w-full py-3.5 mt-3"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="fixed container grid w-screen inset-0 h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] pl-14 pr-12 xl:px-24">
        <div
          className={clsx([
            "relative h-screen col-span-12 lg:col-span-5 2xl:col-span-4 z-20",
            "after:bg-white after:hidden after:lg:block after:content-[''] after:absolute after:right-0 after:inset-y-0 after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] dark:after:bg-darkmode-600 dark:after:from-darkmode-600 dark:after:to-darkmode-600",
            "before:content-[''] before:hidden before:lg:block before:absolute before:right-0 before:inset-y-0 before:my-6 before:bg-gradient-to-b before:from-white/10 before:to-slate-50/10 before:bg-white/50 before:w-[800%] before:-mr-4 before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] dark:before:from-darkmode-300 dark:before:to-darkmode-300",
          ])}
        ></div>
        <div
          className={clsx([
            "h-full col-span-7 2xl:col-span-8 lg:relative",
            "before:content-[''] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:w-screen before:lg:w-[800%]",
            "after:content-[''] after:absolute after:inset-y-0 after:left-0 after:w-screen after:lg:w-[800%] after:bg-texture-white after:bg-fixed after:bg-center after:lg:bg-[25rem_-25rem] after:bg-no-repeat",
          ])}
        >
          <div className="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36">
            <div className="leading-[1.4] text-[2.6rem] xl:text-5xl font-medium xl:leading-[1.2] text-white">
              Simplify Healthcare with Easy Appointments
            </div>
            <div className="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
              Book your next doctor’s visit effortlessly. <br /> Our platform
              connects patients with trusted doctors, ensuring a smooth and
              hassle-free scheduling experience. Get started today for better
              healthcare access!
            </div>
          </div>
        </div>
      </div>
      <ThemeSwitcher />
    </>
  );
}

export default Main;
