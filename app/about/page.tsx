"use client";

import Header from "../header";
import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Slider,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Card,
  Alert,
  Snackbar,
  Typography,
} from "@mui/material";
// import { v4 as uuidv4 } from 'uuid';
import CardContent from '@mui/material/CardContent';
import Slide, { SlideProps } from '@mui/material/Slide';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as XLSX from 'xlsx';
import { DataGrid, GridToolbar, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { saveFormData, getAllFormData, deleteFormData, addDataToDB, getDB } from './indexedDB';

export type FormState = {
  id: number;
  name: string;
  email: string;
  country: string;
  age: string;
  address: string;
  dob: Date | null;
  gender: string;
  vegetarian: boolean;
  salary: number;
  file: Blob | null;
}

export default function FormComponent() {
  const [formState, setFormState] = useState<FormState>({
    id: 0,
    name: "",
    email: "",
    country: "",
    age: "",
    address: "",
    dob: null,
    gender: "",
    vegetarian: false,
    salary: 1000,
    file: null as File | null,
  });
  const [errors, setErrors] = useState<{ [key in keyof FormState]?: string }>({});
  const [rows, setRows] = useState<FormState[]>([]);
  const [idCounter, setIdCounter] = useState(1) // <number | undefined>(undefined);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [inProgress, setInProgress] = useState(false);
  const [message, setMessage] = useState("");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const excelImportRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 50, type: 'number' },
    { field: 'name', headerName: 'Name', width: 150, type: 'string' },
    { field: 'email', headerName: 'Email', width: 200, type: 'string' },
    { field: 'country', headerName: 'Country', width: 120, type: 'string' },
    { field: 'age', headerName: 'Age', width: 80, type: 'number' },
    { field: 'address', headerName: 'Address', width: 250, type: 'string' },
    { field: 'dob', headerName: 'Date of Birth', width: 130 },
    { field: 'gender', headerName: 'Gender', width: 100, type: 'string' },
    { field: 'vegetarian', headerName: 'Vegetarian', width: 120, type: 'boolean' },
    { field: 'salary', headerName: 'Salary', width: 150, type: 'number' },
    { field: 'file', headerName: 'File', width: 150 },
  ];

  const validateForm = (): boolean => {
    let valid = true;
    let newErrors: { [key in keyof FormState]?: string } = {};

    if (!formState.name) {
      valid = false;
      newErrors.name = "Name is required";
    } else if (formState.name.length < 3 || formState.name.length > 30) {
      valid = false;
      newErrors.name = "Name must be between 3 and 30 characters";
    }

    if (!formState.email) {
      valid = false;
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formState.email)
    ) {
      valid = false;
      newErrors.email = "Invalid email format";
    }

    if (!formState.country) {
      valid = false;
      newErrors.country = "Country is required";
    }

    if (!formState.age) {
      valid = false;
      newErrors.age = "Age is required";
    } else if (!/^[0-9]+$/.test(formState.age)) {
      valid = false;
      newErrors.age = "Age must be a number";
    }

    if (!formState.address) {
      valid = false;
      newErrors.address = "Address is required";
    } else if (formState.address.length > 250) {
      valid = false;
      newErrors.address = "Address cannot exceed 250 characters";
    }

    if (!formState.dob) {
      valid = false;
      newErrors.dob = "Date of birth is required";
    }

    if (!formState.gender) {
      valid = false;
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (field: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Load data from IndexedDB on component mount
    const loadData = async () => {
      const savedData = await getAllFormData();
      setRows(savedData);
      // setIdCounter(uuidv4())
      if (savedData.length > 0) {
        setIdCounter(savedData[savedData.length - 1].id + 1); // Set idCounter based on last ID
      }
    };
    loadData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setExcelFile(event.target.files[0]);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const excelFileImport = async () => {
    if (!excelFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData:FormState[] = XLSX.utils.sheet_to_json(worksheet);

      console.log("==== jsonData ====",jsonData)
      // Add each row to IndexedDB
      const newData = jsonData.map(async (item) => (
        await addDataToDB({ ...item, id: item.id }))
      );

      // setRows((prev) => [...prev, jsonData]);
      
      const loadData = async () => {
        const savedData = await getAllFormData();
        setRows(savedData);
        // setIdCounter(uuidv4())
        if (savedData.length > 0) {
          setIdCounter(savedData[savedData.length - 1].id + 1); // Set idCounter based on last ID
        }
      };
      loadData();
      
      setExcelFile(null)
      if (excelImportRef.current) { 
        (excelImportRef.current.value as string | null) = null;     //  clear file import input element
      }

      setInProgress(true)
      setMessage('Data has been imported to IndexedDB');
      setTimeout(()=> setInProgress(false),3000)
    };
    reader.readAsArrayBuffer(excelFile);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FormData");
    XLSX.writeFile(workbook, "FormData.xlsx");
  };

  const handleSubmit  = async(e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formState);

      const newEntry:FormState = {
        ...formState,
        id: idCounter,
        dob: new Date(String(formState.dob)) //, // Convert Date to string for display
      }

      setRows((prev) => [...prev, newEntry]);
      setIdCounter((prev) => prev + 1);
      // setIdCounter(uuidv4());

      // Save to IndexedDB
      await saveFormData(newEntry);
      
      setInProgress(true)
      setMessage("User details added successfully!");
      setTimeout(()=> setInProgress(false),3000)

      setFormState({
        id: 0,
        name: '',
        email: '',
        country: '',
        age: '',
        address: '',
        dob: null,
        gender: '',
        vegetarian: false,
        salary: 1000,
        file: null
      });

      if (inputRef.current) { 
        (inputRef.current.value as string | null) = null;     //  clear file import input element
      }

      // Send the form data to the server
      // fetch('/api/addUser', {
      //   method: 'POST',
      //   body: JSON.stringify(formState),
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     // Handle server response
      //     console.log(data);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });


    }
  };
  
  const handleDelete = async () => {
    const idsToDelete = rowSelectionModel.map((id) => Number(id));
    await deleteFormData(idsToDelete);
    setInProgress(true)
    setMessage("Records deleted succefully.")
    setTimeout(()=> setInProgress(false),3000)
    setRows((prevRows) => prevRows.filter((row) => !idsToDelete.includes(row.id)));
    setRowSelectionModel([]);
  };
  
  // Handle File Downloads
  const downloadFileForSelectedRow = async () => {
    const fileId = rowSelectionModel.map((id) => Number(id));

    fileId.forEach(async (id) =>  {
      const myDB = await getDB()
      const record =  await myDB?.get('formData', id)
      console.log(id, record.file)

      if (record.file) {
        const url = URL.createObjectURL(record.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = record.file.name;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('File not found in IndexedDB');
      }
      // setToast({ open: true, message: 'Selected rows deleted!' });
    })
  };
  
  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
  }
  
  return (
    <>
      <Header />
      <br></br> 
    
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "600px", margin: "auto", padding: "0 20px" }}
      >
        <Typography variant="h4" gutterBottom>
          Registration Form
        </Typography>

        {/* Name Field */}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formState.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Email Field */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formState.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Country Field */}
        <FormControl fullWidth margin="normal" error={!!errors.country}>
          <Select
            value={formState.country}
            onChange={(e) => handleChange("country", e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Country
            </MenuItem>
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="UK">UK</MenuItem>
            {/* Add more countries as needed */}
          </Select>
          {errors.country && (
            <Typography color="error">{errors.country}</Typography>
          )}
        </FormControl>

        {/* Age Field */}
        <TextField
          label="Age"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formState.age}
          onChange={(e) => handleChange("age", e.target.value)}
          error={!!errors.age}
          helperText={errors.age}
        />

        {/* Address Field */}
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={formState.address}
          onChange={(e) => handleChange("address", e.target.value)}
          error={!!errors.address}
          helperText={errors.address}
        />

        {/* Date of Birth Field */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={formState.dob}
            onChange={(date: any) => handleChange("dob", date)}
            // renderInput={(params: null) => (
            //   <TextField
            //     {...params}
            //     variant="outlined"
            //     fullWidth
            //     margin="normal"
            //     error={!!errors.dob}
            //     helperText={errors.dob}
            //   />
            // )}
          />
        </LocalizationProvider>
        
        <input
          type="file" ref={inputRef}
          style={{margin: "15px"}}
          accept="application/pdf"
          onChange={(e) => handleChange("file", e.target.files?.[0])}
          // setErrorMessages({ ...errorMessages, file: file && file.size > 2 * 1024 * 1024 ? 'File size must be less than 2 MB' : '' });

        />
        {/* {errorMessages.file && <Typography color="error">{errorMessages.file}</Typography>} */}
        
        <Box sx={{ display: "inline-flex", gridGap: "120px" }}>
          {/* Gender Field */}
          <FormControl
            component="fieldset"
            margin="normal"
            error={!!errors.gender}
          >
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              value={formState.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
            {errors.gender && (
              <Typography color="error">{errors.gender}</Typography>
            )}
          </FormControl>

          {/* Vegetarian Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.vegetarian}
                onChange={(e) => handleChange("vegetarian", e.target.checked)}
              />
            }
            label="Vegetarian"
          />
        </Box>

        {/* Salary Slider */}
        <FormControl fullWidth margin="normal">
          <Typography gutterBottom>Salary Range</Typography>
          <Slider
            min={1000}
            max={10000}
            step={1000}
            value={formState.salary}
            onChange={(e, value) => handleChange("salary", value as number)}
            valueLabelDisplay="auto"
          />
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
      
      <br></br>
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <Card variant="outlined">
          <CardContent>
            <h2>Import Data from Excel</h2>
            <br></br>
            <input
                type="file" ref={excelImportRef}
                style={{margin: "15px"}}
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                // setErrorMessages({ ...errorMessages, file: file && file.size > 2 * 1024 * 1024 ? 'File size must be less than 2 MB' : '' });
              />
            <button onClick={excelFileImport} disabled={!excelFile}>
              Import Data
            </button>
          </CardContent>
        </Card>
      </div>

      <Snackbar open={inProgress} TransitionComponent={SlideTransition}>
        <Alert severity="info" icon={<CheckCircleOutlineIcon style={{ color: 'green', fontSize: '25px' }}  />}>
            {message}
        </Alert>
      </Snackbar>

      {rows.length > 0 && (
        <>
          <br></br>

          <div style={{ width: "100%", margin: "auto", padding: "0 20px" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              // disableSelectionOnClick
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={(newRowSelectionModel: any) => setRowSelectionModel(newRowSelectionModel)}
              // slots={{ toolbar: GridToolbar }}
              // loading={loading}
            />

            <div className="table-btn-group">
              <Button
                variant="contained"
                color="primary"
                onClick={handleExport}
                style={{ marginTop: '10px', height: "30px" }}
              >
                Export to Excel
              </Button>
              
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                style={{ marginTop: '10px', height: "30px" }}
                disabled={rowSelectionModel.length === 0}
              >
                Delete Selected
              </Button>

              <Button
                variant="contained"
                // color="Primary"
                onClick={downloadFileForSelectedRow}
                style={{ marginTop: '10px', height: "30px" }}
                disabled={rowSelectionModel.length === 0}
              >
                Download File
              </Button>
            </div>
          </div>
        </>
       )}
    </>
  );
}