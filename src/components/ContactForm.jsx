import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
});

const Contact = () => {
     const [isSubmitting, setIsSubmitting] = useState(false);
     const {
       register,
       handleSubmit,
       reset,
       formState: { errors },
     } = useForm({
       resolver: yupResolver(schema),
     });

      const onSubmit = async (data) => {
        try {
          setIsSubmitting(true);

          // Create a new FormData instance
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("email", data.email);
          formData.append("subject", data.subject);
          formData.append("message", data.message);

          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/api/v1/contact`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
              credentials: "include",
            }
          );

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message || "Failed to send message");
          }

          toast.success("Your message has been sent successfully!");
          reset();
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error(
            error.message || "An error occurred while sending your message"
          );
        } finally {
          setIsSubmitting(false);
        }
    };
    
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[var(--text-color)]">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-[var(--container-color)] text-[var(--text-color)]`}
              placeholder="Full Name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-[var(--container-color)] text-[var(--text-color)]`}
              placeholder="your.email@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            {...register("subject")}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.subject
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-[var(--container-color)] text-[var(--text-color)]`}
            placeholder="How can I help you?"
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows={2}
            {...register("message")}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.message
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-[var(--container-color)] text-[var(--text-color)]`}
            placeholder="Your message here..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-1 cursor-pointer bg-[var(--button-bg-color)] text-[var(--button-color)] font-medium rounded-lg hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--button-color)]"
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
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Contact