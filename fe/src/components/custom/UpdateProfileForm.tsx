"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUpdateUser } from "@/hooks/use-update-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  UserCheck,
  Heart,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import "@/styles/hero.css";

export default function UpdateProfileForm() {
  const { data: session } = useSession();
  const { updateUser, isLoading, error } = useUpdateUser();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    image: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Initialize form data when session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        username: session.user.username || "",
        email: session.user.email || "",
        password: "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Name validation
    if (formData.name.trim() && formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Username validation
    if (formData.username && formData.username !== session?.user?.username) {
      if (formData.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      } else if (formData.username.length > 20) {
        errors.username = "Username must be less than 20 characters";
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        errors.username =
          "Username can only contain letters, numbers, underscores, and hyphens";
      }
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Image URL validation
    if (formData.image && formData.image.trim()) {
      try {
        new URL(formData.image);
      } catch {
        errors.image = "Please enter a valid URL";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Only send fields that have changed
    const updateData: Record<string, string> = {};
    if (formData.name.trim() !== (session?.user?.name || "")) {
      updateData.name = formData.name.trim();
    }
    if (formData.username !== (session?.user?.username || "")) {
      updateData.username = formData.username;
    }
    if (formData.email !== (session?.user?.email || "")) {
      updateData.email = formData.email;
    }
    if (formData.password) {
      updateData.password = formData.password;
    }
    if (formData.image !== (session?.user?.image || "")) {
      updateData.image = formData.image;
    }

    if (Object.keys(updateData).length === 0) {
      setValidationErrors({ general: "No changes detected" });
      return;
    }

    const result = await updateUser(updateData);
    if (result) {
      // Clear password field and validation errors after successful update
      setFormData((prev) => ({ ...prev, password: "" }));
      setValidationErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general error when user makes changes
    if (validationErrors.general) {
      setValidationErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900/90 via-pink-800/85 to-purple-900/90 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 text-rose-300/30 animate-pulse">
          <Heart size={24} />
        </div>
        <div className="absolute top-32 right-12 text-pink-300/25 animate-pulse delay-1000">
          <Sparkles size={20} />
        </div>
        <div className="absolute bottom-40 left-12 text-rose-300/20 animate-pulse delay-500">
          <Heart size={18} />
        </div>
        <div className="absolute top-48 right-1/4 text-pink-300/15 animate-pulse delay-700">
          <Sparkles size={16} />
        </div>
        <div className="absolute bottom-28 right-16 text-rose-300/25 animate-pulse delay-300">
          <Heart size={20} />
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-0 w-full max-w-lg">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 vfont">
                Update Profile
              </h1>
              <p className="text-gray-600 text-sm">
                Manage your account information
              </p>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-rose-100 shadow-lg">
                <AvatarImage
                  src={formData.image || session?.user?.image || ""}
                />
                <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-white text-2xl">
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-rose-500" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full h-11 px-4 rounded-lg border-gray-200 focus:border-rose-500 focus:ring-rose-500/20 transition-colors ${
                  validationErrors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-rose-500" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                className={`w-full h-11 px-4 rounded-lg border-gray-200 focus:border-rose-500 focus:ring-rose-500/20 transition-colors ${
                  validationErrors.username
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {validationErrors.username && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {validationErrors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-rose-500" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full h-11 px-4 rounded-lg border-gray-200 focus:border-rose-500 focus:ring-rose-500/20 transition-colors ${
                  validationErrors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-rose-500" />
                New Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className={`w-full h-11 px-4 rounded-lg border-gray-200 focus:border-rose-500 focus:ring-rose-500/20 transition-colors ${
                  validationErrors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-rose-500" />
                Profile Image URL
              </Label>
              <Input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/your-image.jpg"
                className={`w-full h-11 px-4 rounded-lg border-gray-200 focus:border-rose-500 focus:ring-rose-500/20 transition-colors ${
                  validationErrors.image
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {validationErrors.image && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {validationErrors.image}
                </p>
              )}
            </div>

            {/* Error Messages */}
            {validationErrors.general && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                {validationErrors.general}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed vfont text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating Profile...
                </div>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>

          {/* Footer Message */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Your information is secure and will only be used to improve your
              experience
            </p>
          </div>

          <Toaster />
        </Card>
      </div>
    </div>
  );
}
