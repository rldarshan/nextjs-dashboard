"use client"
import Header from "../header";

export default function App(){
  return (
  <>
    <Header />
    <br></br> 
    <h1>Welcome to Dashboard..!</h1>
  </>
)
}
// import React, { useState, useEffect } from 'react';
// import {
//   Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
//   RadioGroup, FormControlLabel, Radio, Checkbox, Slider, Typography,
//   Snackbar, Alert, Toolbar
// } from '@mui/material';
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DataGrid, GridToolbar, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
// import * as XLSX from 'xlsx';
// import { openDB, IDBPDatabase } from 'idb';
// import { deleteFormData } from '../about/indexedDB';

// let db: IDBPDatabase | null = null;

// export async function initDB() {
//   db = await openDB('FormDB', 1, {
//     upgrade(database) {
//       if (!database.objectStoreNames.contains('newformData')) {
//         database.createObjectStore('newformData', { keyPath: 'id', autoIncrement: true });
//       }
//     }
//   });
// }

// const App = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     id: 0,  // Add 'id' field to the form data state
//     name: '',
//     email: '',
//     country: '',
//     age: '',
//     address: '',
//     dob: null,
//     gender: '',
//     isVegetarian: false,
//     salary: 1000,
//     file: null as File | null,
//   });

//   const [rows, setRows] = useState<any[]>([]);
//   const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
//   const [errorMessages, setErrorMessages] = useState({
//     name: '',
//     email: '',
//     age: '',
//     address: '',
//     file: '',
//   });
//   const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

//   // Validation function
//   const validateForm = () => {
//     const errors = {
//       name: formData.name.length < 3 || formData.name.length > 30 ? 'Name must be between 3 and 30 characters' : '',
//       email: !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email) ? 'Invalid email format' : '',
//       age: isNaN(parseInt(formData.age)) ? 'Age must be a number' : '',
//       address: formData.address.length > 250 ? 'Address cannot exceed 250 characters' : '',
//       file: formData.file && formData.file.size > 2 * 1024 * 1024 ? 'File size must be less than 2 MB' : '',
//     };
//     setErrorMessages(errors);
//     return Object.values(errors).every((err) => err === '');
//   };

//   // Form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     // Generate a unique ID for each new record
//     const uniqueId = Date.now();
//     const newFormData = { ...formData, id: uniqueId };

//     // Save to IndexedDB
//     if (!db) await initDB();
//     await db?.add('formData', newFormData);

//     // Fetch updated data and show toast
//     fetchFormData();
//     setToast({ open: true, message: 'Form saved successfully!' });
//   };

//   // Fetch data from IndexedDB
//   const fetchFormData = async () => {
//     if (!db) await initDB();
//     const allData = await db?.getAll('formData');
//     setRows(allData);
//   };

//   // Handle export to Excel
//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(rows);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'FormData');
//     XLSX.writeFile(wb, 'FormData.xlsx');
//   };

//   // Handle multiple row deletion
//   const handleDelete = async () => {
//     const idsToDelete = rowSelectionModel.map((id) => Number(id));
//     console.log(idsToDelete)
//     await deleteFormData(idsToDelete)
//     // setInProgress(true)
//     // setMessage("Records deleted succefully.")
//     // setTimeout(()=> setInProgress(false),3000)
//     setRows((prevRows) => prevRows.filter((row) => !idsToDelete.includes(row.id)));
//     setRowSelectionModel([]);
//   };

//   // Handle File Downloads
//   const downloadFileForSelectedRow = async () => {
//     const fileId = rowSelectionModel.map((id) => Number(id));
//     const record = await db?.get('formData', fileId[0]);
//     console.log(fileId[0], record.file)

//     if (record.file) {
//       const url = URL.createObjectURL(record.file);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = record.file.name;
//       a.click();
//       URL.revokeObjectURL(url);
//     } else {
//       console.error('File not found in IndexedDB');
//     }
//     // setToast({ open: true, message: 'Selected rows deleted!' });
//   };

//   useEffect(() => {
//     fetchFormData();
//   }, []);

//   return (
//     <Box p={3}>
//       <Typography variant="h4">Form</Typography>
//       <form onSubmit={handleSubmit} noValidate>
//         <TextField
//           label="Name"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           error={!!errorMessages.name}
//           helperText={errorMessages.name}
//           required
//           inputProps={{ maxLength: 30, minLength: 3 }}
//         />
//         <TextField
//           label="Email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           error={!!errorMessages.email}
//           helperText={errorMessages.email}
//           required
//         />
//         <FormControl fullWidth>
//           <InputLabel>Country</InputLabel>
//           <Select
//             value={formData.country}
//             onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//             required
//           >
//             <MenuItem value="USA">USA</MenuItem>
//             <MenuItem value="Canada">Canada</MenuItem>
//           </Select>
//         </FormControl>
//         <TextField
//           label="Age"
//           type="number"
//           value={formData.age}
//           onChange={(e) => setFormData({ ...formData, age: e.target.value })}
//           error={!!errorMessages.age}
//           helperText={errorMessages.age}
//           required
//         />
//         <TextField
//           label="Address"
//           multiline
//           value={formData.address}
//           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//           error={!!errorMessages.address}
//           helperText={errorMessages.address}
//           inputProps={{ maxLength: 250 }}
//           required
//         />
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DatePicker
//           label="Date of Birth"
//           value={formData.dob}
//           onChange={(dob) => setFormData({ ...formData, dob })}
//         />
//         </LocalizationProvider>
//         <FormControl>
//           <Typography>Gender</Typography>
//           <RadioGroup
//             value={formData.gender}
//             onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//           >
//             <FormControlLabel value="male" control={<Radio />} label="Male" />
//             <FormControlLabel value="female" control={<Radio />} label="Female" />
//           </RadioGroup>
//         </FormControl>
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={formData.isVegetarian}
//               onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
//             />
//           }
//           label="Vegetarian"
//         />
//         <Typography>Salary: {formData.salary}</Typography>
//         <Slider
//           value={formData.salary}
//           onChange={(e, value) => setFormData({ ...formData, salary: value as number })}
//           min={1000}
//           max={10000}
//         />
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={(e) => {
//             const file:File = e.target.files?.[0];
//             setFormData({ ...formData, file });
//             setErrorMessages({ ...errorMessages, file: file && file.size > 2 * 1024 * 1024 ? 'File size must be less than 2 MB' : '' });
//           }}
//         />
//         {errorMessages.file && <Typography color="error">{errorMessages.file}</Typography>}
//         <Button type="submit" variant="contained" color="primary">Submit</Button>
//       </form>

//       <Typography variant="h5" mt={5}>Saved Data</Typography>
//       <div style={{display: "inline-flex", margin: "20px 0", gridGap: "20px"}}>
//         <Button onClick={exportToExcel} variant="outlined" color="primary">Export to Excel</Button>
//         <Button onClick={handleDelete} variant="outlined" color="primary">Delete Records</Button>
//         <Button onClick={downloadFileForSelectedRow} variant="outlined" color="secondary">Download File For Selected Row</Button>
//       </div>
      
//       <DataGrid
//         rows={rows.map((row, index) => ({ ...row, id: row.id }))}
//         columns={[
//           { field: 'id', headerName: 'ID', width: 70 },
//           { field: 'name', headerName: 'Name', width: 150 },
//           { field: 'email', headerName: 'Email', width: 200 },
//           { field: 'country', headerName: 'Country', width: 120 },
//           { field: 'age', headerName: 'Age', width: 80 },
//           { field: 'address', headerName: 'Address', width: 250 },
//           { field: 'dob', headerName: 'DOB', width: 120 },
//           { field: 'gender', headerName: 'Gender', width: 100 },
//           { field: 'isVegetarian', headerName: 'Vegetarian', width: 120 },
//           { field: 'salary', headerName: 'Salary', width: 150 },
//         ]}
//         checkboxSelection
//         rowSelectionModel={rowSelectionModel}
//         onRowSelectionModelChange={(newRowSelectionModel: any) => setRowSelectionModel(newRowSelectionModel)}
//       />

//       {/* Snackbar for Toast Messages */}
//       <Snackbar
//         open={toast.open}
//         autoHideDuration={3000}
//         onClose={() => setToast({ open: false, message: '' })}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={() => setToast({ open: false, message: '' })} severity="success">
//           {toast.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default App;
