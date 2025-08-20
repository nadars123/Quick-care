import Lucide from "@/components/Base/Lucide";
import {
    FormInline,
    FormInput,
    FormLabel,
    FormSelect,
} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import axios from "axios";
import users from "@/fakers/users";
import { Dialog, Menu } from "@/components/Base/Headless";
import Litepicker from "@/components/Base/Litepicker";
import { useSelector } from "react-redux";
import { selectUser } from "@/stores/userSlice";
import products from "@/fakers/products";
import "@/assets/css/vendors/tabulator.css";

import * as xlsx from "xlsx";
import { useEffect, useRef, createRef, useState } from "react";
import { createIcons, icons } from "lucide";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { stringToHTML } from "@/utils/helper";
import Nodata from "@/assets/images/doctorino/nodata.svg";

interface Doctor {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    id_doctor: {
        speciality_ids: {
            _id: string;
            label: string;
        }[];
        experience: number;
        office_Adresse: string;
        phone_number: string;
        location: string;
        placement: string;
    };
}

function Main() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const userFromLocalStorage = localStorage.getItem("user");
    const userFromStore = useSelector(selectUser);
    const userIdFromStore = userFromStore.user?.id;
    const user = userFromLocalStorage || userIdFromStore;

    const getDoctors = async () => {
        try {
            const response = await axios.get("http://localhost:7000/api/v1/user/getAllUsersBySpecificRole/doctor");
            setDoctors(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    const tableRef = createRef<HTMLDivElement>();
    const tabulator = useRef<Tabulator>();
    const [filter, setFilter] = useState({
        field: "first_name",
        type: "like",
        value: "",
    });

    const initTabulator = () => {
        if (tableRef.current && doctors) {
            tabulator.current = new Tabulator(tableRef.current, {
                data: doctors, // Use the doctors data from the API
                layout: "fitColumns",
                groupStartOpen : false ,
                responsiveLayout: "collapse",
                responsiveLayoutCollapseStartOpen:false,
                placeholder: "No matching records found",
                pagination: "local",
                paginationSize: 10,
                paginationSizeSelector: [10, 20, 30, 40],
                columns: [
                    {
                        title: "",
                        formatter: "responsiveCollapse",
                        width: 40,
                        minWidth: 30,
                        hozAlign: "center",
                        resizable: false,
                        headerSort: false,

                    },
                    {
                        title: "First Name",
                        minWidth: 150,
                        field: "first_name",
                        vertAlign: "middle",
                    },
                    {
                        title: "Last Name",
                        minWidth: 150,
                        field: "last_name",
                        vertAlign: "middle",
                    },
                    {
                        title: "Email",
                        minWidth: 200,
                        field: "email",
                        vertAlign: "middle",
                    },
                    {
                        title: "Specialities",
                        minWidth: 200,
                        formatter: (cell) => {
                            const doctor: Doctor = cell.getRow().getData();
                            return doctor.id_doctor.speciality_ids
                                .map((spec) => spec.label)
                                .join(", ");
                        },
                        vertAlign: "middle",
                    },
                    {
                        title: "Experience",
                        minWidth: 100,
                        field: "id_doctor.experience",
                        hozAlign: "center",
                        vertAlign: "middle",
                    },
                    {
                        title: "Office Address",
                        minWidth: 200,
                        field: "id_doctor.office_Adresse",
                        vertAlign: "middle",
                    },
                    {
                        title: "Phone Number",
                        minWidth: 150,
                        field: "id_doctor.phone_number",
                        vertAlign: "middle",
                    },
                    {
                        title: "Location",
                        minWidth: 150,
                        field: "id_doctor.location",
                        vertAlign: "middle",
                    },
                    {
                        title: "Placement",
                        minWidth: 200,
                        field: "id_doctor.placement",
                        vertAlign: "middle",
                    },
                ],
            });
        }

        tabulator.current?.on("renderComplete", () => {
            createIcons({
                icons,
                attrs: {
                    "stroke-width": 1.5,
                },
                nameAttr: "data-lucide",
            });
        });
    };

    // Redraw table onresize
    const reInitOnResizeWindow = () => {
        window.addEventListener("resize", () => {
            if (tabulator.current) {
                tabulator.current.redraw();
                createIcons({
                    icons,
                    attrs: {
                        "stroke-width": 1.5,
                    },
                    nameAttr: "data-lucide",
                });
            }
        });
    };

    // Filter function
    const onFilter = () => {
        if (tabulator.current) {
            tabulator.current.setFilter(filter.field, filter.type, filter.value);
        }
    };
    // On reset filter
    const onResetFilter = () => {
        setFilter({
            ...filter,
            field: "first_name",
            type: "like",
            value: "",
        });
        onFilter();
    };

    // Export
    const onExportCsv = () => {
        if (tabulator.current) {
            tabulator.current.download("csv", "data.csv");
        }
    };

    const onExportJson = () => {
        if (tabulator.current) {
            tabulator.current.download("json", "data.json");
        }
    };

    const onExportXlsx = () => {
        if (tabulator.current) {
            (window as any).XLSX = xlsx;
            tabulator.current.download("xlsx", "data.xlsx", {
                sheetName: "Products",
            });
        }
    };

    const onExportHtml = () => {
        if (tabulator.current) {
            tabulator.current.download("html", "data.html", {
                style: true,
            });
        }
    };

    // Print
    const onPrint = () => {
        if (tabulator.current) {
            tabulator.current.print();
        }
    };

    useEffect(() => {
        // Initialize Tabulator after doctors data is fetched
        if (doctors.length > 0) {
            initTabulator();
        }

        reInitOnResizeWindow();
    }, [doctors]);

    return (
        <div className="flex flex-row gap-3 flex-wrap ">
            <div className="flex flex-wrap col-span-12 gap-y-10 gap-x-6">
                <div className="grid grid-cols-12 gap-y-10 gap-x-6">
                    <div className="col-span-12">
                        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
                            <div className="text-base font-medium group-[.mode--light]:text-white">
                                Doctors List
                            </div>
                        </div>
                        {doctors.length > 0 ?
                        <div className="flex flex-col gap-8 mt-3.5">
                            <div className="flex flex-col box box--stacked">
                                <div className="flex flex-col p-5 xl:items-center xl:flex-row gap-y-2">
                                    <form
                                        id="tabulator-html-filter-form"
                                        className="flex xl:flex-row flex-col border-dashed gap-x-5 gap-y-2 border border-slate-300/80 xl:border-0 rounded-[0.6rem] p-4 sm:p-5 xl:p-0"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            onFilter();
                                        }}
                                    >
                                        <FormInline className="flex-col items-start xl:flex-row xl:items-center gap-y-2">
                                            <FormLabel className="mr-3 whitespace-nowrap">
                                                Search
                                            </FormLabel>
                                            <FormInput
                                                type="text"
                                                className="form-control !w-64 box pr-10"
                                                id="tabulator-html-filter-value"
                                                placeholder="Search..."
                                                value={filter.value}
                                                onChange={(e) =>
                                                    setFilter({
                                                        ...filter,
                                                        value: e.target.value,
                                                    })
                                                }
                                            />
                                            <Lucide
                                                icon="Search"
                                                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                            />
                                        </FormInline>
                                        <FormInline className="flex-col items-start xl:flex-row xl:items-center gap-y-2">
                                            <FormLabel className="mr-3 whitespace-nowrap">Field</FormLabel>
                                            <FormSelect
                                                className="form-select !w-52 box"
                                                id="tabulator-html-filter-field"
                                                value={filter.field}
                                                onChange={(e) =>
                                                    setFilter({
                                                        ...filter,
                                                        field: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="first_name">First Name</option>
                                                <option value="last_name">Last Name</option>
                                                <option value="email">Email</option>
                                                <option value="id_doctor.experience">Experience</option>
                                                <option value="id_doctor.location">Location</option>

                                            </FormSelect>
                                        </FormInline>
                                        <FormInline className="flex-col items-start xl:flex-row xl:items-center gap-y-2">
                                            <FormLabel className="mr-3 whitespace-nowrap">Type</FormLabel>
                                            <FormSelect
                                                className="form-select !w-52 box"
                                                id="tabulator-html-filter-type"
                                                value={filter.type}
                                                onChange={(e) =>
                                                    setFilter({
                                                        ...filter,
                                                        type: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="like">Like</option>
                                                <option value="=">Equals</option>
                                                <option value="<">Less Than</option>
                                                <option value=">">Greater Than</option>
                                            </FormSelect>
                                        </FormInline>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="ml-auto mt-2 xl:mt-0"
                                        >
                                            Search
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            type="reset"
                                            className="mt-2 xl:mt-0"
                                            onClick={onResetFilter}
                                        >
                                            Reset
                                        </Button>
                                        <Menu className="mr-4 sm:ml-auto xl:ml-0">
                                            <Menu.Button
                                                as={Button}
                                                variant="outline-secondary"
                                                className="w-full sm:w-auto"
                                            >
                                                <Lucide
                                                    icon="FileCheck2"
                                                    className="stroke-[1.3] w-4 h-4 mr-2"
                                                />
                                                Export
                                                <Lucide
                                                    icon="ChevronDown"
                                                    className="stroke-[1.3] w-4 h-4 ml-2"
                                                />
                                            </Menu.Button>
                                            <Menu.Items className="w-40">
                                                <Menu.Item onClick={onExportCsv}>
                                                    <Lucide icon="FileCheck2" className="w-4 h-4 mr-2" />{" "}
                                                    Export CSV
                                                </Menu.Item>
                                                <Menu.Item onClick={onExportJson}>
                                                    <Lucide icon="FileCheck2" className="w-4 h-4 mr-2" />
                                                    Export JSON
                                                </Menu.Item>
                                                <Menu.Item onClick={onExportXlsx}>
                                                    <Lucide icon="FileCheck2" className="w-4 h-4 mr-2" />
                                                    Export XLSX
                                                </Menu.Item>
                                                <Menu.Item onClick={onExportHtml}>
                                                    <Lucide icon="FileCheck2" className="w-4 h-4 mr-2" />
                                                    Export HTML
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Menu>
                                    </form>

                                </div>
                                <div className="overflow-x-auto">
                                    <div className="overflow-y-auto !border-0" ref={tableRef}></div>
                                </div>
                            </div>
                        </div> : <div className="w-[70vw] flex flex-col gap-3 justify-center items-center p-7 rounded-sm bg-white">
                                        <img width={80} src={Nodata} alt="no-data" />
                                        <span>No Doctors founded !</span>
                                      </div> }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
