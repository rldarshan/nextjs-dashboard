"use client";

import React, { useState } from "react";
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
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDemoData } from "@mui/x-data-grid-generator";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";

interface FormState {
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
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'country', headerName: 'Country', width: 120 },
    { field: 'age', headerName: 'Age', width: 80 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'dob', headerName: 'Date of Birth', width: 130 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'vegetarian', headerName: 'Vegetarian', width: 120, type: 'boolean' },
    { field: 'salary', headerName: 'Salary', width: 150, type: 'number' },
  ];

  const [errors, setErrors] = useState<{ [key in keyof FormState]?: string }>(
    {}
  );
  const [rows, setRows] = useState<FormState[]>([]);
  const [idCounter, setIdCounter] = useState(1);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formState);
      alert("Form Submitted Successfully!");

      setRows((prev) => [
        ...prev,
        {
          ...formState,
          id: idCounter,
          dob: new Date(String(formState.dob)) //, // Convert Date to string for display
        },
      ]);
      setIdCounter((prev) => prev + 1);

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
      });


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

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "600px", margin: "auto" }}
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

      <div style={{ height: 300, width: "90%", display: "flex", justifyContent: "center" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          // loading={loading}
        />
      </div>
    </>
  );
}