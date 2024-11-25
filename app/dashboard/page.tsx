"use client";

import Header from "../header";
import { useAuth } from "../auth_context";
import "../styles/global_styles.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { uploadFile } from "../firebaseConfig";

import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Slider,
  Typography,
  Snackbar,
  Alert,
  Toolbar,
} from "@mui/material";
import Slide, { SlideProps } from '@mui/material/Slide';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid,GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const API_URL = "https://api-7bjw3wubma-uc.a.run.app/"; 
// const API_URL = "http://127.0.0.1:5001/myangularfirebase-74aff/us-central1/api";

export type FormData = {
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

export default function App() {
  const { userData } = useAuth();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
  console.log("==== userData ==== ", userData);

  axios
      .get(`${API_URL}/get_all_users`)
      .then((response) => {
        console.log("==== Firebase API 'get_all_users' Data ==== ", response.data);
        setRows(response.data);
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Form state
  const [formData, setFormData] = useState({
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 50, type: 'number' },
    { field: 'name', headerName: 'Name', width: 150, type: 'string' },
    { field: 'email', headerName: 'Email', width: 200, type: 'string' },
    { field: 'country', headerName: 'Country', width: 120, type: 'string' },
    { field: 'age', headerName: 'Age', width: 80, type: 'number' },
    { field: 'address', headerName: 'Address', width: 250, type: 'string' },
    { field: 'dob', headerName: 'Date of Birth', width: 130 },
    { field: 'gender', headerName: 'Gender', width: 100, type: 'string' },
    { field: 'vegetarian', headerName: 'Vegetarian', width: 50, type: 'boolean' },
    { field: 'salary', headerName: 'Salary', width: 50, type: 'number' },
    { field: 'file', headerName: 'File', width: 150 },
  ];

  const [rows, setRows] = useState<any[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>({});
  const [fileUploadUrl, setFileUploadUrl] = useState('');

  // Validation function
  const validateForm = (): boolean => {
    let valid = true;
    let newErrors: { [key in keyof FormData]?: string } = {};

    if (!formData.name) {
      valid = false;
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3 || formData.name.length > 30) {
      valid = false;
      newErrors.name = "Name must be between 3 and 30 characters";
    }

    if (!formData.email) {
      valid = false;
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
    ) {
      valid = false;
      newErrors.email = "Invalid email format";
    }

    if (!formData.country) {
      valid = false;
      newErrors.country = "Country is required";
    }

    if (!formData.age) {
      valid = false;
      newErrors.age = "Age is required";
    } else if (!/^[0-9]+$/.test(formData.age)) {
      valid = false;
      newErrors.age = "Age must be a number";
    }

    if (!formData.address) {
      valid = false;
      newErrors.address = "Address is required";
    } else if (formData.address.length > 250) {
      valid = false;
      newErrors.address = "Address cannot exceed 250 characters";
    }

    if (!formData.dob) {
      valid = false;
      newErrors.dob = "Date of birth is required";
    }

    if (!formData.gender) {
      valid = false;
      newErrors.gender = "Gender is required";
    }

    if (!formData.file) {
      valid = false;
      newErrors.file = "A pdf file is required";
    } else if (formData.file.size > 2 * 1024 * 1024) {
      valid = false;
      newErrors.file = 'File size must be less than 2 MB';
    }

    setErrors(newErrors);
    return valid;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    var newFormData: any;

    // Generate a unique ID for each new record
    const uniqueId = Date.now();

    // upload file to firebase storage
    await uploadFile(formData.file)
    .then(url => {
      if (url) {
        setFileUploadUrl(url);
      }
      console.log('\n\n =======  File uploaded successfully. Download URL  =======', url)
    })
    .catch(error => console.error('Error:', error));

    newFormData = { ...formData, id: uniqueId, fileUrl: fileUploadUrl };
    console.log("============= newFormData =====", newFormData)
    
    setRows((prev) => [...prev, newFormData]);

    delete newFormData.file;  // delete file property from user object

    // Save to Firestore DB
    axios
      .post(`${API_URL}/add_user_data`, newFormData)
      .then((response) => {
        console.log("==== Firebase API add_user_data ==== ", response.data);
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });


    // // Fetch updated data and show toast
    // fetchFormData();

    setInProgress(true)
    setMessage("User details added successfully!");
    setTimeout(()=> setInProgress(false),3000)

    setFormData({
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

  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
  }

  return (
    <>
      <Header />
      {userData ? (
        <>
          <br></br>{" "}
          <img className="user-img" src={userData?.photoURL} alt="User_img" />{" "}
        </>
      ) : (
        ""
      )}

      <br></br>
      <h1>Hi {userData?.displayName}, Welcome to Dashboard..!</h1>

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
          value={formData.name}
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
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Country Field */}
        <FormControl fullWidth margin="normal" error={!!errors.country}>
          <Select
            value={formData.country}
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
          value={formData.age}
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
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          error={!!errors.address}
          helperText={errors.address}
        />

        {/* Date of Birth Field */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={formData.dob}
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
          type="file"
          ref={inputRef}
          style={{ margin: "15px" }}
          accept="application/pdf"
          onChange={(e) => handleChange("file", e.target.files?.[0])}
          // setErrorMessages({ ...errorMessages, file: file && file.size > 2 * 1024 * 1024 ? 'File size must be less than 2 MB' : '' });
        />
        {errors.file && <Typography color="error">{errors.file}</Typography>}

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
              value={formData.gender}
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
                checked={formData.vegetarian}
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
            value={formData.salary}
            onChange={(e, value) => handleChange("salary", value as number)}
            valueLabelDisplay="auto"
          />
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>

      <br></br>
      {/* <div style={{ maxWidth: "600px", margin: "auto" }}>
        <Card variant="outlined">
          <CardContent>
            <h2>Import Data from Excel</h2>
            <br></br>
            <input
              type="file"
              ref={excelImportRef}
              style={{ margin: "15px" }}
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              // setErrorMessages({ ...errorMessages, file: file && file.size > 2 * 1024 * 1024 ? 'File size must be less than 2 MB' : '' });
            />
            <button onClick={excelFileImport} disabled={!excelFile}>
              Import Data
            </button>
          </CardContent>
        </Card>
      </div> */}

      <Snackbar open={inProgress} TransitionComponent={SlideTransition}>
        <Alert
          severity="info"
          icon={
            <CheckCircleOutlineIcon
              style={{ color: "green", fontSize: "25px" }}
            />
          }
        >
          {message}
        </Alert>
      </Snackbar>

      {rows.length > 0 && (
        <>
          <br></br>

          <div
            style={{ width: "100%", margin: "auto", padding: "0 20px" }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              // disableSelectionOnClick
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={(newRowSelectionModel: any) =>
                setRowSelectionModel(newRowSelectionModel)
              }
              // slots={{ toolbar: GridToolbar }}
              // loading={loading}
            />

            {/* <div style={{ display: "grid" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExport}
                style={{ marginTop: "10px", height: "30px" }}
              >
                Export to Excel
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                style={{ marginTop: "10px", height: "30px" }}
                disabled={rowSelectionModel.length === 0}
              >
                Delete Selected
              </Button>

              <Button
                variant="contained"
                // color="Primary"
                onClick={downloadFileForSelectedRow}
                style={{ marginTop: "10px", height: "30px" }}
                disabled={rowSelectionModel.length === 0}
              >
                Download File
              </Button>
            </div> */}
          </div>
        </>
      )}
    </>
  );
}
