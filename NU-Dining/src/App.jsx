import React, { useState } from 'react';
import axios from 'axios';

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        dietaryRestrictions: [],
        nutritionalFocus: []
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle dietary restrictions (comma-separated input)
    const handleDietaryRestrictionsChange = (e) => {
        const value = e.target.value.split(',').map((item) => item.trim());
        setFormData({ ...formData, dietaryRestrictions: value });
    };

    // Handle nutritional focus input (JSON format for simplicity)
    const handleNutritionalFocusChange = (e) => {
        try {
            const jsonValue = JSON.parse(e.target.value);
            setFormData({ ...formData, nutritionalFocus: jsonValue });
        } catch (error) {
            console.error("Invalid JSON format for nutritional focus");
        }
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/users/addUser', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('User added successfully:', response.data);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div>
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Dietary Restrictions (comma-separated):
                    <input type="text" name="dietaryRestrictions" onChange={handleDietaryRestrictionsChange} />
                </label>
                <br />
                <label>
                    Nutritional Focus (JSON format):
                    <textarea name="nutritionalFocus" onChange={handleNutritionalFocusChange} />
                </label>
                <br />
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default AddUserForm;