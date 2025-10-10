import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  ...props
}) => {
  // Base classes
  const baseClasses =
    "font-medium rounded-full transition-all duration-300 flex items-center justify-center";

  // Variants
  const variants = {
    primary: "bg-logo-bg text-white hover:bg-logo-bg/90",
    secondary:
      "bg-transparent border-2 border-logo-bg text-logo-bg hover:bg-logo-bg hover:text-white",
    ghost: "bg-transparent text-logo-bg hover:bg-logo-bg/10",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  // Sizes
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2",
    lg: "text-lg px-6 py-2.5",
  };

  // Disabled state
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
