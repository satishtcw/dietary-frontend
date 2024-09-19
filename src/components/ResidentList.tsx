import React from "react";

interface Resident {
  id: number;
  residentName: string;
  iddsiLevelLevel: string;
  iddsiLevelName: string;
}

interface ResidentListProps {
  residents: Resident[];
}

const ResidentList: React.FC<ResidentListProps> = ({ residents }) => {
  return (
    <div>
      <table>
        <thead>
          <tr><th>Name</th><th>iddsi Level</th></tr>
        </thead>
      {residents.length > 0 ? (
        <tbody>
          {residents.map((resident) => (
            <tr key={resident.id}>
              <td>{resident.residentName}</td>
              <td>{resident.iddsiLevelLevel} ( {resident.iddsiLevelName} )</td>
            </tr>
          ))}
        </tbody>
      ) : (
        <tfoot><tr><td colSpan={2}>No Resident item found.</td></tr></tfoot>
      )}
      </table>
    </div>
  );
};

export default ResidentList;