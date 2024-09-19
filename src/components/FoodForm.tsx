import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addFoodItem, getCategories, getLevels } from '../services/api';

interface FoodFormProps {
  onAddFoodItem: (newItem: FoodItem) => void;
}

interface Category {
  id: number;
  name: string;
  created_at: string;
}

interface Iddsilevel {
  id: number;
  level: string;
  name: string;
  created_at: string;
}

interface FoodItem {
  id: number;
  foodName: string;
  iddsiLevel: string;
  categoryName: string;
  iddsiLevelLevel: string;
  iddsiLevelName: string;
}

const FoodForm: React.FC<FoodFormProps> = ({ onAddFoodItem }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [Iddsilevels, setIddsilevels] = useState<Iddsilevel[]>([]);  
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      iddsiLevel: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Food name is required"),
      category: Yup.string().required("Category is required"),
      iddsiLevel: Yup.string().required("IDDSI level is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await addFoodItem({
          name: values.name,
          category: values.category,
          iddsiLevel: values.iddsiLevel,
        });
        onAddFoodItem(response.data);
        alert("Food item added successfully!");
        formik.resetForm(); 
      } catch (error) {
        console.error("Failed to add food", error);
      }
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    const fetchlevels = async () => {
      try {
        const response = await getLevels();
        setIddsilevels(response || []);
      } catch (error) {
        console.error("Failed to fetch Levels", error);
      }
    };

    fetchCategories();
    fetchlevels();
  }, []);

  return (
    <div className="form-box">
      <h3>Add Food Item</h3>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-input">
          <label className="required">Food Name</label>
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name ? <div>{formik.errors.name}</div> : null}
        </div>

        <div className="form-input">
          <label className="required">Category</label>
          <select
            name="category"
            onChange={formik.handleChange}
            value={formik.values.category}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.errors.category ? <div>{formik.errors.category}</div> : null}
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

        <button type="submit" className="left-align">Add Food Item</button>
      </form>
    </div>
  );
};

export default FoodForm;