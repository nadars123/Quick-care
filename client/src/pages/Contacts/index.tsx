import { useState, useEffect, useRef, createRef } from "react";
import axios from "axios";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import { FormInput, FormLabel } from "@/components/Base/Form";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { toast } from "sonner";
import Nodata from '@/assets/images/doctorino/nodata.svg'

interface Specialities {
  _id?: string;
  label: string;
  createdAt?: string;
  updatedAt?: string;
}

function SpecialitiesTable() {
  const [specialities, setSpecialities] = useState<Specialities[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSpeciality, setCurrentSpeciality] =
    useState<Specialities | null>(null);
  const tableRef = createRef<HTMLDivElement>();
  const tabulator = useRef<Tabulator>();

  useEffect(() => {
    getSpecialities();
  }, []);

  const getSpecialities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/v1/contact"
      );
      setSpecialities(response.data);
    } catch (error) {
      console.log(error);
    }
  };



  const handleDelete = async (_id: string) => {
    try {
        await axios.delete(`http://localhost:7000/api/v1/contact/${_id}`);

        // Remove from state
        setSpecialities((prev) => {
            const updatedList = prev.filter((item) => item._id !== _id);
            toast.success('Message Deleted Successfully !')
            
            // Update Tabulator with new data
            if (tabulator.current) {
                tabulator.current.replaceData(updatedList);
            }

            return updatedList;
        });
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
    }
};



  useEffect(() => {
    if (specialities.length > 0) {
      initTabulator();
    }
  }, [specialities]);

  const initTabulator = () => {
    if (tableRef.current) {
      tabulator.current = new Tabulator(tableRef.current, {
        data: specialities,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 10,
        columns: [
          { title: "Speciality", field: "label", vertAlign: "middle" },
          { title: "Speciality", field: "label", vertAlign: "middle" },
          { title: "Speciality", field: "label", vertAlign: "middle" },
          { title: "Created At", field: "createdAt", vertAlign: "middle" },
          { title: "Updated At", field: "updatedAt", vertAlign: "middle" },
          {
            title: "Actions",
            formatter: (cell) => {
              return `<button class='edit-btn text-orange-400'>Edit</button>
                      <button class='delete-btn text-red-500'>Delete</button>`;
            },
            cellClick: (e, cell) => {
              const rowData = cell.getRow().getData();
              if (e.target.classList.contains("edit-btn")) {
                setCurrentSpeciality(rowData);
                setModalOpen(true);
              } else if (e.target.classList.contains("delete-btn")) {
                handleDelete(rowData._id);
              }
            },
          },
        ],
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col mg:flex-row lg:flex-row flex-wrap mb-4 justify-between">
        <span className="text-white text-2xl font-bold">Specialities</span>

        <Button
          className="mb-3"
          variant="primary"
          onClick={() => {
            setCurrentSpeciality({ label: "" });
            setModalOpen(true);
          }}
        >
          Add Speciality
        </Button>
      </div>
      {specialities.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="overflow-y-auto !border-0" ref={tableRef}></div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center p-7 rounded-sm bg-white">
          <img width={30} src={Nodata} alt="no-data" />
          <span>No Specialities founded !</span>
        </div>
      )}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <Dialog.Panel>
          <div className="p-5">
            <h2 className="my-2">
              {currentSpeciality?.id ? "Edit" : "Add"} Speciality
            </h2>
            <FormInput
              type="text"
              value={currentSpeciality?.label || ""}
              onChange={(e) =>
                setCurrentSpeciality({
                  ...currentSpeciality,
                  label: e.target.value,
                })
              }
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default SpecialitiesTable;
