"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      email: formData?.email,
      password: formData?.password,
      redirect: false,
    };
    try {
      const result = await signIn("credentials", data);

      if (result?.error) {
        setError(result?.error);
      }
      if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn("google", { redirect: false });

      if (result?.ok) {
        router.push("/");
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.log("Google sign-in error:", error);
    }
  };
  const handleGithubLogin = async () => {
    try {
      const result = await signIn("github", { redirect: false });

      if (result?.ok) {
        router.push("/");
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.log("Google sign-in error:", error);
    }
  };
  const handleFacebookLogin = async () => {
    try {
      const result = await signIn("facebook", { redirect: false });

      if (result?.ok) {
        router.push("/");
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.log("Google sign-in error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-600 my-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Continue with Google
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={handleGithubLogin}
            className="w-full bg-black hover:bg-black text-white py-2 px-4 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Continue with Github
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={handleFacebookLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
