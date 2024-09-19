import React from "react";

interface Food {
  id: number;
  foodName: string;
  categoryName: string;
  iddsiLevelLevel: string;
  iddsiLevelName: string;
}

interface FoodListProps {
  foodItems: Food[];
}

const FoodList: React.FC<FoodListProps> = ({ foodItems }) => {
  return (
    <div>
      <table>
        <thead>
          <tr><th>Name</th><th>Category</th><th>iddsi Level</th></tr>
        </thead>
      {foodItems.length > 0 ? (
        <tbody>
          {foodItems.map((food) => (
            <tr key={food.id}>
              <td>{food.foodName}</td>
              <td> {food.categoryName} </td> 
              <td>{food.iddsiLevelLevel} ( {food.iddsiLevelName} )</td>
            </tr>
          ))}
        </tbody>
      ) : (
        <tfoot><tr key={1}><td colSpan={3}>No food item found.</td></tr></tfoot>
      )}
      </table>
    </div>
  );
};

export default FoodList;