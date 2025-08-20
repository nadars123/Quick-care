import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { useSelector } from "react-redux";
import { selectUser } from "@/stores/userSlice";
import { FormInput, FormCheck } from "@/components/Base/Form";
import { toast } from "sonner";
import Locations from "../../utils/Villes.json";
import Select from "react-select";


const Main = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [locations, setLocations] = useState([]);
    const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [allSpecialities, setAllSpecialities] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
      const [preview, setPreview] = useState(null);

  const userFromLocalStorage = localStorage.getItem("user");
  const userFromStore = useSelector(selectUser);
  const user = userFromLocalStorage || userFromStore?.user?.id;
  const userRole = localStorage.getItem("role");
  const userIdWhenDoctor = localStorage.getItem("DoctorID");

   useEffect(() => {
     const fetchImage = async () => {
       try {
         const response = await fetch(
           `http://localhost:7000/api/v1/user/doctors/${userIdWhenDoctor}/image`
         );

         if (response.ok) {
           setPreview(response.url); // Set the image preview
         }
       } catch (error) {
         console.error("Error fetching image:", error);
       }
     };

     if(userRole === "Docteur") {
       fetchImage();
     }

   }, [userIdWhenDoctor]);

  
  useEffect(() => {
    axios
      .get(`http://localhost:7000/api/v1/user/${user}`)
      .then((response) => {
        setUserData(response.data);
        const { first_name, last_name, email } = response.data;
        setFormData({
          first_name,
          last_name,
          email,
          oldPassword: "",
          newPassword: "",
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [user]);

   useEffect(() => {
     const fetchData = async () => {
       try {
         const [allResponse, selectedResponse] = await Promise.all([
           fetch("http://localhost:7000/api/v1/speciality"),
           fetch(
             `http://localhost:7000/api/v1/user/getSpecialitiesByDoctorId/${userIdWhenDoctor}`
           ),
         ]);


         const [allData, selectedData] = await Promise.all([
           allResponse.json(),
           selectedResponse.json(),
         ]);


         setAllSpecialities(allData);
         setSelectedIds(new Set(selectedData)); // No need to map
       } catch (error) {
         console.error("Error fetching specialities:", error);
       } finally {
         setLoading(false);
       }
     };
      if (userRole === 'Docteur') {
        fetchData();
      } 
   }, [userIdWhenDoctor]);

   const options = allSpecialities.map((speciality) => ({
     value: speciality._id,
     label: speciality.label,
     isSelected: selectedIds.has(speciality._id),
   }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    };

    if (formData.oldPassword && formData.newPassword) {
      payload.oldPassword = formData.oldPassword;
      payload.newPassword = formData.newPassword;
    }

    axios
      .put(`http://localhost:7000/api/v1/user/${user}`, payload)
      .then((response) => {
        toast.success(`${response.data.message}`);
        setFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
      })
      .catch((error) => console.error("Error updating user:", error));
  };


  const handleSpecialityChange = (selectedOptions) => {
    const newIds = selectedOptions.map((opt) => opt.value);
    setSelectedIds(new Set(newIds));
  };

  const updateSpecialities = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one speciality!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:7000/api/v1/user/updateDoctorSpeciality/${userIdWhenDoctor}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ speciality_ids: Array.from(selectedIds) }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Specialities updated successfully!");
      } else {
        console.error("Failed to update:", data);
        toast.error("Server error!");
      }
    } catch (error) {
      console.error("Error updating specialities:", error);
      toast.error("Server error!");
    }
  };

  if (!userData) return <div>Loading...</div>;


  const handleImageChange = (e) => {
     const file = e.target.files[0];
     if (file) {
       setImage(file);
       setPreview(URL.createObjectURL(file)); // Replace preview before uploading
     }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error('please select an image')
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    if(userRole === "Docteur") {
      try {
        const response = await fetch(
          `http://localhost:7000/api/v1/user/doctors/${userIdWhenDoctor}/image`,
          {
            method: "PUT",
            body: formData,
          }
        );
  
        const data = await response.json();
        if (response.ok) {
                toast.error("Image uploaded successfully");
        } else {
           toast.error(data.message || "Error uploading image");
  
        }
      } catch (error) {
           toast.error("Server error");
      }
    }
  };

  return (
    <div className="mt-7">
      <div className="flex flex-col box box--stacked">
       
        <div className="p-7">

 {
        userRole === "Docteur" && (
          <div>
            <div className="flex flex-row gap-2 pt-5 items-center">
            {preview ? (
              <img
                className="w-[35px] h-[35px] rounded-full"
                src={preview}
                alt="Doctor"
                width={200}
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full flex items-center justify-center bg-gray-500 text-white ">
                ?
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="flex py-5 border-t md:justify-end px-7 border-slate-200/80">
            <Button
              onClick={handleUpload}
              variant="outline-primary"
              className="w-full px-10 md:w-auto border-primary/50"
            >
              <Lucide
                icon="Pocket"
                className="stroke-[1.3] w-4 h-4 mr-2 -ml-2"
              />
              Upload Image
            </Button>
          </div> 
          </div>
         
        )}



          <div className="flex flex-col pt-5">
            <label className="mb-2 font-medium">First Name</label>
            <FormInput
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col pt-5">
            <label className="mb-2 font-medium">Last Name</label>
            <FormInput
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col pt-5">
            <label className="mb-2 font-medium">Email (Required)</label>
            <FormInput
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col pt-5">
            <label className="mb-2 font-medium">Old Password</label>
            <FormInput
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword || ""}
              onChange={handleChange}
            />
            <FormCheck className="mt-2">
              <FormCheck.Input
                type="checkbox"
                checked={showOldPassword}
                onChange={() => setShowOldPassword(!showOldPassword)}
              />
              <FormCheck.Label>Show Old Password</FormCheck.Label>
            </FormCheck>
          </div>

          <div className="flex flex-col pt-5">
            <label className="mb-2 font-medium">New Password</label>
            <FormInput
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword || ""}
              onChange={handleChange}
            />
            <FormCheck className="mt-2">
              <FormCheck.Input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <FormCheck.Label>Show New Password</FormCheck.Label>
            </FormCheck>
          </div>
        </div>

        <div className="flex py-5 border-t md:justify-end px-7 border-slate-200/80">
          <Button
            onClick={handleSubmit}
            variant="outline-primary"
            className="w-full px-10 md:w-auto border-primary/50"
          >
            <Lucide icon="Pocket" className="stroke-[1.3] w-4 h-4 mr-2 -ml-2" />
            Update
          </Button>
        </div>
        {userRole === "Docteur" && (
          <div>
            <Select
              isMulti
              options={options}
              defaultValue={options.filter((opt) => opt.isSelected)}
              onChange={handleSpecialityChange}
            />

            <div className="flex py-5 border-t md:justify-end px-7 border-slate-200/80">
              <Button
                onClick={updateSpecialities}
                variant="outline-primary"
                className="w-full px-10 md:w-auto border-primary/50"
              >
                <Lucide
                  icon="Pocket"
                  className="stroke-[1.3] w-4 h-4 mr-2 -ml-2"
                />
                Update Specialities
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
