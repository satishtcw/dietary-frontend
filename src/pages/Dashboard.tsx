import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FoodForm from "../components/FoodForm";
import ResidentForm from "../components/ResidentForm";
import FoodList from "../components/FoodList";
import ResidentList from "../components/ResidentList";
import CSVUpload from "../components/CSVUpload";
import { useNavigate } from "react-router-dom";
import { assignFoodToResident, getFoodItems, getAssignedFoods  } from '../services/api';
import { getResidents } from '../services/api';

interface FoodItem {
  id: number;
  foodName: string;
  iddsiLevel: string;
  categoryName: string;
  iddsiLevelLevel: string;
  iddsiLevelName: string;
}

interface ResidentItem {
  id: number;
  iddsiLevel: string,
  residentName: string;
  iddsiLevelLevel: string;
  iddsiLevelName: string;
}

const Dashboard: React.FC = () => {
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [showResidentForm, setShowResidentForm] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [residents, setResidents] = useState<ResidentItem[]>([]);
  const [selectedResident, setSelectedResident] = useState<number | null>(null);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [assignedFoods, setAssignedFoods] = useState<number[]>([]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      resident: "",
      selectedFoods: [] as number[],
    },
    validationSchema: Yup.object({
      selectedFoods: Yup.array().min(1, "At least one food must be selected"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await assignFoodToResident(values.resident, values.selectedFoods);
        if (response.success) {
          alert("Food items successfully assigned!");
        } else {
          alert("Error in assigning food items.");
        }
      } catch (error) {
        console.error("Failed to assign foods", error);
      }
    },
  });

  const handleLogout = () => {
      localStorage.removeItem('authenticated');
      navigate('/login');
  };

  useEffect(() => {
    
    const fetchFoodItems = async () => {
      const response = await getFoodItems();
      setFoodItems(response);
    };

    const fetchResidents = async () => {
      const response = await getResidents();
      setResidents(response);
    };

    fetchFoodItems();
    fetchResidents();
  }, []);

  useEffect(() => {
    if (selectedResident !== null) {
      const fetchAssignedFoods = async () => {
        try {
          const response = await getAssignedFoods(selectedResident);
          if (response.success) {
            const assignedFoodsArray = Array.isArray(response.assignedFoods)
            ? response.assignedFoods
            : [response.assignedFoods];
            
            setAssignedFoods(assignedFoodsArray);
            formik.setFieldValue("selectedFoods", assignedFoodsArray);
            
          } else {
            console.error(response.message);
          }
        } catch (error) {
          console.error("Failed to fetch assigned foods", error);
        }
      };

      fetchAssignedFoods();
    }
  }, [selectedResident]);

  const handleAddFoodItem = async (newItem: FoodItem) => {
    setFoodItems((prevItems) => [...prevItems, newItem]);
  };

  const handleAddResidentItem = async (newItem: ResidentItem) => {
    setResidents((prevResidentItems) => [...prevResidentItems, newItem]);
  };

  const handleResidentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue("selectedFoods", []);
    setAssignedFoods([]);
    const residentId = parseInt(event.target.value);
    setSelectedResident(residentId);

    const resident = residents.find(r => r.id === residentId);
    if (resident) {
      const iddsiLevel = parseInt(resident.iddsiLevel);
      const filtered = foodItems.filter(food => parseInt(food.iddsiLevel) <= iddsiLevel);
      setFilteredFoods(filtered);
    }
  };

  const handleFoodChange = (foodId: number) => {
    const newSelectedFoods = formik.values.selectedFoods.includes(foodId)
      ? formik.values.selectedFoods.filter((id) => id !== foodId)
      : [...formik.values.selectedFoods, foodId];
    formik.setFieldValue("selectedFoods", newSelectedFoods);
  };

  const handleCSVUpload = (newFoodItems: any[]) => {
    const parsedFoodItems: FoodItem[] = newFoodItems.map(item => ({
      id: Math.random(),
      foodName: item.foodName,
      categoryName: item.categoryName,
      iddsiLevel: item.iddsiLevel,
      iddsiLevelLevel: item.iddsiLevelLevel,
      iddsiLevelName: item.iddsiLevelName
    }));
    
    setFoodItems((prevItems) => [...prevItems, ...parsedFoodItems]);
  };

  return (
    <div className="content-box">
      <h2>Dashboard</h2>
      <div><button onClick={handleLogout}>Logout</button></div>
      <div className="item-with-button">
        <h3 >Food Items</h3>
        <CSVUpload onCSVUpload={handleCSVUpload}/>
        <button onClick={() => setShowFoodForm(!showFoodForm)}>
          {showFoodForm ? "Hide Form" : "Add Food Item"}
        </button>
      </div>
      {showFoodForm && <FoodForm onAddFoodItem={handleAddFoodItem}/>}
      <FoodList foodItems={foodItems} />
      <hr></hr>
      <div className="item-with-button padding-top-60">
        <h3>Residents</h3>
        <button onClick={() => setShowResidentForm(!showResidentForm)} className="right-align">
          {showResidentForm ? "Hide Form" : "Add Resident"}
        </button>
      </div>
      {showResidentForm && <ResidentForm onAddResidentdItem={handleAddResidentItem}/>}
      <ResidentList residents={residents} />
      <hr></hr>
      <div className="item-with-button">
        <h3 >Assign Foods</h3>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-box">
            <div className="form-input">
              <label className="required">Resident</label>
              <select
                name="resident"
                onChange={(event) => {
                  formik.handleChange(event);
                  handleResidentChange(event);
                }}
                value={formik.values.resident}
              >
                <option value="">Select a Resident</option>
                {residents.map(resident => (
                  <option key={resident.id} value={resident.id}>
                    {resident.residentName}
                  </option>
                ))}
              </select>
              {formik.errors.resident ? <div>{formik.errors.resident}</div> : null}
            </div>
            {selectedResident !== null && (
          <div className="form-input">
            <label className="required">Available Food Items</label>
            <div className="display-flex">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <div key={`${selectedResident}-${food.id}`} className="checkbox-box">
                    <input
                      type="checkbox"
                      id={`food-${food.id}`}
                      name="selectedFoods"
                      value={food.id}
                      onChange={() => handleFoodChange(food.id)}
                      checked={formik.values.selectedFoods.includes(food.id) || assignedFoods.includes(food.id)}
                    />
                    <label htmlFor={`food-${food.id}`}>
                      {food.foodName} - {food.categoryName}
                    </label>
                  </div>
                ))
              ) : (
                <div>No food items available</div>
              )}
            </div>
          </div>
          
        )}
        </div>
        <button type="submit">Assign Foods</button>
      </form>
    </div>
    
  );
};

export default Dashboard;