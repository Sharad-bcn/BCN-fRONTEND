import React, { useState, useEffect } from "react";
import s from './styles.module.scss';

export default function MatrimonialPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    gender: "",
    dob: "",
    gotra: "",
    district_city: "",
    education: "",
    jobProfile: "",
    income: "",
    maritalStatus: "",
    fatherName: "",
    fatherProfession: "",
    motherName: "",
    motherProfession: "",
    contact: "",
    photo: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    document.title = 'Matrimonial | BCN';
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Changed from "pdf" to "file" for image upload

    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/matrimonial/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Photo upload failed");
      }

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error("Error uploading photo:", error);
      setErrorMessage("Failed to upload photo. Please try again.");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true); // Set loading to true when starting the form submission

    try {
      let photoUrl = null;
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo); // Upload photo first
      }

      const registrationData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && key !== "photo") {
          registrationData.append(key, formData[key]);
        }
      }

      if (photoUrl) {
        registrationData.append("photoUrl", photoUrl); // Attach photo URL if uploaded
      }

      const response = await fetch(`${process.env.REACT_APP_API_HOST}/matrimonial/save`, {
        method: "POST",
        body: registrationData,
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
      setLoading(false); // Stop loading when submission is complete
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setLoading(false); // Stop loading in case of error
    }
  };

  return (
    <div className={s.main}>
      <div className={s.form}>
        <h2 className={s.title}>Matrimonial Registration</h2>
        {submitted ? (
          <div className={s.thankYou}>
            Thank you, {formData.name}, for registering!
          </div>
        ) : (
          <form className={s.form} onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="contact">Contact:</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              pattern="[0-9]{10}"
              placeholder="10-digit number"
              required
            />
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <label htmlFor="gotra">Gotra:</label>
            <input
              type="text"
              id="gotra"
              name="gotra"
              value={formData.gotra}
              onChange={handleChange}
            />

            <label htmlFor="district_city">District/City:</label>
            <select
              id="district_city"
              name="district_city"
              value={formData.district_city}
              onChange={handleChange}
              required
            >
              <option value="">Select District/City</option>
              <option value="Noida">Noida</option>
              <option value="Ghaziabad">Ghaziabad</option>
              <option value="Delhi">Delhi</option>
              <option value="Haryana">Haryana</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="education">Education:</label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
            >
              <option value="">Select Education</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Under Graduate">Under Graduate</option>
              <option value="Intermediate">Intermediate</option>
            </select>

            <label htmlFor="jobProfile">Job Profile:</label>
            <input
              type="text"
              id="jobProfile"
              name="jobProfile"
              value={formData.jobProfile}
              onChange={handleChange}
            />

            <label htmlFor="income">Income:</label>
            <input
              type="text"
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
            />

            <label htmlFor="maritalStatus">Marital Status:</label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>

            <label htmlFor="fatherName">Father's Name:</label>
            <input
              type="text"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
            />

            <label htmlFor="fatherProfession">Father's Profession:</label>
            <select
              id="fatherProfession"
              name="fatherProfession"
              value={formData.fatherProfession}
              onChange={handleChange}
              required
            >
              <option value="">Select Profession</option>
              <option value="Government Employee">Government Employee</option>
              <option value="Private Sector">Private Sector</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="motherName">Mother's Name:</label>
            <input
              type="text"
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              required
            />

            <label htmlFor="motherProfession">Mother's Profession:</label>
            <select
              id="motherProfession"
              name="motherProfession"
              value={formData.motherProfession}
              onChange={handleChange}
              required
            >
              <option value="">Select Profession</option>
              <option value="Government Employee">Government Employee</option>
              <option value="Private Sector">Private Sector</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="photo">Upload Photo:</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Register"}
            </button>
            {errorMessage && <p className={s.error}>{errorMessage}</p>}
          </form>
        )}
      </div>
      <div className={s.imageSection}>
        <img
          src="https://images.unsplash.com/photo-1628834556809-fd4d8acad67c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Matrimonial Form"
        />
      </div>
    </div>
  );
}
 