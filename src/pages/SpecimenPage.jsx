import React, { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "../services/supabaseClient";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";

const Input = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  required = false,
}) => {
  return (
    <div className="mb-3 md:mb-4">
      <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p>}
    </div>
  );
};

const TextArea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
}) => {
  return (
    <div className="mb-3 md:mb-4">
      <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows="4"
        className={`w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p>}
    </div>
  );
};

const FileInput = ({ label, name, onChange, error, required = false }) => {
  return (
    <div className="mb-3 md:mb-4">
      <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept="image/*,.pdf"
        className={`w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p>}
      <p className="text-xs text-gray-500 mt-1">
        Please upload a genuine School Teacher ID or Coaching Institution proof. A validation call will be made for each submission to confirm.
      </p>
      <p className="text-xs text-red-600 mt-1 font-semibold">
        🚫ATTENTION: Fake ID cards submitted by students will be reported to the school principals, leading to disciplinary action.
      </p>
    </div>
  );
};

const SpecimenPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    whatsappNumber: "",
    otherPhoneNumber: "",
    fullName: "",
    schoolBoard: "",
    addressLine1: "",
    addressLine2: "",
    postCode: "",
    townCity: "",
    stateRegion: "",
    email: "",
    schoolName: "",
    classes: [],
    medium: "",
    subjects: [],
    additionalRequest: "",
    teacherIdCard: null,
  });

  const [errors, setErrors] = useState({});

  const schoolBoardOptions = [
    { value: "cbse", label: "CBSE" },
    { value: "icse", label: "ICSE / ISC" },
    { value: "cbse_icse", label: "CBSE & ICSE / ISC" },
    { value: "state_board", label: "State Board" },
  ];

  const classOptions = [
    { value: "class_1", label: "Class 1" },
    { value: "class_2", label: "Class 2" },
    { value: "class_3", label: "Class 3" },
    { value: "class_4", label: "Class 4" },
    { value: "class_5", label: "Class 5" },
    { value: "class_6", label: "Class 6" },
    { value: "class_7", label: "Class 7" },
    { value: "class_8", label: "Class 8" },
    { value: "class_9", label: "Class 9" },
    { value: "class_10", label: "Class 10" },
    { value: "class_11", label: "Class 11" },
    { value: "class_12", label: "Class 12" },
    { value: "neet", label: "NEET" },
    { value: "jee", label: "JEE" },
    { value: "pre_primary", label: "Pre-primary" },
    { value: "other", label: "Other" },
  ];

  const mediumOptions = [
    { value: "english_private", label: "English Medium (Private)" },
    { value: "english_government", label: "English Medium (Government)" },
    { value: "hindi", label: "Hindi Medium (mainly)" },
    { value: "other", label: "Other" },
  ];

  const subjectOptions = [
    { value: "science", label: "Science" },
    { value: "mathematics", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "english_communicative", label: "English Communicative" },
    { value: "social_science", label: "Social Science (History/Civ/Geo/Eco)" },
    { value: "hindi_a", label: "Hindi A" },
    { value: "hindi_b", label: "Hindi B" },
    { value: "sanskrit", label: "Sanskrit" },
    { value: "sanskrit_manika", label: "Sanskrit (Manika)" },
    { value: "computer", label: "Computer" },
    { value: "information_technology", label: "Information Technology" },
    { value: "ai", label: "Artificial Intelligence (AI)" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "hindi_core", label: "Hindi Core" },
    { value: "accountancy", label: "Accountancy" },
    { value: "business_studies", label: "Business Studies" },
    { value: "economics", label: "Economics" },
    { value: "physical_education", label: "Physical Education" },
    { value: "psychology", label: "Psychology" },
    { value: "applied_mathematics", label: "Applied Mathematics" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
    { value: "political_science", label: "Political Science" },
    { value: "humanities", label: "Humanities" },
    { value: "informatics_practices", label: "Informatics Practices (IP)" },
    { value: "computer_science", label: "Computer Science" },
    { value: "hindi_elective", label: "Hindi Elective" },
    { value: "english_elective", label: "English Elective" },
    { value: "sociology", label: "Sociology" },
    { value: "entrepreneurship", label: "Entrepreneurship" },
    { value: "other_subject", label: "Other Subject" },
  ];

  const stateOptions = [
    { value: "uttar_pradesh", label: "Uttar Pradesh" },
    { value: "andhra_pradesh", label: "Andhra Pradesh" },
    { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal_pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya_pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil_nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west_bengal", label: "West Bengal" },
    { value: "delhi", label: "Delhi" },
    { value: "jammu_kashmir", label: "Jammu and Kashmir" },
    { value: "ladakh", label: "Ladakh" },
    { value: "puducherry", label: "Puducherry" },
    { value: "chandigarh", label: "Chandigarh" },
    { value: "dadra_nagar_haveli", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { value: "lakshadweep", label: "Lakshadweep" },
    { value: "andaman_nicobar", label: "Andaman and Nicobar Islands" },
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "whatsappNumber":
        if (!value.trim()) {
          return "WhatsApp number is required";
        }
        if (!/^\d{10,15}$/.test(value.replace(/\D/g, ""))) {
          return "Please provide a correct WhatsApp number";
        }
        return "";

      case "fullName":
        if (!value.trim()) {
          return "Full name is required";
        }
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters";
        }
        return "";

      case "schoolBoard":
        if (!value) {
          return "Please select your main school board";
        }
        return "";

      case "addressLine1":
        if (!value.trim()) {
          return "Address line 1 is required";
        }
        return "";

      case "addressLine2":
        if (!value.trim()) {
          return "Address line 2 is required";
        }
        return "";

      case "postCode":
        if (!value.trim()) {
          return "Post code is required";
        }
        if (!/^\d{6}$/.test(value)) {
          return "Please enter a valid 6-digit post code";
        }
        return "";

      case "townCity":
        if (!value.trim()) {
          return "Town/City is required";
        }
        return "";

      case "stateRegion":
        if (!value) {
          return "Please select your state/region";
        }
        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return "Please enter a valid email address";
          }
        }
        return "";

      case "schoolName":
        if (!value.trim()) {
          return "School name is required";
        }
        return "";

      case "classes":
        if (!value || value.length === 0) {
          return "Please select at least one class you teach";
        }
        return "";

      case "medium":
        if (!value) {
          return "Please select the medium you teach in";
        }
        return "";

      case "subjects":
        if (!value || value.length === 0) {
          return "Please select at least one subject you teach";
        }
        return "";

      case "teacherIdCard":
        if (!value) {
          return "Please upload your teacher ID card";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "whatsappNumber" || name === "otherPhoneNumber" || name === "postCode") {
      const numbersOnly = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numbersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckboxChange = (name, value, checked) => {
    const currentValues = formData[name] || [];
    if (checked) {
      setFormData({ ...formData, [name]: [...currentValues, value] });
    } else {
      setFormData({ ...formData, [name]: currentValues.filter(item => item !== value) });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, teacherIdCard: file });
    if (errors.teacherIdCard) {
      setErrors({ ...errors, teacherIdCard: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        // Step 1: Upload file to Cloudinary
        let teacherIdCardUrl = "";
        if (formData.teacherIdCard) {
          toast.info("Uploading teacher ID card...");
          try {
            teacherIdCardUrl = await uploadImageToCloudinary(formData.teacherIdCard, "specimen-teacher-ids");
          } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw new Error("Failed to upload teacher ID card");
          }
        }

        // Step 2: Prepare data for Supabase
        const specimenData = {
          whatsapp_number: formData.whatsappNumber.trim(),
          other_phone_number: formData.otherPhoneNumber.trim() || null,
          full_name: formData.fullName.trim(),
          school_board: formData.schoolBoard,
          address_line_1: formData.addressLine1.trim(),
          address_line_2: formData.addressLine2.trim(),
          post_code: formData.postCode.trim(),
          town_city: formData.townCity.trim(),
          state_region: formData.stateRegion,
          email: formData.email.trim(),
          school_name: formData.schoolName.trim(),
          classes: formData.classes, // Already an array
          medium: formData.medium,
          subjects: formData.subjects, // Already an array
          additional_request: formData.additionalRequest.trim() || null,
          teacher_id_card_url: teacherIdCardUrl,
        };

        // Step 3: Save to Supabase
        const { data, error } = await supabase
          .from("specimen_requests")
          .insert([specimenData])
          .select();

        if (error) {
          console.error("Error saving specimen request:", error);
          throw new Error("Failed to save specimen request");
        }

        // Step 4: Send email notification
        try {
          const emailResponse = await supabase.functions.invoke('specimen-form-email', {
            body: specimenData
          });

          if (emailResponse.error) {
            console.error("Error sending email:", emailResponse.error);
            // Don't throw error here as the main form submission was successful
          } else {
            console.log("Email sent successfully:", emailResponse.data);
          }
        } catch (emailError) {
          console.error("Email service error:", emailError);
          // Don't throw error here as the main form submission was successful
        }

        // Success
        toast.success("Specimen request submitted successfully! We'll contact you soon via WhatsApp.");
        console.log("Specimen request saved:", data);

        // Reset form
        setFormData({
          whatsappNumber: "",
          otherPhoneNumber: "",
          fullName: "",
          schoolBoard: "",
          addressLine1: "",
          addressLine2: "",
          postCode: "",
          townCity: "",
          stateRegion: "",
          email: "",
          schoolName: "",
          classes: [],
          medium: "",
          subjects: [],
          additionalRequest: "",
          teacherIdCard: null,
        });
        setErrors({});

      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.message || "Something went wrong! Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fix all errors before submitting");
    }
  };

  const isFormValid = () => {
    return (
      formData.whatsappNumber.trim() &&
      formData.fullName.trim() &&
      formData.schoolBoard &&
      formData.addressLine1.trim() &&
      formData.addressLine2.trim() &&
      formData.postCode.trim() &&
      formData.townCity.trim() &&
      formData.stateRegion &&
      formData.email.trim() &&
      formData.schoolName.trim() &&
      formData.classes.length > 0 &&
      formData.medium &&
      formData.subjects.length > 0 &&
      formData.teacherIdCard &&
      Object.keys(errors).every((key) => !errors[key])
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-16">
        <div className="px-4 xl:px-0 text-center">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
            Specimen Book Request
          </h1>
          <p className="text-sm md:text-xl text-blue-100 max-w-3xl mx-auto">
            Please fill this form ONLY ONCE 🙏
          </p>
          <p className="text-sm md:text-lg text-blue-100 max-w-3xl mx-auto mt-2">
            If you want to know the status of your specimen or have any other book request to make, just{" "}
            <a
              href="https://wa.me/917982645175"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-200 transition-colors"
            >
              WhatsApp us on our official number
            </a>
            .
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 pb-0">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-12 border border-gray-200">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">
              Request Your Free Specimen Book
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Fill out the form below to receive your free specimen book. All fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* WhatsApp Number */}
            <Input
              label="WhatsApp number"
              name="whatsappNumber"
              placeholder="Enter your WhatsApp number"
              value={formData.whatsappNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.whatsappNumber}
              type="tel"
              required
            />
            <p className="text-xs text-gray-600 mb-4">
              Please provide CORRECT WhatsApp number 🙏 so we can send FREE PDFs, Pre-board Papers, Important updates (we don't spam don't worry :)
            </p>

            {/* Other Phone Number */}
            <Input
              label="📱 Any other Phone number you have?"
              name="otherPhoneNumber"
              placeholder="Enter another phone number (optional)"
              value={formData.otherPhoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.otherPhoneNumber}
              type="tel"
            />
            <p className="text-xs text-gray-600 mb-4">
              If you have two numbers, do give other number here (easy for delivery boy)
            </p>

            {/* Full Name */}
            <Input
              label="Full Name"
              name="fullName"
              placeholder="First and Last Name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              required
            />

            {/* School Board */}
            <div className="mb-3 md:mb-4">
              <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2">
                🔥 Your main School Board? <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.schoolBoard}
                onValueChange={(value) => handleSelectChange("schoolBoard", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your school board" />
                </SelectTrigger>
                <SelectContent>
                  {schoolBoardOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.schoolBoard && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.schoolBoard}</p>}
              <p className="text-xs text-gray-600 mt-1">
                NOTE: Please pick 'State Board' if you are not teaching CBSE /ICSE students. We PROVIDE free books for ALL STATE boards :)
              </p>
            </div>

            {/* Address Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 font-semibold mb-2">
                ⚠️⚠️ IMPORTANT: Please provide accurate & complete ADDRESS below, else the Specimen Book(s) will be returned!
              </h3>
              <Input
                label="🏠 Address (line 1) - Flat , House , Building or Apartment Name/Number"
                name="addressLine1"
                placeholder="Example: flat 223, block D, sector 22"
                value={formData.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.addressLine1}
                required
              />
              <p className="text-xs text-gray-600 mb-4">
                NOTE: Please provide COMPLETE detail.
              </p>

              <Input
                label="🏠 Address (line 2) - Area, Colony, Street, Sector or Village Name ?"
                name="addressLine2"
                placeholder="Enter area, colony, street, sector or village name"
                value={formData.addressLine2}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.addressLine2}
                required
              />
              <p className="text-xs text-red-600 mb-4">
                NOTE: Incomplete address will result in the book NOT sent!
              </p>

              <Input
                label="📍 Post Code"
                name="postCode"
                placeholder="Type a 6 digit post code"
                value={formData.postCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.postCode}
                type="text"
                required
              />
              <p className="text-xs text-gray-600 mb-4">
                Only your 6 numbers code, nothing else :)
              </p>

              <Input
                label="🌆 Town / City"
                name="townCity"
                placeholder="Enter your town or city"
                value={formData.townCity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.townCity}
                required
              />

              <div className="mb-3 md:mb-4">
                <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2">
                  🚩 Your State / Region? <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.stateRegion}
                  onValueChange={(value) => handleSelectChange("stateRegion", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your state/region" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stateRegion && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.stateRegion}</p>}
              </div>
            </div>

            {/* Email */}
            <Input
              label="📧 Your Email?"
              name="email"
              placeholder="xyz@gmail.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              type="email"
              required
            />

            {/* School Name */}
            <Input
              label="🏫 School Name (OR Coaching Name)?"
              name="schoolName"
              placeholder="St Johns Senior Secondary School, Lucknow"
              value={formData.schoolName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.schoolName}
              required
            />

            {/* Classes */}
            <div className="mb-3 md:mb-4">
              <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-2 md:mb-3">
                👩‍🏫 Which Class do you teach now? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {classOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={formData.classes.includes(option.value)}
                      onChange={(checked) => handleCheckboxChange("classes", option.value, checked)}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.classes && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.classes}</p>}
            </div>

            {/* Medium */}
            <div className="mb-3 md:mb-4">
              <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-1 md:mb-2">
                🏢 Do you teach in a हिंदी or English medium school? <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.medium}
                onValueChange={(value) => handleSelectChange("medium", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the medium" />
                </SelectTrigger>
                <SelectContent>
                  {mediumOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.medium && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.medium}</p>}
            </div>

            {/* Subjects */}
            <div className="mb-3 md:mb-4">
              <label className="block text-gray-700 text-xs md:text-sm font-semibold mb-2 md:mb-3">
                👨‍🏫 Which SUBJECT(s) do you Teach? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-3">
                IMPORTANT : PLEASE pick your MAIN SUBJECTS ONLY for Class 9-12. For example: If you teach SCIENCE in Class 10 and PHYSICS in Class 12, then pick 'Science' and 'Physics' only.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                {subjectOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={formData.subjects.includes(option.value)}
                      onChange={(checked) => handleCheckboxChange("subjects", option.value, checked)}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.subjects && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.subjects}</p>}
            </div>

            {/* Additional Request */}
            <TextArea
              label="🗒️ Anything else you want to request or ask us?"
              name="additionalRequest"
              placeholder="Write any extra requirement you have like any other subject book you need or something else you want to tell us? Can I share this link with my colleagues? (yes you can btw!!)"
              value={formData.additionalRequest}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.additionalRequest}
            />

            {/* Teacher ID Card */}
            <FileInput
              label="🆔 Finally! Please Upload your Teacher ID Card."
              name="teacherIdCard"
              onChange={handleFileChange}
              error={errors.teacherIdCard}
              required
            />

            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Processing...
                </>
              ) : (
                <>
                  Submit Request
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SpecimenPage;
