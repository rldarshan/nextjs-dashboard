"use client";

import React, { useState } from "react";
import "./styles/login_styles.css";
import { auth } from "../firebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Add login logic here (API call)
  };

  const handleFacebookLogin = async (): Promise<void> => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Facebook Login Success:", user);
      // Handle user token or send to backend
    } catch (error) {
      console.error("Facebook Login Error:", (error as Error).message);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Login Success:", user);
      // Handle user token or send to backend
      router.push("/dashboard");
    } catch (error) {
      console.error("Google Login Error:", (error as Error).message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="title">Login</h2>
        <form onSubmit={handleLogin} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="text">
          Don't have an account?{" "}
          <a href="/signup" className="link">
            Sign up
          </a>
        </p>

        <div className="social-container">
          <button
            onClick={handleGoogleLogin}
            className="social-button"
            style={{ backgroundColor: "#DB4437" }}
          >
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="social-button"
            style={{ backgroundColor: "#4267B2" }}
          >
            Sign in with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
