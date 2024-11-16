import React, { createContext, useState } from "react";

export const NoteContext = createContext();

export function NoteProvider(props) {
    const HOST = "http://localhost:8080";
    const initialNotes = [];

    const [notes, setNotes] = useState(initialNotes);

    const getNotes = async () => {
        try {
            const response = await fetch(`${HOST}/api/notes/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
            });
            const json = await response.json();
            setNotes(json);
        } catch (error) {
            console.error("Error fetching notes:", error);
            setNotes([]); // Set empty array or handle error state
        }
    };

    const add = async (newNote) => {
        try {
            const response = await fetch(`${HOST}/api/notes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(newNote)
            });
            const json = await response.json();
            setNotes([...notes, json]);
        } catch (error) {
            console.error("Error adding note:", error);
            throw new Error("Failed to add note");
        }
    };

    const remove = async (removeId) => {
        try {
            await fetch(`${HOST}/api/notes/${removeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
            });
            setNotes(notes.filter(note => note._id !== removeId));
        } catch (error) {
            console.error("Error deleting note:", error);
            throw new Error("Failed to delete note");
        }
    };

    const edit = async (title, description, tag, editId) => {
        try {
            await fetch(`${HOST}/api/notes/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, tag })
            });
            const updatedNotes = notes.map(note => {
                if (note._id === editId) {
                    return { ...note, title, description, tag };
                }
                return note;
            });
            setNotes(updatedNotes);
        } catch (error) {
            console.error("Error editing note:", error);
            throw new Error("Failed to edit note");
        }
    };

    return (
        <NoteContext.Provider value={{ notes, getNotes, add, remove, edit }}>
            {props.children}
        </NoteContext.Provider>
    );
}
