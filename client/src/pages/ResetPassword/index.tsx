import { FormInput, FormLabel } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import Logo from "@/assets/images/doctorino/LOGO.png";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Main() {
    const { token } = useParams();
    const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/user/resetPassword",
        {
          token: token,
          password: data.password,
        }
      );
      toast.success(response.data.message);
         setTimeout(() => {
           navigate("/login");
         }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

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
            <img width={50} src={Logo} alt="logo" />
            <div className="mt-10">
              <div className="text-2xl font-medium">Forgot Password</div>
              <div className="mt-2.5 text-slate-600 dark:text-slate-400">
                Have already an account?{" "}
                <a href="/login" className="font-medium text-primary">
                  Login
                </a>
              </div>
              <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                <FormLabel>New Password*</FormLabel>
                <div className="relative">
                  <FormInput
                    type={showPassword ? "text" : "password"}
                    className="block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80"
                    placeholder="Enter your new password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}

                <FormLabel className="mt-4">Confirm Password*</FormLabel>
                <div className="relative">
                  <FormInput
                    type={showConfirmPassword ? "text" : "password"}
                    className="block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80"
                    placeholder="Confirm your new password"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}

                <div className="mt-5 text-center xl:mt-8 xl:text-left">
                  <Button
                    type="submit"
                    variant="primary"
                    rounded
                    className="bg-gradient-to-r mb-3 from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3 dark:border-darkmode-400"
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            </div>
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
