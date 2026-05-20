import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  ArrowRight,
  AlertCircle,
  Facebook,
  Chrome,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import apiClient from "../services/apiClient";

interface LoginProps {
  onNavigate: (page: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    // Validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    /*try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
          };

      const res = await apiClient.post(endpoint, payload);
      const data = res.data;

      if (res.status === 200 || res.status === 201) {
        const token = data.access_token || data.token;
        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
        onNavigate("dashboard");
      } else {
        setErrors({ general: data.error || "Something went wrong" });
      }
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    }*/
   try {
      if (isLogin) {
        const res = await apiClient.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.access_token);
        onNavigate("dashboard");
      } else {
        const res = await apiClient.post("/auth/register", formData);
        localStorage.setItem("token", res.data.access_token);
        onNavigate("dashboard");
      }
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-green-600 p-3 rounded-xl">
              <Leaf className="size-8 text-white" />
            </div>
            <span className="text-2xl text-gray-900">AgriCare AI</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? "Sign in to access your agricultural dashboard"
                : "Join 50,000+ farmers using AI to protect their crops"}
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Chrome className="size-5 text-gray-700" />
              <span className="text-gray-700">Continue with Google</span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Facebook className="size-5 text-blue-600" />
              <span className="text-gray-700">Continue with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.name ? "border-red-300" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="size-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
                              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle className="size-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password - Only for signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 ${
                      errors.confirmPassword ? "border-red-300" : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms - Only for signup */}
            {!isLogin && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <button type="button" className="text-green-600 hover:text-green-700">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-green-600 hover:text-green-700">
                    Privacy Policy
                  </button>
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-lg">{isLogin ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="size-5" />
            </button>

            {/* General error */}
            {errors.general && (
              <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                <AlertCircle className="size-4" />
                <span>{errors.general}</span>
              </div>
            )}
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <button
              onClick={toggleMode}
              className="text-green-600 hover:text-green-700"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate("landing")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Image & Info */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1627920769842-6887c6df05ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Smart farming"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full filter blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h2 className="mb-6 text-5xl">Join the Future of Farming</h2>
          <p className="text-2xl text-green-100 mb-12 leading-relaxed">
            Access powerful AI tools to protect your crops, monitor weather, and track market prices all in one place.
          </p>

          {/* Features */}
          <div className="space-y-6">
            {[
              {
                title: "95% Accuracy",
                description: "AI-powered disease detection validated by experts",
              },
              {
                title: "50,000+ Farmers",
                description: "Trusted by farmers across India",
              },
              {
                title: "24/7 Access",
                description: "Monitor your crops anytime, anywhere",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="size-6" />
                </div>
                <div>
                  <h4 className="text-xl mb-1">{feature.title}</h4>
                  <p className="text-green-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-green-50 mb-4 italic">
              "AgriCare AI helped me save my entire crop. The early detection feature is amazing!"
            </p>
            <div className="text-sm">
              <div className="text-white">Rajesh Kumar</div>
              <div className="text-green-200">Farmer, Punjab</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}