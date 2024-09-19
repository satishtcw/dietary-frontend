import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addResidentItem, getLevels } from '../services/api';

interface ResidentFormProps {
  onAddResidentdItem: (newItem: ResidentItem) => void;
}

interface Iddsilevel {
  id: number;
  level: string;
  name: string;
  created_at: string;
}

interface ResidentItem {
  id: number;
  residentName: string;
  iddsiLevel: string,
  assignedFoods: string;
  iddsiLevelLevel: string;
  iddsiLevelName: string;
}

const ResidentForm: React.FC<ResidentFormProps> = ({ onAddResidentdItem }) => {
  const [Iddsilevels, setIddsilevels] = useState<Iddsilevel[]>([]);
  const formik = useFormik({
    initialValues: {
      name: "",
      iddsiLevel: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Resident name is required"),
      iddsiLevel: Yup.string().required("IDDSI level is required"),
    }),
    onSubmit: async (values) => {

      try {
        const response = await addResidentItem({
          name: values.name,
          iddsiLevel: values.iddsiLevel,
        });
        onAddResidentdItem(response.data);
        alert("Resident item added successfully!");
        formik.resetForm(); 
      } catch (error) {
        console.error("Failed to add Resident item", error);
      }

    },
  });

  useEffect(() => {

    const fetchlevels = async () => {
      try {
        const response = await getLevels();
        setIddsilevels(response || []);
      } catch (error) {
        console.error("Failed to fetch Levels", error);
      }
    };

    fetchlevels();
  }, []);

  return (
    <div className="form-box">
      <h3>Add Resident</h3>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-input">
          <label className="required">Resident Name</label>
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name ? <div>{formik.errors.name}</div> : null}
        </div>

        <div className="form-input">
          <label className="required">iddsiLevel</label>
          <select
            name="iddsiLevel"
            onChange={formik.handleChange}
            value={formik.values.iddsiLevel}
          >
            <option value="">Select a iddsiLevel</option>
            {Iddsilevels.map(iddsiLevel => (
              <option key={iddsiLevel.id} value={iddsiLevel.id}>
                {iddsiLevel.level}
              </option>
            ))}
          </select>
          {formik.errors.iddsiLevel ? <div>{formik.errors.iddsiLevel}</div> : null}
        </div>

        <button type="submit" className="left-align">Add Resident</button>
      </form>
    </div>
  );
};

export default ResidentForm;