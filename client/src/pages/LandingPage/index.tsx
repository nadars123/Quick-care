import "@/assets/css/pages/landing-page.css";
import Lucide, { icons } from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import {
  setColorScheme,
  colorSchemes,
  ColorSchemes,
} from "@/stores/colorSchemeSlice";
import { setPageLoader } from "@/stores/pageLoaderSlice";
import { selectColorScheme } from "@/stores/colorSchemeSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import ReportDonutChart7 from "@/components/ReportDonutChart7";
import { Link, useNavigate } from "react-router-dom";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import messages from "@/fakers/messages";
import activities from "@/fakers/activities";
import { themes, Themes } from "@/stores/themeSlice";
import { useState } from "react";
import clsx from "clsx";
import _ from "lodash";
import Logo from '@/assets/images/doctorino/QUICKCARE WHITE.png'
import LogoDark from "@/assets/images/doctorino/QUICKCARE WHITE.png";
import { FormCheck, FormInput, FormLabel } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import axios from "axios";

function Main() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [topBarActive, setTopBarActive] = useState(false);
  const [showcaseActive, setShowcaseActive] = useState(true);
  const activeColorScheme = useAppSelector(selectColorScheme);
  const [tempActiveColorScheme, setTempActiveColorScheme] =
    useState(activeColorScheme);

  const setColorSchemeClass = () => {
    const el = document.querySelectorAll("html")[0];
    el.setAttribute("class", activeColorScheme);
  };

  const switchColor = (colorScheme: ColorSchemes) => {
    setTempActiveColorScheme(colorScheme);

    setTimeout(() => {
      dispatch(setColorScheme(colorScheme));
    }, 500);
    localStorage.setItem("colorScheme", colorScheme);
    setColorSchemeClass();
  };

  const scrollTo = (e: React.MouseEvent) => {
    e.preventDefault();

    const targetId = (e.target as HTMLElement).getAttribute("data-link");
    const el = document.getElementById(
      targetId !== null ? targetId.slice(1) : ""
    );

    if (el !== null) {
      window.scroll({
        behavior: "smooth",
        left: 0,
        top: el.offsetTop - 140,
      });
    }
  };

  const previewTheme = (theme: Themes) => {
    dispatch(setPageLoader(true));
    navigate(`/?theme=${theme.name}`);
  };

  setColorSchemeClass();

  const themesImageAssets = import.meta.glob<{
    default: string;
  }>("/src/assets/images/themes/*.{jpg,jpeg,png,svg}", { eager: true });

  const frameworkImageAssets = import.meta.glob<{
    default: string;
  }>("/src/assets/images/frameworks/*.{jpg,jpeg,png,svg}", { eager: true });

  const pageImageAssets = import.meta.glob<{
    default: string;
  }>("/src/assets/images/pages/*.{jpg,jpeg,png,svg}", { eager: true });

  window.onscroll = () => {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      setTopBarActive(true);
    } else {
      setTopBarActive(false);
    }

    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      setShowcaseActive(false);
    } else {
      setShowcaseActive(true);
    }
  };

  const [groups, setGroups] = useState<
    Array<{
      group: string;
      icon: keyof typeof icons;
      active: boolean;
      pages: Array<{
        name: string;
        pathname: string;
        image: string;
      }>;
    }>
  >([
    {
      group: "Dashboards",
      icon: "GaugeCircle",
      active: true,
      pages: [
        {
          name: "E-Commerce",
          pathname: "/dashboard-overview-1",
          image: "dashboard-overview-1",
        },
        {
          name: "CRM",
          pathname: "/dashboard-overview-2",
          image: "dashboard-overview-2",
        },
        {
          name: "Hospital",
          pathname: "/dashboard-overview-3",
          image: "dashboard-overview-3",
        },
        {
          name: "Factory",
          pathname: "/dashboard-overview-4",
          image: "dashboard-overview-4",
        },
        {
          name: "Banking",
          pathname: "/dashboard-overview-5",
          image: "dashboard-overview-5",
        },
        {
          name: "Cafe",
          pathname: "/dashboard-overview-6",
          image: "dashboard-overview-6",
        },
        {
          name: "Crypto",
          pathname: "/dashboard-overview-7",
          image: "dashboard-overview-7",
        },
        {
          name: "Hotel",
          pathname: "/dashboard-overview-8",
          image: "dashboard-overview-8",
        },
      ],
    },
    {
      group: "Apps",
      icon: "ActivitySquare",
      active: false,
      pages: [
        {
          name: "Inbox",
          pathname: "/inbox",
          image: "inbox",
        },
        {
          name: "File Manager List",
          pathname: "/file-manager-list",
          image: "file-manager-list",
        },
        {
          name: "File Manager Grid",
          pathname: "/file-manager-grid",
          image: "file-manager-grid",
        },
      ],
    },
    {
      group: "UI Widgets",
      icon: "Album",
      active: false,
      pages: [
        {
          name: "Creative",
          pathname: "/creative",
          image: "creative",
        },
        {
          name: "Dynamic",
          pathname: "/dynamic",
          image: "dynamic",
        },
        {
          name: "Interactive",
          pathname: "/interactive",
          image: "interactive",
        },
      ],
    },
    {
      group: "User Management",
      icon: "BookMarked",
      active: false,
      pages: [
        {
          name: "Users",
          pathname: "/users",
          image: "users",
        },
        {
          name: "Departments",
          pathname: "/departments",
          image: "departments",
        },
        {
          name: "Add User",
          pathname: "/add-user",
          image: "add-user",
        },
      ],
    },
    {
      group: "Personal Dashboard",
      icon: "HardDrive",
      active: false,
      pages: [
        {
          name: "Profile Overview",
          pathname: "/profile-overview",
          image: "profile-overview",
        },
        {
          name: "Events",
          pathname: "/profile-overview?page=events",
          image: "profile-overview-events",
        },
        {
          name: "Achievements",
          pathname: "/profile-overview?page=achievements",
          image: "profile-overview-achievements",
        },
        {
          name: "Contacts",
          pathname: "/profile-overview?page=contacts",
          image: "profile-overview-contacts",
        },
        {
          name: "Default",
          pathname: "/profile-overview?page=default",
          image: "profile-overview-default",
        },
      ],
    },
    {
      group: "General Settings",
      icon: "MousePointerSquare",
      active: false,
      pages: [
        {
          name: "Profile Info",
          pathname: "/settings",
          image: "settings",
        },
        {
          name: "Email Settings",
          pathname: "/settings?page=email-settings",
          image: "settings-email-settings",
        },
        {
          name: "Security",
          pathname: "/settings?page=security",
          image: "settings-security",
        },
        {
          name: "Preferences",
          pathname: "/settings?page=preferences",
          image: "settings-preferences",
        },
        {
          name: "Two-factor Authentication",
          pathname: "/settings?page=two-factor-authentication",
          image: "settings-two-factor-authentication",
        },
        {
          name: "Device History",
          pathname: "/settings?page=device-history",
          image: "settings-device-history",
        },
        {
          name: "Notification Settings",
          pathname: "/settings?page=notification-settings",
          image: "settings-notification-settings",
        },
        {
          name: "Connected Services",
          pathname: "/settings?page=connected-services",
          image: "settings-connected-services",
        },
        {
          name: "Social Media Links",
          pathname: "/settings?page=social-media-links",
          image: "settings-social-media-links",
        },
        {
          name: "Account Deactivation",
          pathname: "/settings?page=account-deactivation",
          image: "settings-account-deactivation",
        },
      ],
    },
    {
      group: "Account",
      icon: "ShieldHalf",
      active: false,
      pages: [
        {
          name: "Billing",
          pathname: "/billing",
          image: "billing",
        },
        {
          name: "Invoice",
          pathname: "/invoice",
          image: "invoice",
        },
      ],
    },
    {
      group: "E-Commerce",
      icon: "Building",
      active: false,
      pages: [
        {
          name: "Categories",
          pathname: "/categories",
          image: "categories",
        },
        {
          name: "Add Product",
          pathname: "/add-product",
          image: "add-product",
        },
        {
          name: "Product List",
          pathname: "/product-list",
          image: "product-list",
        },
        {
          name: "Product Grid",
          pathname: "/product-grid",
          image: "product-grid",
        },
        {
          name: "Transaction List",
          pathname: "/transaction-list",
          image: "transaction-list",
        },
        {
          name: "Transaction Detail",
          pathname: "/transaction-detail",
          image: "transaction-detail",
        },
        {
          name: "Seller List",
          pathname: "/seller-list",
          image: "seller-list",
        },
        {
          name: "Seller Detail",
          pathname: "/seller-detail",
          image: "seller-detail",
        },
        {
          name: "Reviews",
          pathname: "/reviews",
          image: "reviews",
        },
        {
          name: "Point of Sale",
          pathname: "/point-of-sale",
          image: "point-of-sale",
        },
      ],
    },
    {
      group: "Authentications",
      icon: "PanelRightClose",
      active: false,
      pages: [
        {
          name: "Login",
          pathname: "/login",
          image: "login",
        },
        {
          name: "Register",
          pathname: "/register",
          image: "register",
        },
      ],
    },
  ]);

  const setActiveGroup = (e: React.MouseEvent, key: number) => {
    e.preventDefault();

    const computedGroups = groups.map((group, groupKey) => {
      return {
        ...group,
        active: groupKey === key,
      };
    });

    setGroups(computedGroups);
  };

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required"),
  });

   const {
     register,
     handleSubmit,
     formState: { errors },
     reset,
   } = useForm({
     resolver: yupResolver(schema),
   });

   const onSubmit = async (data) => {
     try {
       await axios.post(
         "http://localhost:7000/api/v1/contact",
         data
       );
       toast.success("Message sent successfully!");
       reset(); // clear the form
     } catch (error) {
       console.error(error);
       toast.error("Something went wrong!");
     }
   };

  return (
    <div
      className={clsx([
        "landing-page relative",
        "before:content-[''] before:w-screen before:h-screen before:fixed before:bg-slate-100 before:z-[-1]",
        !showcaseActive && "landing-page--scrolled",
      ])}
    >
      <div
        className={clsx([
          "relative group background overflow-x-hidden scroll-smooth",
          "before:content-[''] before:w-screen before:h-screen before:rounded-[0_0_50%] [&.background--hidden]:before:from-slate-100 [&.background--hidden]:before:to-transparent before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:absolute before:z-[-1] before:transition-colors before:ease-in-out before:duration-300",
          "after:content-[''] after:z-[-1] after:h-screen after:w-screen [&.background--hidden]:after:opacity-0 after:transition-[opacity,height] after:ease-in-out after:duration-300 after:top-0 after:fixed after:bg-texture-white after:bg-contain after:bg-fixed after:bg-[center_-25rem] after:bg-no-repeat",
          topBarActive && "background--hidden",
        ])}
      >
        <div className="container fixed inset-x-0 z-50 px-5 mx-auto xl:px-0">
          <div
            className={clsx([
              "relative flex items-center h-16 w-full mt-5 px-5",
              "before:content-[''] before:inset-0 before:box before:absolute before:opacity-0 before:border-0 before:bg-gradient-to-r before:from-theme-1 before:to-theme-2 before:rounded-xl",
              "group-[.background--hidden]:before:opacity-100",
              "after:content-[''] after:z-[-1] after:inset-x-4 after:shadow-sm after:opacity-0 after:h-full after:bg-primary/5 after:border after:border-primary/10 after:absolute after:rounded-lg after:mx-auto after:top-0 after:mt-3 after:dark:bg-darkmode-600/70 after:dark:border-darkmode-500/60",
              "group-[.background--hidden]:after:opacity-100",
            ])}
          >
            <a className="relative z-10 flex items-center lg:mr-14" href="">
              <div className="font-medium text-white ml-3.5 text-lg">
                <img width={120} src={Logo} alt="logo-quick-care" />
              </div>
            </a>
            <div
              className={clsx([
                "main-menu [&.main-menu--show]:flex hidden fixed inset-0 md:flex flex-col items-center justify-center flex-1 gap-5 text-xl text-white md:text-sm md:relative md:flex-row lg:gap-10 bg-gradient-to-b from-theme-1 to-theme-2/90 md:bg-none",
                { "main-menu--show": showMobileMenu },
              ])}
            >
              <a
                onClick={(e) => {
                  scrollTo(e);
                  setShowMobileMenu(!showMobileMenu);
                }}
                data-link="#themes-variants"
                className="cursor-pointer"
              >
                Accueil
              </a>
              <a
                onClick={(e) => {
                  scrollTo(e);
                  setShowMobileMenu(!showMobileMenu);
                }}
                data-link="#pages-layouts"
                className="cursor-pointer"
              >
                Services
              </a>
              <a
                onClick={(e) => {
                  scrollTo(e);
                  setShowMobileMenu(!showMobileMenu);
                }}
                data-link="#frameworks"
                className="cursor-pointer"
              >
                À propos
              </a>
              <a
                onClick={(e) => {
                  scrollTo(e);
                  setShowMobileMenu(!showMobileMenu);
                }}
                data-link="#pricing"
                className="cursor-pointer"
              >
                Contactez Nous
              </a>
            </div>
            <div className="flex gap-2.5 relative ml-auto md:ml-0">
              <Button
                as="a"
                href="/login"
                target=""
                rounded
                className="hidden px-5 text-white md:block bg-white/10 border-white/10"
              >
                <span className="hidden lg:block">Se connecter</span>

                <Lucide icon="Download" className="w-4 h-4 lg:hidden" />
              </Button>
              <Button
                as="a"
                href="/register"
                target=""
                rounded
                className="hidden px-5 text-white md:block bg-white/10 border-white/10"
              >
                <span className="hidden lg:block">S'inscrire</span>

                <Lucide icon="Download" className="w-4 h-4 lg:hidden" />
              </Button>
              <Button
                rounded
                className="px-5 text-white bg-white/10 border-white/10 md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <Lucide icon="X" className="w-4 h-4" />
                ) : (
                  <Lucide icon="AlignJustify" className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="container relative z-10 pt-40">
          <div className="flex flex-col items-center gap-56 mb-40">
            <div className="flex flex-col items-center mt-[6rem]">
              <div className="text-5xl font-bold leading-[1.4] text-center text-white group-[.background--hidden]:text-slate-600 font-medium">
                Rendez-vous pour votre consultation médicale <br /> & protéger
                votre santé
              </div>
              <div className="mt-4 text-sm leading-[1.6] text-center text-white/70 group-[.background--hidden]:text-slate-600/70 px-10 md:px-0">
                En améliorant chaque aspect de la consultation médicale, nous
                visons à offrir une expérience satisfaisante et efficace aux
                patients, <br /> tout en assurant la meilleure qualité de soins
                possible. Notre engagement envers l'excellence dans les soins
                médicaux.
              </div>
            </div>

            <div className="flex flex-col items-center w-full" id="colors">
              <div className="grid w-full grid-cols-6 gap-5 px-10 mt-10 sm:px-20">
                <div className="col-span-6 mt-2 md:col-span-3 lg:col-span-2">
                  <div className="p-1 box box--stacked">
                    <div
                      className={clsx([
                        "py-6 rounded-lg px-7 bg-gradient-to-r from-theme-2/[0.85] to-theme-1/[0.85] relative overflow-hidden",
                        "before:content-[''] before:w-64 before:h-64 before:border before:border-dashed before:rounded-full before:absolute before:border-white/[0.15] before:right-0 before:top-0 before:-mt-5 before:-mr-28",
                        "after:content-[''] after:w-80 after:h-80 after:border after:border-dashed after:rounded-full after:absolute after:border-white/[0.15] after:right-0 after:top-0 after:mt-20 after:-mr-20",
                      ])}
                    >
                      <Lucide
                        icon="Award"
                        className="stroke-[0.8] w-10 h-10 text-white/10 absolute right-0 top-0 mt-24 mr-14 rotate-12"
                      />
                      <Lucide
                        icon="Album"
                        className="stroke-[0.7] w-10 h-10 text-white/10 absolute left-0 top-0 mt-80 ml-10 -rotate-12"
                      />
                      <Menu className="absolute top-0 right-0 mt-5 mr-9">
                        <Menu.Button className="w-5 h-5 text-white/60">
                          <Lucide
                            icon="MoreHorizontal"
                            className="w-6 h-6 stroke-white/60 fill-white/60"
                          />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          <Menu.Item>
                            <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                            Link
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="Trash" className="w-4 h-4 mr-2" />
                            Delete
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                      <Lucide
                        icon="Goal"
                        className="stroke-[0.5] w-16 h-16 text-white/50 fill-white/5"
                      />
                      <div className="text-2xl font-medium text-white mt-7">
                        Consultation médicale
                      </div>
                      <div className="mt-2 leading-relaxed text-white/80">
                        Notre plateforme offre un accès fiable à des services de
                        santé de qualité, où que vous soyez. Grâce à notre
                        plateforme, vous pouvez bénéficier d'une consultation
                        médicale en ligne avec des professionnels de la santé
                        qualifiés, sans avoir à se déplacer physiquement jusqu'à
                        un cabinet médical Que ce soit pour des questions de
                        santé mineures, des préoccupations chroniques ou des
                        conseils médicaux généraux.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-6 mt-2 md:col-span-3 lg:col-span-2">
                  <div className="p-1 box box--stacked">
                    <div
                      className={clsx([
                        "py-6 rounded-lg px-7 bg-gradient-to-r from-theme-2/[0.85] to-theme-1/[0.85] relative overflow-hidden",
                        "before:content-[''] before:w-64 before:h-64 before:border before:border-dashed before:rounded-full before:absolute before:border-white/[0.15] before:right-0 before:top-0 before:-mt-5 before:-mr-28",
                        "after:content-[''] after:w-80 after:h-80 after:border after:border-dashed after:rounded-full after:absolute after:border-white/[0.15] after:right-0 after:top-0 after:mt-20 after:-mr-20",
                      ])}
                    >
                      <Lucide
                        icon="Award"
                        className="stroke-[0.8] w-10 h-10 text-white/10 absolute right-0 top-0 mt-24 mr-14 rotate-12"
                      />
                      <Lucide
                        icon="Album"
                        className="stroke-[0.7] w-10 h-10 text-white/10 absolute left-0 top-0 mt-80 ml-10 -rotate-12"
                      />
                      <Menu className="absolute top-0 right-0 mt-5 mr-9">
                        <Menu.Button className="w-5 h-5 text-white/60">
                          <Lucide
                            icon="MoreHorizontal"
                            className="w-6 h-6 stroke-white/60 fill-white/60"
                          />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          <Menu.Item>
                            <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                            Link
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="Trash" className="w-4 h-4 mr-2" />
                            Delete
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                      <Lucide
                        icon="Goal"
                        className="stroke-[0.5] w-16 h-16 text-white/50 fill-white/5"
                      />
                      <div className="text-2xl font-medium text-white mt-7">
                        Prise de rendez-vous
                      </div>
                      <div className="mt-2 leading-relaxed text-white/80">
                        Le service de prise de rendez-vous offre aux patients
                        une solution efficace et pratique pour planifier leurs
                        consultations avec des professionnels de la santé. Grâce
                        à notre interface conviviale, les patients peuvent
                        facilement parcourir les disponibilités des médecins et
                        sélectionner un créneau horaire qui leur convient le
                        mieux. Que ce soit pour une consultation médicale
                        générale, une visite de suivi ou une intervention
                        spécialisée.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-6 mt-2 md:col-span-3 lg:col-span-2">
                  <div className="p-1 box box--stacked">
                    <div
                      className={clsx([
                        "py-6 rounded-lg px-7 bg-gradient-to-r from-theme-2/[0.85] to-theme-1/[0.85] relative overflow-hidden",
                        "before:content-[''] before:w-64 before:h-64 before:border before:border-dashed before:rounded-full before:absolute before:border-white/[0.15] before:right-0 before:top-0 before:-mt-5 before:-mr-28",
                        "after:content-[''] after:w-80 after:h-80 after:border after:border-dashed after:rounded-full after:absolute after:border-white/[0.15] after:right-0 after:top-0 after:mt-20 after:-mr-20",
                      ])}
                    >
                      <Lucide
                        icon="Award"
                        className="stroke-[0.8] w-10 h-10 text-white/10 absolute right-0 top-0 mt-24 mr-14 rotate-12"
                      />
                      <Lucide
                        icon="Album"
                        className="stroke-[0.7] w-10 h-10 text-white/10 absolute left-0 top-0 mt-80 ml-10 -rotate-12"
                      />
                      <Menu className="absolute top-0 right-0 mt-5 mr-9">
                        <Menu.Button className="w-5 h-5 text-white/60">
                          <Lucide
                            icon="MoreHorizontal"
                            className="w-6 h-6 stroke-white/60 fill-white/60"
                          />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          <Menu.Item>
                            <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                            Link
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="Trash" className="w-4 h-4 mr-2" />
                            Delete
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                      <Lucide
                        icon="Goal"
                        className="stroke-[0.5] w-16 h-16 text-white/50 fill-white/5"
                      />
                      <div className="text-2xl font-medium text-white mt-7">
                        Suivie médical
                      </div>
                      <div className="mt-2 leading-relaxed text-white/80">
                        Le service de suivi médical offre aux patients la
                        possibilité de bénéficier d'un suivi continu de leur
                        santé et de leur bien-être. Après une consultation
                        initiale, les patients peuvent utiliser notre plateforme
                        pour rester en contact avec leur médecin traitant,
                        partager des mises à jour sur leur état de santé et
                        recevoir des conseils médicaux personnalisés. Que ce
                        soit pour surveiller les progrès d'un traitement,
                        ajuster un plan de soins ou discuter de nouveaux
                        symptômes.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center w-full" id="frameworks">
              <div
                className={clsx([
                  "text-3xl font-medium relative",
                  "before:content-[''] before:bg-gradient-to-b before:from-transparent before:via-slate-100/80 before:to-slate-100 before:inset-0 before:absolute before:h-[360%] before:w-[150%] before:-mt-[4.5rem] before:-ml-[25%]",
                ])}
              >
                <div className="absolute inset-x-0 w-48 h-48 mx-auto rounded-full -mt-36 z-[-1]">
                  <div className="absolute inset-y-0 w-1/2 my-auto rounded-full bg-gradient-to-b from-transparent to-theme-1/[0.05] border-theme-1/[0.13] border h-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-1/2 rounded-full bg-gradient-to-b from-transparent to-theme-1/[0.05] border-theme-1/[0.13] border h-1/2"></div>
                  <div className="absolute inset-x-0 bottom-0 w-1/2 mx-auto rounded-full bg-gradient-to-b from-transparent to-theme-1/[0.05] border-theme-1/[0.13] border h-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-1/2 rounded-full bg-gradient-to-b from-transparent to-theme-1/[0.05] border-theme-1/[0.13] border h-1/2"></div>
                  <div className="absolute inset-y-0 right-0 w-1/2 my-auto rounded-full bg-gradient-to-b from-transparent to-theme-1/[0.05] border-theme-1/[0.13] border h-1/2"></div>
                  <div className="absolute inset-x-0 top-0 w-1/2 mx-auto rounded-full bg-gradient-to-b from-transparent to-theme-1/[0.05] border-theme-1/[0.13] border h-1/2"></div>
                </div>
                <div className="relative text-center z-5 text-theme-1">
                  <h6>À propos de nous</h6>
                </div>
              </div>
              <div className="relative mt-4 text-base text-center px-14 sm:px-0 text-slate-500/80 z-5">
                Mieux nous connaître!
              </div>
              <div className="-mx-2.5 mt-10 px-10 sm:px-20">
                <div className="flex flex-wrap justify-center w-full gap-y-8">
                  <div className="sm:w-1/2 lg:w-1/2 px-2.5">
                    <div className="flex flex-col items-center p-5 box box--stacked">
                      <div className="pb-2 mt-2 leading-relaxed text-center text-slate-500">
                        La plateforme Online Medicale Care offre une solution
                        moderne et pratique pour accéder à des services de santé
                        à distance. Grâce à son interface conviviale et à sa
                        disponibilité, les utilisateurs peuvent consulter des
                        médecins qualifiés et obtenir des conseils médicaux
                        personnalisés où qu'ils soient. Cette plateforme permet
                        également la gestion des rendez-vous en ligne, ce qui
                        simplifie le processus pour les patients et réduit les
                        temps d'attente. Avec des fonctionnalités telles que la
                        messagerie sécurisée et la téléconsultation vidéo, les
                        patients peuvent communiquer facilement et en toute
                        confidentialité avec leurs professionnels de santé.
                      </div>
                    </div>
                  </div>

                  <div className="sm:w-1/2 lg:w-1/2 px-2.5">
                    <div className="flex flex-col items-center p-5 box box--stacked">
                      <div className="pb-2 mt-2 leading-relaxed text-center text-slate-500">
                        La plateforme eSanté Connect révolutionne l'accès aux
                        soins en permettant aux patients de bénéficier de
                        consultations médicales à distance en toute simplicité.
                        Grâce à une interface intuitive et sécurisée, les
                        utilisateurs peuvent prendre rendez-vous en ligne,
                        discuter avec des médecins spécialisés et recevoir un
                        accompagnement médical personnalisé sans quitter leur
                        domicile. La solution intègre également un système de
                        notifications pour rappeler les rendez-vous et assurer
                        un meilleur suivi des patients. Offrant un gain de temps
                        précieux, eSanté Connect s’impose comme un outil
                        indispensable pour une santé moderne et connectée.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-10 -mt-24 sm:px-20">
              <div className="p-1 box box--stacked">
                <div
                  className={clsx([
                    "relative px-10 sm:px-20 py-20 overflow-hidden bg-gradient-to-b from-theme-1 to-theme-2 rounded-[0.6rem]",
                    "after:content-[''] after:h-full after:w-full after:ease-in-out after:duration-300 after:top-0 after:absolute after:left-0 after:bg-texture-white after:bg-contain after:bg-[center_-5rem] after:bg-no-repeat",
                  ])}
                >
                  <div className="relative z-10 text-center  lg:w-100">
                    <div className="text-xl font-medium text-white">
                      Contactez Nous
                    </div>
                    <div className="mt-4 w-100 text-base leading-relaxed text-white/70">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-6 w-100 space-y-4"
                      >
                        <div>
                          <FormLabel className="text-start">Prenom*</FormLabel>
                          <FormInput
                            type="text"
                            placeholder="ecrire votre prenom"
                            className="block px-4 py-3.5 text-black rounded-[0.6rem] border-slate-300/80"
                            {...register("firstName")}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <FormLabel>Nom*</FormLabel>
                          <FormInput
                            type="text"
                            placeholder="ecrire votre nom"
                            className="block px-4 py-3.5 rounded-[0.6rem] text-black  border-slate-300/80"
                            {...register("lastName")}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <FormLabel>Mail*</FormLabel>
                          <FormInput
                            type="email"
                            placeholder="ecrire votre email"
                            className="block px-4 py-3.5 rounded-[0.6rem] text-black  border-slate-300/80"
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <FormLabel>Sujet*</FormLabel>
                          <input
                            type="text"
                            placeholder="ecrire votre sujet"
                            className="w-full block px-4 py-3.5 rounded-[0.6rem] border border-slate-300/80 text-black"
                            {...register("subject")}
                          />
                          {errors.subject && (
                            <p className="text-red-500 text-sm">
                              {errors.subject.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <FormLabel>Message*</FormLabel>
                          <textarea
                            rows="5"
                            placeholder="ecrire votre message"
                            className="w-full block px-4 py-3.5 rounded-[0.6rem] border border-slate-300/80 text-black"
                            {...register("message")}
                          />
                          {errors.message && (
                            <p className="text-red-500 text-sm">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
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
