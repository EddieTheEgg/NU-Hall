import React, { useState } from "react";

const UserLoginForm = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // For sign-up
    const [isNewUser, setIsNewUser] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, password, isNewUser });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isNewUser ? "Sign Up" : "Log In"}</h2>
            {isNewUser && (
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
            )}
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <button type="submit">{isNewUser ? "Sign Up" : "Log In"}</button>
            <div>
                <button type="button" onClick={() => setIsNewUser(!isNewUser)}>
                    {isNewUser ? "Already have an account? Log In" : "New user? Sign Up"}
                </button>
            </div>
        </form>
    );
};

export default UserLoginForm;
