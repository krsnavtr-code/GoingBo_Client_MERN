"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  X,
  Car,
  Phone,
  Mail,
  User,
  Plus,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function CabSearchForm({
  searchParams,
  setSearchParams,
  onSubmit,
  loading = false,
}) {
  const [focusedField, setFocusedField] = useState(null);
  const [showCabForm, setShowCabForm] = useState(false);
  const [verificationStep, setVerificationStep] = useState('register'); // 'register', 'verify', 'success', 'otp-sent'
  const [otp, setOtp] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState(''); // 'available', 'taken-user', 'taken-owner', 'checking'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const { user, login } = useAuth();
  
  useEffect(() => {
    if (user) {
      setCabFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        driverName: user.name || "",
        driverPhone: user.phone || ""
      }));
    }
  }, [user]);
  
  const [cabFormData, setCabFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    cabName: "",
    cabType: "economy", // Default to economy
    capacity: 4,
    cabNumber: "",
    pricePerKm: "",
    driverName: "",
    driverPhone: "",
    licenseNumber: "",
    city: "",
    availability: true,
    features: [],
    routes: [{ from: "", to: "", isActive: true }]
  });
  
  const [newFeature, setNewFeature] = useState("");

  const handleCabFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCabFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFeature = (e) => {
    e.preventDefault();
    if (newFeature.trim() !== '') {
      setCabFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setCabFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleRouteChange = (index, field, value) => {
    const updatedRoutes = [...cabFormData.routes];
    updatedRoutes[index] = { ...updatedRoutes[index], [field]: value };
    setCabFormData(prev => ({
      ...prev,
      routes: updatedRoutes
    }));
  };

  const addRoute = (e) => {
    e.preventDefault();
    setCabFormData(prev => ({
      ...prev,
      routes: [...prev.routes, { from: '', to: '', isActive: true }]
    }));
  };

  const removeRoute = (index) => {
    if (cabFormData.routes.length > 1) {
      setCabFormData(prev => ({
        ...prev,
        routes: prev.routes.filter((_, i) => i !== index)
      }));
    }
  };

  // Function to check if email exists and get user role
  const checkEmailExists = async (email) => {
    try {
      console.log('Checking email:', email);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      console.log('Email check response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check email');
      }
      
      // Return the data in the expected format
      return {
        exists: data.data.exists,
        role: data.data.role
      };
    } catch (error) {
      console.error('Error checking email:', error);
      throw new Error(error.message || 'Failed to verify email. Please try again.');
    }
  };

  const sendVerificationOtp = async (email, isCabRegistration = false) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/resend-verification-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          isCabRegistration 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP. Please try again.');
      }
      
      setVerificationEmail(email);
      setVerificationStep('otp-sent');
      setVerificationMessage('OTP has been sent to your email. Please enter it below.');
      setIsOtpSent(true);
      
      // Start resend timer (2 minutes)
      setOtpResendTimer(120);
      const timer = setInterval(() => {
        setOtpResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('OTP send error:', error);
      setVerificationMessage(error.message || 'Failed to send OTP. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!cabFormData.email) {
      setVerificationMessage('Please enter your email first');
      return;
    }
    
    await sendVerificationOtp(cabFormData.email, true); // true indicates it's for cab registration
  };

  const handleCabRegistration = async (e) => {
    e.preventDefault();
    
    // If OTP is not verified and email is available, send OTP first
    if (emailStatus === 'available' && verificationStep !== 'verified') {
      const otpSent = await sendVerificationOtp(cabFormData.email);
      if (!otpSent) return;
      return;
    }
    
    // If OTP is verified, proceed with registration
    if (verificationStep === 'verified') {
      await completeRegistration();
    }
  };
  
  const completeRegistration = async () => {
    setIsSubmitting(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please try verifying your email again.');
      }

      // Prepare cab details according to the database schema with proper null checks
      const cabNumber = String(cabFormData.cabNumber || '').trim().toUpperCase();
      const cabName = String(cabFormData.cabName || '').trim() || `Cab ${cabNumber || 'New'}`;
      const city = String(cabFormData.city || '').trim();
      const driverName = String(cabFormData.driverName || cabFormData.name || 'Unknown').trim();
      const driverPhone = String(cabFormData.driverPhone || cabFormData.phone || '').trim();
      const licenseNumber = String(cabFormData.licenseNumber || 'PENDING').trim();
      
      if (!cabNumber) {
        throw new Error('Cab registration number is required');
      }
      
      if (!driverPhone) {
        throw new Error('Driver phone number is required');
      }
      
      const cabDetails = {
        name: cabName,
        type: String(cabFormData.cabType || 'economy').toLowerCase(),
        capacity: Math.max(1, parseInt(cabFormData.capacity, 10) || 4),
        registrationNumber: cabNumber,
        
        // Driver information
        driver: {
          name: driverName,
          phone: driverPhone,
          licenseNumber: licenseNumber
        },
        
        // Default route from the form's city
        routes: city ? [{
          from: city,
          to: city,
          isActive: true
        }] : [],
        
        // Other cab details
        pricePerKm: Math.max(0, parseFloat(cabFormData.pricePerKm) || 0),
        features: Array.isArray(cabFormData.features) ? cabFormData.features.filter(Boolean) : [],
        isAvailable: Boolean(cabFormData.availability),
        isActive: false, // New cabs should be inactive by default until verified
        
        // Add user reference if needed
        user: {
          name: String(cabFormData.name || '').trim(),
          email: String(cabFormData.email || '').trim().toLowerCase(),
          phone: driverPhone
        }
      };
      
      console.log('Submitting cab details with token:', token.substring(0, 20) + '...');
      console.log('Cab details being sent:', JSON.stringify(cabDetails, null, 2));
      
      // Submit cab details to the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cabs/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cabDetails)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Cab registration error:', data);
        throw new Error(data.message || 'Failed to save cab details. Please try again.');
      }
      
      // Show success message
      alert('Cab registered successfully! Our team will contact you shortly for verification.');
      
      // Close the form
      setShowCabForm(false);
      
      // Reset the form
      setVerificationStep('register');
      setCabFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirm: "",
        cabName: "",
        cabType: "economy",
        capacity: 4,
        cabNumber: "",
        pricePerKm: "",
        driverName: "",
        driverPhone: "",
        licenseNumber: "",
        city: "",
        availability: true,
        features: [],
        routes: [{ from: "", to: "", isActive: true }]
      });
      
      // Show success message in the UI
      setVerificationMessage('Cab registered successfully! Our team will contact you shortly.');
      setVerificationStep('success');
      setVerificationMessage('Cab details saved successfully! Your cab is now ready for bookings.');
      
    } catch (error) {
      console.error('Registration error:', error);
      setVerificationMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setVerificationMessage('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-cab-owner-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationEmail,
          otp: otp
        })
      });

      const data = await response.json();
      console.log('OTP Verification Response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed. Please try again.');
      }
      
      // Handle different possible token locations in the response
      const token = data.token || (data.data && data.data.token) || 
                   (response.headers.get('Authorization')?.split(' ')[1]);
      
      if (token) {
        console.log('Saving token to localStorage:', token.substring(0, 20) + '...');
        localStorage.setItem('token', token);
      } else {
        console.warn('No token found in response:', data);
      }
      
      // Mark as verified and proceed with registration
      setVerificationStep('verified');
      setVerificationMessage('Email verified successfully! Click Register Cab to continue.');
      
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationMessage(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendOTP = async () => {
    if (otpResendTimer > 0) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/resend-verification-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      
      setVerificationMessage('New OTP has been sent to your email.');
      setOtpResendTimer(120); // Reset timer to 2 minutes
      
      // Start the timer again
      const timer = setInterval(() => {
        setOtpResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      setVerificationMessage(error.message || 'Failed to resend OTP. Please try again.');
    }
  };
  
  const handleCabDetailsSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare cab details data
      const cabDetails = {
        name: cabFormData.cabName,
        cabType: cabFormData.cabType,
        cabNumber: cabFormData.cabNumber,
        city: cabFormData.city,
        availability: cabFormData.availability,
        capacity: parseInt(cabFormData.capacity, 10),
        pricePerKm: parseFloat(cabFormData.pricePerKm) || 10,
        driver: {
          name: cabFormData.driverName,
          phone: cabFormData.driverPhone,
          licenseNumber: cabFormData.licenseNumber
        },
        features: [...cabFormData.features],
        routes: cabFormData.routes.filter(route => route.from && route.to)
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cabs/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cabDetails)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save cab details');
      }

      // Show success message
      toast.success('Cab registration completed successfully!');
      
      // Reset form and close modal
      setCabFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirm: "",
        cabName: "",
        cabType: "economy",
        capacity: 4,
        cabNumber: "",
        pricePerKm: "",
        driverName: "",
        driverPhone: "",
        licenseNumber: "",
        city: "",
        availability: true,
        features: [],
        routes: [{ from: "", to: "", isActive: true }]
      });
      
      setVerificationStep('register');
      setShowCabForm(false);
      
    } catch (error) {
      console.error('Error saving cab details:', error);
      setVerificationMessage(error.message || 'Failed to save cab details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="space-y-5 bg-[var(--container-color-in)] p-5 rounded-xl shadow-md max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[var(--text-color)]">
            Find Your Perfect Ride
          </h2>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowCabForm(true);
              }}
              className="bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] text-[var(--button-color)] px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Car className="h-5 w-5" />
              Register Your Cab
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Pickup Location */}
          <div className="relative lg:col-span-3">
            <label htmlFor="pickup" className="block text-sm font-medium mb-1">
              Pickup Location
            </label>
            <div
              className={`relative ${
                focusedField === "pickup"
                  ? "ring-2 ring-[var(--logo-color)]"
                  : ""
              } rounded-md transition-all duration-200`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5" />
              </div>
              <input
                type="text"
                id="pickup"
                name="pickup"
                required
                value={searchParams.pickup}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("pickup")}
                onBlur={() => setFocusedField(null)}
                className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
                placeholder="Enter pickup location"
              />
            </div>
          </div>

          {/* Drop Location */}
          <div className="relative lg:col-span-3">
            <label htmlFor="drop" className="block text-sm font-medium mb-1">
              Drop Location
            </label>
            <div
              className={`relative ${
                focusedField === "drop" ? "ring-2 ring-[var(--logo-color)]" : ""
              } rounded-md transition-all duration-200`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5" />
              </div>
              <input
                type="text"
                id="drop"
                name="drop"
                required
                value={searchParams.drop}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("drop")}
                onBlur={() => setFocusedField(null)}
                className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
                placeholder="Enter drop location"
              />
            </div>
          </div>

          {/* Date */}
          <div className="relative sm:col-span-1 lg:col-span-3">
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5" />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={searchParams.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
              />
            </div>
          </div>

          {/* Time */}
          <div className="relative sm:col-span-1 lg:col-span-2">
            <label htmlFor="time" className="block text-sm font-medium mb-1">
              Time
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5" />
              </div>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={searchParams.time}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
              />
            </div>
          </div>

          {/* Passengers */}
          <div className="relative sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="passengers"
              className="block text-sm font-medium mb-1"
            >
              Passengers
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5" />
              </div>
              <select
                id="passengers"
                name="passengers"
                value={searchParams.passengers}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center lg:justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-[var(--button-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--logo-color)] transition-all duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Searching..." : "Search Cab"}
          </button>
        </div>
      </form>

      {/* Add New Cab Modal */}
      {showCabForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-[var(--container-color)] rounded-lg shadow-lg w-full max-w-2xl px-6 py-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCabForm(false)}
              className="absolute top-4 right-4 text-[var(--text-color)] hover:text-[var(--logo-color)]"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-semibold mb-6 text-[var(--text-color)]">
              Fill Details to Register Your Cab
            </h3>

            <form onSubmit={handleCabRegistration} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-color)]">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <Mail className="h-5 w-5 text-gray-400" /> */}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      value={cabFormData.email}
                      onChange={(e) => {
                        handleCabFormChange(e);
                        // Reset verification state if email changes
                        if (verificationStep !== "register") {
                          setVerificationStep("register");
                          setVerificationMessage("");
                          setOtp("");
                        }
                      }}
                      onBlur={async (e) => {
                        const email = e.target.value.trim();
                        if (email && email.includes("@")) {
                          setVerificationMessage("Checking email...");
                          setEmailStatus("checking");

                          try {
                            const emailCheck = await checkEmailExists(email);

                            if (emailCheck.exists) {
                              if (emailCheck.role === "user") {
                                setVerificationMessage(
                                  "This Email is already use in Booking Account"
                                );
                                setEmailStatus("taken-user");
                              } else if (emailCheck.role === "cab-owner") {
                                setVerificationMessage(
                                  "This Email is already in use! Please Login"
                                );
                                setEmailStatus("taken-owner");
                              } else {
                                setVerificationMessage(
                                  "This email is already registered"
                                );
                                setEmailStatus("taken");
                              }
                            } else {
                              setVerificationMessage("");
                              setEmailStatus("available");
                            }
                          } catch (error) {
                            console.error("Error checking email:", error);
                            setVerificationMessage(
                              "Error checking email. Please try again."
                            );
                            setEmailStatus("error");
                          }
                        }
                      }}
                      required
                      className="block w-[calc(100%-8rem)] pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                      placeholder="your@email.com"
                    />
                    {emailStatus === "available" &&
                      verificationStep === "register" && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSubmitting}
                          className="px-3 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] rounded-md hover:bg-[var(--button-hover-color)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSubmitting ? "Sending..." : "Send OTP"}
                        </button>
                      )}
                  </div>
                  {verificationMessage && (
                    <p
                      className={`mt-1 text-sm ${
                        emailStatus === "available"
                          ? "text-green-600"
                          : emailStatus === "checking"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {verificationMessage}
                    </p>
                  )}

                  {/* OTP Verification Section - Only show when OTP is sent but not yet verified */}
                  {verificationStep === "otp-sent" && (
                    <div className="mt-4 p-4 bg-[var(--container-color-in)] rounded-md">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Enter OTP sent to {verificationEmail}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value.replace(/\D/g, "").slice(0, 6)
                              )
                            }
                            placeholder="Enter OTP"
                            className="block w-40 px-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            maxLength={6}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={isSubmitting || otp.length !== 6}
                            className="px-3 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] text-sm font-medium rounded-md hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--button-bg-color)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isSubmitting ? "Verifying..." : "Verify OTP"}
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={otpResendTimer > 0 || isSubmitting}
                            className="text-sm text-[var(--logo-color)] hover:text-[var(--logo-color-two)] disabled:text-[var(--logo-color)] disabled:cursor-not-allowed cursor-pointer"
                          >
                            {otpResendTimer > 0
                              ? `Resend OTP in ${Math.floor(
                                  otpResendTimer / 60
                                )}:${(otpResendTimer % 60)
                                  .toString()
                                  .padStart(2, "0")}`
                              : "Resend OTP"}
                          </button>
                          {verificationStep === "verified" && (
                            <span className="text-sm text-green-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Email Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Password Field */}
                {verificationStep === "verified" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-color)]">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={cabFormData.password}
                        onChange={handleCabFormChange}
                        required
                        minLength={8}
                        className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Password Field */}
                {verificationStep === "verified" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-color)]">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="passwordConfirm"
                        value={cabFormData.passwordConfirm}
                        onChange={handleCabFormChange}
                        required
                        minLength={8}
                        className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    User Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={cabFormData.name}
                      onChange={handleCabFormChange}
                      required
                      className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={cabFormData.phone}
                      onChange={handleCabFormChange}
                      required
                      className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Cab Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cabName"
                    value={cabFormData.cabName}
                    onChange={handleCabFormChange}
                    required
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="e.g., Swift Dzire, Innova Crysta"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Cab Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cabType"
                    value={cabFormData.cabType}
                    onChange={handleCabFormChange}
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                    <option value="suv">SUV</option>
                    <option value="minivan">Minivan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Seating Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    max="12"
                    value={cabFormData.capacity}
                    onChange={handleCabFormChange}
                    required
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="e.g., 4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Price per KM (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerKm"
                    min="0"
                    step="0.5"
                    value={cabFormData.pricePerKm}
                    onChange={handleCabFormChange}
                    required
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="e.g., 12.5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cabNumber"
                    value={cabFormData.cabNumber}
                    onChange={handleCabFormChange}
                    required
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] uppercase"
                    placeholder="e.g., MH 01 AB 1234"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Driver's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="driverName"
                    value={cabFormData.driverName}
                    onChange={handleCabFormChange}
                    required
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="Driver's full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Driver's Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="driverPhone"
                    value={cabFormData.driverPhone}
                    onChange={handleCabFormChange}
                    required
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="Driver's phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Driver's License <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={cabFormData.licenseNumber}
                    onChange={handleCabFormChange}
                    required
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="Driver's license number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-color)]">
                    Operating City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={cabFormData.city}
                    onChange={handleCabFormChange}
                    required
                    className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="e.g., Mumbai"
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-color)]">
                  Cab Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature(e))
                    }
                    className="flex-1 rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="Add a feature (e.g., AC, WiFi)"
                  />
                  <button
                    onClick={addFeature}
                    type="button"
                    className="px-4 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] rounded-md hover:bg-[var(--button-hover-color)] transition-colors"
                  >
                    Add
                  </button>
                </div>
                {cabFormData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cabFormData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--container-color-in)] text-[var(--text-color)] border border-[var(--border-color)]"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Routes Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-color)]">
                  Operating Routes <span className="text-red-500">*</span>
                </label>
                {cabFormData.routes.map((route, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        From
                      </label>
                      <input
                        type="text"
                        value={route.from}
                        onChange={(e) =>
                          handleRouteChange(index, "from", e.target.value)
                        }
                        required
                        className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                        placeholder="From city"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        To
                      </label>
                      <input
                        type="text"
                        value={route.to}
                        onChange={(e) =>
                          handleRouteChange(index, "to", e.target.value)
                        }
                        required
                        className="block w-full rounded-md border border-[var(--border-color)] px-3 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                        placeholder="To city"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`route-active-${index}`}
                          checked={route.isActive}
                          onChange={(e) =>
                            handleRouteChange(
                              index,
                              "isActive",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-[var(--logo-color)] focus:ring-[var(--logo-color)] border-[var(--border-color)] rounded"
                        />
                        <label
                          htmlFor={`route-active-${index}`}
                          className="ml-2 block text-sm text-[var(--text-color)]"
                        >
                          Active
                        </label>
                      </div>
                      {cabFormData.routes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoute(index)}
                          className="ml-auto text-red-500 hover:text-red-700"
                          title="Remove route"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRoute}
                  className="mt-2 text-sm text-[var(--logo-color)] hover:underline flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add another route
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="availability"
                  name="availability"
                  checked={cabFormData.availability}
                  onChange={handleCabFormChange}
                  className="h-4 w-4 text-[var(--logo-color)] focus:ring-[var(--logo-color)] border-[var(--border-color)] rounded cursor-pointer"
                />
                <label
                  htmlFor="availability"
                  className="ml-2 block text-sm text-[var(--text-color)]"
                >
                  Currently Available for Bookings
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (emailStatus === "available" &&
                      verificationStep !== "verified")
                  }
                  className={`w-full bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] text-[var(--button-color)] py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${
                    isSubmitting ||
                    (emailStatus === "available" &&
                      verificationStep !== "verified")
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <Car className="h-5 w-5" />
                  {isSubmitting
                    ? "Processing..."
                    : verificationStep === "otp-sent"
                    ? "Verify OTP to Continue"
                    : verificationStep === "verified"
                    ? "Complete Registration"
                    : "Register Cab"}
                </button>

                {emailStatus === "available" &&
                  verificationStep === "register" && (
                    <p className="mt-2 text-sm text-yellow-600">
                      Please verify your email with OTP to continue
                    </p>
                  )}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                By registering, you agree to our Terms of Service and Privacy
                Policy. Our team will contact you shortly to complete the
                verification process.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
