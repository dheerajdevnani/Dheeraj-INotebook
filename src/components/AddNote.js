// FormValidations.js

import React, { useContext, useEffect } from 'react';
import { NoteContext } from '../context/notes/NoteContext';
import { TextField, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AlertContext } from '../context/AlertContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function FormValidations() {
    const { add } = useContext(NoteContext);
    const navigate = useNavigate();
    const { showAlert } = useContext(AlertContext);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            showAlert("You need to sign in first", "error");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const noteSchema = Yup.object().shape({
        title: Yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
        description: Yup.string().min(3, 'Description must be at least 3 characters').required('Description is required'),
        tag: Yup.string().min(3, 'Tag must be at least 3 characters').required('Tag is required'),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            tag: "",
        },
        validationSchema: noteSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                await add(values);
                navigate('/');
                showAlert(`Created note "${values.title}" successfully`, "success");
                resetForm();
            } catch (error) {
                console.error("Error adding note:", error);
                showAlert("Failed to add note", "error");
            }
        }
    });

    const { errors, touched, handleSubmit, getFieldProps } = formik;

    return (
        <div>
            <Navbar />
            <div className="container mt-4 addnotes">
                <Button className="mb-4" variant="text" color="secondary" startIcon={<ArrowBackIcon />} component={Link} to="/" style={{ textTransform: "none", fontFamily: "'Poppins', sans-serif" }}>Home</Button>
                <h2 style={{ fontWeight: "bold" }}>Create new Note</h2>
                <p className="mb-4">Add a new note with your info / notes</p>
                <form autoComplete="off" noValidate onSubmit={handleSubmit} >
                    <div className="title mb-4">
                        <TextField
                            {...getFieldProps('title')}
                            error={Boolean(touched.title && errors.title)}
                            helperText={touched.title && errors.title}
                            color="secondary"
                            label="Title" variant="outlined" fullWidth />
                    </div>
                    <div className="description mb-4">
                        <TextField
                            {...getFieldProps('description')}
                            error={Boolean(touched.description && errors.description)}
                            helperText={touched.description && errors.description}
                            color="secondary" label="Description" variant="outlined" fullWidth />
                    </div>
                    <div className="tags mb-4">
                        <TextField
                            {...getFieldProps('tag')}
                            error={Boolean(touched.tag && errors.tag)}
                            helperText={touched.tag && errors.tag}
                            color="secondary" label="Tags" variant="outlined" fullWidth />
                    </div>
                    <Button type="submit" fullWidth size="large" className="mb-4" variant="contained" color="secondary" style={{ textTransform: "none", fontFamily: "'Poppins', sans-serif", fontSize: "1.1rem" }}>Add Note</Button>
                </form>
            </div>
        </div>
    );
}

export default FormValidations;
