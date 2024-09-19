import React, { useState } from "react";
import Papa from "papaparse";
import { saveCSVData  } from '../services/api';

interface CSVUploadProps {
    onCSVUpload: (newFoodItems: any[]) => void;
  }

  const CSVUpload: React.FC<CSVUploadProps> = ({ onCSVUpload }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (csvFile) {
      setIsUploading(true);
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          setIsUploading(false);
          const response = await saveCSVData(results.data);
          onCSVUpload(response.data);
        },
      });
    } else {
      alert("Please upload a CSV file.");
    }
  };


  return (
    <div className="display-flex-nowrap">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload} className="width-100" disabled={!csvFile || isUploading}>{isUploading ? "Uploading..." : "Upload CSV"}</button>
    </div>
  );
};

export default CSVUpload;