// import React, { useState, useEffect } from "react";
// import s from './styles.module.scss';

// export default function MatrimonialPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     address: "",
//     gender: "",
//     dob: "",
//     gotra: "",
//     district_city: "",
//     education: "",
//     jobProfile: "",
//     income: "",
//     maritalStatus: "",
//     fatherName: "",
//     fatherProfession: "",
//     motherName: "",
//     motherProfession: "",
//     contact: "",
//     photo: null,
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false); // New loading state

//   useEffect(() => {
//     document.title = 'Matrimonial | BCN';
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === "file") {
//       setFormData({
//         ...formData,
//         [name]: files[0],
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const uploadPhoto = async (file) => {
//     const formData = new FormData();
//     formData.append('photo', file); // Use the file directly from state
  
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_HOST}/public/matrimonialPage/upload-pdf`, {
//         method: "POST",
//         body: formData,
//       });
  
//       const textResponse = await response.text(); // Read response as text
//       console.log("Response from server:", textResponse);
  
//       if (!response.ok) {
//         throw new Error("Photo upload failed");
//       }
  
//       // If the response is plain text, return it directly or handle accordingly
//       return textResponse; // This is the "File uploaded successfully" message
  
//     } catch (error) {
//       console.error("Error uploading photo:", error);
//       setErrorMessage("Failed to upload photo. Please try again.");
//       throw error;
//     }
//   };
    

  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setLoading(true); // Set loading to true when starting the form submission
  
//     try {
//       // Format the date of birth (dob) to 'YYYY-MM-DD' before appending it
//       const formattedDob = new Date(formData.dob).toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
  
//       let photoUrl = null;
//       if (formData.photo) {
//         // Upload the photo if it exists
//         photoUrl = await uploadPhoto(formData.photo);
//         console.log("Photo upload response:", photoUrl); // This should be the success message
//       }
  
//       const registrationData = new FormData();
//       for (const key in formData) {
//         if (formData[key] !== null && key !== "photo") {
//           // If the field is not null and is not the photo, append it
//           registrationData.append(key, formData[key]);
//         }
//       }
  
//       // Append formatted dob to registrationData
//       registrationData.append("dob", formattedDob);
  
//       // Append the uploaded photo URL if it was successfully uploaded
//       if (photoUrl) {
//         registrationData.append("photoUrl", photoUrl); // Attach photo URL if uploaded
//       }
  
//       // Log FormData to inspect before submission
//       for (let [key, value] of registrationData.entries()) {
//         console.log(`${key}: ${value}`);
//       }
  
//       // Submit the form
//       const response = await fetch(`${process.env.REACT_APP_API_HOST}/public/matrimonialPage/save`, {
//         method: "POST",
//         body: registrationData,
//       });
  
//       const responseData = await response.json(); // Parse the response body
//       console.log("Response from server:", responseData);
  
//       // Check if the response is OK, otherwise throw an error
//       if (!response.ok) {
//         throw new Error(responseData.message || "Submission failed");
//       }
  
//       // If submission is successful
//       setSubmitted(true);
//       setLoading(false); // Stop loading when submission is complete
//     } catch (error) {
//       // Handle errors gracefully
//       console.error("Error submitting form:", error);
//       setErrorMessage("Something went wrong. Please try again.");
//       setLoading(false); // Stop loading in case of error
//     }
//   };
  
  
//   return (
//     <div className={s.main}>
//       <div className={s.form}>
//         <h2 className={s.title}>Matrimonial Registration</h2>
//         {submitted ? (
//           <div className={s.thankYou}>
//             Thank you, {formData.name}, for registering!
//           </div>
//         ) : (
//           <form className={s.form} onSubmit={handleSubmit}>
//             <label htmlFor="name">Name:</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="contact">Contact:</label>
//             <input
//               type="tel"
//               id="contact"
//               name="contact"
//               value={formData.contact}
//               onChange={handleChange}
//               pattern="[0-9]{10}"
//               placeholder="10-digit number"
//               required
//             />
//             <label htmlFor="gender">Gender:</label>
//             <select
//               id="gender"
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//             <label htmlFor="dob">Date of Birth:</label>
//             <input
//               type="date"
//               id="dob"
//               name="dob"
//               value={formData.dob}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="gotra">Gotra:</label>
//             <input
//               type="text"
//               id="gotra"
//               name="gotra"
//               value={formData.gotra}
//               onChange={handleChange}
//             />

//             <label htmlFor="district_city">District/City:</label>
//             <select
//               id="district_city"
//               name="district_city"
//               value={formData.district_city}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select District/City</option>
//               <option value="Noida">Noida</option>
//               <option value="Ghaziabad">Ghaziabad</option>
//               <option value="Delhi">Delhi</option>
//               <option value="Haryana">Haryana</option>
//               <option value="Other">Other</option>
//             </select>

//             <label htmlFor="education">Education:</label>
//             <select
//               id="education"
//               name="education"
//               value={formData.education}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Education</option>
//               <option value="Post Graduate">Post Graduate</option>
//               <option value="Under Graduate">Under Graduate</option>
//               <option value="Intermediate">Intermediate</option>
//             </select>

//             <label htmlFor="jobProfile">Job Profile:</label>
//             <input
//               type="text"
//               id="jobProfile"
//               name="jobProfile"
//               value={formData.jobProfile}
//               onChange={handleChange}
//             />

//             <label htmlFor="income">Income:</label>
//             <input
//               type="text"
//               id="income"
//               name="income"
//               value={formData.income}
//               onChange={handleChange}
//             />

//             <label htmlFor="maritalStatus">Marital Status:</label>
//             <select
//               id="maritalStatus"
//               name="maritalStatus"
//               value={formData.maritalStatus}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Marital Status</option>
//               <option value="Single">Single</option>
//               <option value="Divorced">Divorced</option>
//               <option value="Widowed">Widowed</option>
//             </select>

//             <label htmlFor="fatherName">Father's Name:</label>
//             <input
//               type="text"
//               id="fatherName"
//               name="fatherName"
//               value={formData.fatherName}
//               onChange={handleChange}
//               required
//             />

//             <label htmlFor="fatherProfession">Father's Profession:</label>
//             <select
//               id="fatherProfession"
//               name="fatherProfession"
//               value={formData.fatherProfession}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Profession</option>
//               <option value="Government Employee">Government Employee</option>
//               <option value="Private Sector">Private Sector</option>
//               <option value="Other">Other</option>
//             </select>

//             <label htmlFor="motherName">Mother's Name:</label>
//             <input
//               type="text"
//               id="motherName"
//               name="motherName"
//               value={formData.motherName}
//               onChange={handleChange}
//               required
//             />

//             <label htmlFor="motherProfession">Mother's Profession:</label>
//             <select
//               id="motherProfession"
//               name="motherProfession"
//               value={formData.motherProfession}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Profession</option>
//               <option value="Government Employee">Government Employee</option>
//               <option value="Private Sector">Private Sector</option>
//               <option value="Other">Other</option>
//             </select>

//             <label htmlFor="photo">Upload Photo:</label>
//             <input
//               type="file"
//               id="photo"
//               name="photo"
//               accept="image/*"
//               onChange={handleChange}
//               required
//             />
//             <button type="submit" disabled={loading}>
//               {loading ? "Submitting..." : "Register"}
//             </button>
//             {errorMessage && <p className={s.error}>{errorMessage}</p>}
//           </form>
//         )}
//       </div>
//       <div className={s.imageSection}>
//         <img
//           src="https://images.unsplash.com/photo-1628834556809-fd4d8acad67c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//           alt="Matrimonial Form"
//         />
//       </div>
//     </div>
//   );
// }
 
/*import React, { useState, useEffect } from "react";
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

 /* const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      /*if (name === "dob") {
        // Ensure dob is a string and not an array
        value = value ? value.split('T')[0] : ""; // Ensure we are not passing an array
      }*/
      /*setFormData({
        ...formData,
        [name]: type === "file" ? files[0] : value,
      });
    }
  /*};*/
  /*const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/public/matrimonialPage/upload-pdf`, {
        method: "POST",
        body: formData,
      });
      console.log("Upload API Response Status:", response.status)

      const contentType = response.headers.get("Content-Type");
      let responseData;
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
      console.log("Upload Response Data:", responseData);
    } else {
      const textResponse = await response.text();
      console.log("Non-JSON Response:", textResponse);
      throw new Error("Unexpected response format from the server");
    }
      /*const textResponse = await response.text();
      console.log("Response from server:", textResponse);*/

      /*if (!response.ok) {
        throw new Error("Photo upload failed");
      }*/

      //const data = await WriteGetObjectResponseCommand.json();
      //console.log("Upload Responce data:", data);
      /*const data = JSON.parse(textResponse); // Parse response correctly
      console.log("Upload Response data:", data);

      if(!data || !data.url){
        throw new Error("URL Missing");
      }*/
      //return data.url;
     
    /*} catch (error) {
      console.error("Error uploading photo:", error);
      setErrorMessage("Failed to upload photo. Please try again.");
      throw error;
    }*/
      /*if (!response.ok) {
        throw new Error(responseData.message || "Photo upload failed");
      }
  
      // Check if the URL is present in the response data
      if (!responseData || !responseData.url) {
        throw new Error("URL Missing in the response");
      }
  
      return responseData.url;
  
    } catch (error) {
      console.error("Error uploading photo:", error);
      setErrorMessage("Failed to upload photo. Please try again.");
      throw error;
    }
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
  
    if (!formData.dob) {
      setErrorMessage("Please select a valid date of birth.");
      setLoading(false);
      return;
    }
  
    try {
      const formattedDob = new Date(formData.dob).toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
  
      // Check if dob is valid (not NaN)
      if (isNaN(new Date(formattedDob))) {
        setErrorMessage("Invalid date format.");
        setLoading(false);
        return;
      }
  
      // Calculate age from dob
      const age = new Date().getFullYear() - new Date(formattedDob).getFullYear();
  
      let photoUrl = null;
      if (formData.photo) {
        // Upload the photo if it exists
        photoUrl = await uploadPhoto(formData.photo);
      }
  
      const registrationData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && key !== "photo") {
          registrationData.append(key, formData[key]);
        }
      }
  
      // Append formatted dob and age to registrationData
      registrationData.append("dob", formattedDob);
      registrationData.append("age", age);  // Append calculated age
  
      if (photoUrl) {
        registrationData.append("photoUrl", photoUrl);
      }
  
      // Submit the form
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/public/matrimonialPage/save`, {
        method: "POST",
        body: registrationData,
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }
  
      setSubmitted(true);
      setLoading(false); // Stop loading when submission is complete
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  };*/
  /*const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
  
    if (!formData.dob) {
      setErrorMessage("Please select a valid date of birth.");
      setLoading(false);
      return;
    }
  
    try {
      const dob = new Date(formData.dob);
      if (isNaN(dob.getTime())) {
        setErrorMessage("Invalid date format.");
        setLoading(false);
        return;
      }
  
      // Calculate precise age
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() - 
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
  
      let photoUrl = null;
      if (formData.photo) {
        try {
          photoUrl = await uploadPhoto(formData.photo);
        } catch (uploadError) {
          console.error("Error uploading photo:", uploadError);
          setErrorMessage("Photo upload failed. Please try again.");
          setLoading(false);
          return;
        }
      }
      if (!photoUrl) {
        setErrorMessage("Photo upload failed. Unable to save the form without a photo.");
        setLoading(false);
        return;
      }
      registrationData.append("photoUrl", photoUrl);
  
      const registrationData = new FormData();
      /*for (const key in formData) {
        if (formData[key] !== null && key !== "photo") {
          registrationData.append(key, formData[key]);
        }
      }*/
       /* Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && key !== "photo") {
            registrationData.append(key, value);
          }
        });
        
        console.log("FormData being sent to /save:");
for (let [key, value] of registrationData.entries()) {
  console.log(`${key}: ${value}`);
}

      //registrationData.append("dob", dob.toISOString().split("T")[0]); // Format as 'YYYY-MM-DD'
      registrationData.append("dob", formData.dob); 
      registrationData.append("age", age);
      registrationData.append("photoUrl", photoUrl);
  
      if (photoUrl) {
        registrationData.append("photoUrl", photoUrl);
      }
      console.log("FormData being sent:");
      for (let [key, value] of registrationData.entries()) {
        console.log(`${key}: ${value}`);
      }
      // Submit the form
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/public/matrimonialPage/save`, {
        method: "POST",
        body: registrationData,
      });
  
     /* const responseData = await response.json();
      console.log("Save API Response:", responseData);
      if (!response.ok) {
        console.error("Response error:", responseData);
        throw new Error(responseData.message || "Submission failed");
      }
  
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }*/
     /* console.log("Save API Response Status:", response.status);
    
      const contentType = response.headers.get("Content-Type");
      let responseData;
  
      // Check if the response is JSON
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log("Save API Response Data:", responseData);
      }else if (contentType && contentType.includes("text/plain")) {
        // Handle the case where the response is plain text
        const textResponse = await response.text();
        console.log("Non-JSON Response:", textResponse);
        // In this case, if the response indicates success, return a photo URL or success message
        if (textResponse === "File uploaded successfully") {
          return "path_to_uploaded_file_or_photo_url"; // You can adjust based on your API logic
        } else {
          throw new Error("Unexpected response format from the server");
        }
      } else {
        throw new Error("Unexpected response format from the server");
      }
  
      // If photo URL is returned, return it
      if (!responseData || !responseData.url) {
        throw new Error("URL Missing in response");
      }
  
      return responseData.url;
  
    } catch (error) {
      console.error("Error uploading photo:", error);
      setErrorMessage("Failed to upload photo. Please try again.");
      throw error;
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
              <option value="single">Single</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
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
              <option value="Housewife">Housewife</option>
              <option value="Working">Working</option>
            </select>

            <label htmlFor="photo">Upload Photo:</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleChange}
              accept="image/*"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>

            {errorMessage && <div className={s.error}>{errorMessage}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

*/

// Updated form added new fileds 
import React, { useState } from "react";
import styles from './styles.module.scss'; // Import SCSS module

function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    gotra: "",
    maritalStatus: "",
    height: "",
    weight: "",
    complexion: "",
    address: "",
    city: "",
    customCity: "",
    state: "",
    pinCode: "",
    mobileNumber: "",
    email: "",
    socialMediaHandle: "",
    qualification: "",
    stream: "",
    specialisation: "",
    occupation: "",
    familyStatus: "",
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    siblingsBrothers: "",
    siblingsSisters: "",
    employerName: "",
    employerDesignation: "",
    annualIncome: "",
    photo: null,
    cv: null,
    declaration: false,
  });

  const [dynamicFields, setDynamicFields] = useState({
    streamOptions: [],
    specialisationField: false,
    occupationOptions: [],
  });

  const IndianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", 
    "Delhi", "Puducherry"
  ];

  const cities = [
    "Delhi", "Lucknow", "Mumbai", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Ahmedabad", "Jaipur", "Pune", "Chandigarh", "Indore", 
    "Surat", "Vadodara", "Patna"
  ];
  

  const qualificationOptions = [
    "Secondary/Class 10",
    "Higher Secondary/Class 12",
    "Diploma/Certificate Course",
    "Vocational Training",
    "Graduation Degrees",
    "Postgraduate Degrees",
    "Doctorate (Ph.D)",
    "Post-Doctoral Research",
    "Other Qualifications",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleQualificationChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, qualification: value });

    switch (value) {
      case "Higher Secondary/Class 12":
        setDynamicFields({ ...dynamicFields, streamOptions: ["Science", "Arts", "Commerce"], specialisationField: false });
        break;
      case "Diploma/Certificate Course":
        setDynamicFields({ ...dynamicFields, streamOptions: [], specialisationField: true });
        break;
      case "Graduation Degrees":
        setDynamicFields({ ...dynamicFields, streamOptions: [], specialisationField: false });
        break;
      case "Postgraduate Degrees":
        setDynamicFields({ ...dynamicFields, streamOptions: [], specialisationField: false });
        break;
      case "Other Qualifications":
        setDynamicFields({ ...dynamicFields, streamOptions: [], specialisationField: true });
        break;
      default:
        setDynamicFields({ ...dynamicFields, streamOptions: [], specialisationField: false });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.declaration) {
      alert("Form Submitted Successfully!");
      console.log(formData);
    } else {
      alert("Please agree to the terms and conditions.");
    }
  };
  return (
    <div className={styles.registrationForm}>
      <div className={styles.leftSide}>
       <div class="leftSide"></div>
      <h2>Matrimonial Registration Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <label>Full Name:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={styles.underlinedInput} />

        <label>Date of Birth:</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className={styles.underlinedInput} />

        <label>Gender:</label>
        <div className={styles.checkboxGroup}>
          <label>
            <input type="radio" name="gender" value="Male" onChange={handleChange} checked={formData.gender === "Male"} />
            Male
          </label>
          <label>
            <input type="radio" name="gender" value="Female" onChange={handleChange} checked={formData.gender === "Female"} />
            Female
          </label>
          <label>
            <input type="radio" name="gender" value="Other" onChange={handleChange} checked={formData.gender === "Other"} />
            Other
          </label>
        </div>

        <label>Gotra:</label>
        <input type="text" name="gotra" value={formData.gotra} onChange={handleChange} className={styles.underlinedInput} />

        <label>Marital Status:</label>
        <div className={styles.checkboxGroup}>
          <label>
            <input type="radio" name="maritalStatus" value="Unmarried" onChange={handleChange} checked={formData.maritalStatus === "Unmarried"} />
            Unmarried
          </label>
          <label>
            <input type="radio" name="maritalStatus" value="Divorced" onChange={handleChange} checked={formData.maritalStatus === "Divorced"} />
            Divorced
          </label>
          <label>
            <input type="radio" name="maritalStatus" value="Widowed" onChange={handleChange} checked={formData.maritalStatus === "Widowed"} />
            Widowed
          </label>
          <label>
            <input type="radio" name="maritalStatus" value="Separated" onChange={handleChange} checked={formData.maritalStatus === "Separated"} />
            Separated
          </label>
        </div>

        {/* Physical Attributes */}
        <label>Height:</label>
        <input type="text" name="height" value={formData.height} onChange={handleChange} className={styles.underlinedInput} />

        <label>Weight:</label>
        <input type="text" name="weight" value={formData.weight} onChange={handleChange} className={styles.underlinedInput} />

        <label>Complexion:</label>
        <div className={styles.checkboxGroup}>
          <label>
            <input type="radio" name="complexion" value="Fair" onChange={handleChange} checked={formData.complexion === "Fair"} />
            Fair
          </label>
          <label>
            <input type="radio" name="complexion" value="Wheatish" onChange={handleChange} checked={formData.complexion === "Wheatish"} />
            Wheatish
          </label>
          <label>
            <input type="radio" name="complexion" value="Dark" onChange={handleChange} checked={formData.complexion === "Dark"} />
            Dark
          </label>
        </div>

        {/* Contact Information */}
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} className={styles.underlinedInput} />

        <label>State:</label>
        <select name="state" value={formData.state} onChange={handleChange} required>
           <option value="">Select State</option>
            {IndianStates.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          {/* Add the states as per your requirement */}
        </select>

        <label>City:</label>
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className={styles.underlinedInput}
        >
          <option value="">Select a city</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
          <option value="Other">Other (Please specify)</option>
        </select>

        {formData.city === "Other" && (
          <input
            type="text"
            name="customCity"
            value={formData.customCity}
            onChange={handleChange}
            placeholder="Enter your city"
            className={styles.underlinedInput}
            required
          />
        )}
        

        <label>Pin Code:</label>
        <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} pattern="\d{6}" required className={styles.underlinedInput} />

        <label>Mobile Number:</label>
        <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} pattern="\d{10}" required className={styles.underlinedInput} />

        <label>Email ID:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={styles.underlinedInput} />

        <label>Social Media Handle:</label>
        <input type="text" name="socialMediaHandle" value={formData.socialMediaHandle} onChange={handleChange} className={styles.underlinedInput} />

        {/* Educational & Professional Details */}
        <label>Highest Qualification:</label>
        <select name="qualification" value={formData.qualification} onChange={handleQualificationChange} required>
          <option value="">Select Qualification</option>
          {qualificationOptions.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>

        {dynamicFields.specialisationField && (
          <>
            <label>Specialisation:</label>
            <input type="text" name="specialisation" value={formData.specialisation} onChange={handleChange} className={styles.underlinedInput} />
          </>
        )}

        {dynamicFields.streamOptions.length > 0 && (
          <>
            <label>Stream/Subject:</label>
            <select name="stream" value={formData.stream} onChange={handleChange} required>
              <option value="">Select Stream</option>
              {dynamicFields.streamOptions.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </>
        )}

        {/* Occupation */}
        <label>Occupation:</label>
        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className={styles.underlinedInput} />

        {/* Family Information */}
        <label>Father's Name:</label>
        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className={styles.underlinedInput} />

        <label>Father's Occupation:</label>
        <select name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} required>
          <option value="">Select Occupation</option>
          <option value="Private Employment">Private Employment</option>
          <option value="Public Sector/Government">Public Sector/Government</option>
          <option value="Business">Business</option>
          <option value="Self-employed/Freelancer">Self-employed/Freelancer</option>
          <option value="Agriculture & Farming">Agriculture & Farming</option>
          <option value="Social Work">Social Work</option>
          <option value="Politician">Politician</option>
          <option value="Others">Others</option>
        </select>

        <label>Mother's Name:</label>
        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className={styles.underlinedInput} />

        <label>Mother's Occupation:</label>
        <select name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} required>
          <option value="">Select Occupation</option>
          <option value="Private Employment">Private Employment</option>
          <option value="Public Sector/Government">Public Sector/Government</option>
          <option value="Business">Business</option>
          <option value="Self-employed/Freelancer">Self-employed/Freelancer</option>
          <option value="Agriculture & Farming">Agriculture & Farming</option>
          <option value="Social Work">Social Work</option>
          <option value="Politician">Politician</option>
          <option value="Homemaker">Homemaker</option>
          <option value="Others">Others</option>
        </select>

        <label>Number of Siblings (Brothers):</label>
        <input type="number" name="siblingsBrothers" value={formData.siblingsBrothers} onChange={handleChange} className={styles.underlinedInput} min="0" />

        <label>Number of Siblings (Sisters):</label>
        <input type="number" name="siblingsSisters" value={formData.siblingsSisters} onChange={handleChange} className={styles.underlinedInput} min="0" />

        {/* Occupation of Family Members */}
        <label>Annual Income:</label>
        <input type="text" name="annualIncome" value={formData.annualIncome} onChange={handleChange} className={styles.underlinedInput} />

        {/* Personal Information Upload */}
        <label>Photo of Candidate:</label>
        <input type="file" name="photo" onChange={handleFileChange} accept="image/*" required />

        <label>CV of Candidate:</label>
        <input type="file" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />

        {/* Declaration */}
        <label>
          <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleCheckboxChange} required />
          I hereby declare that the information provided above is true to the best of my knowledge and I agree to share the given information with BCN portal and its users.
        </label>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
    <div className={styles.rightSide}>
        <img 
          src="https://images.unsplash.com/photo-1628834556809-fd4d8acad67c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background"
          className={styles.backgroundImage}
        />
      </div>
    </div>
  );
}

export default App;






