import nodemailer from "nodemailer";
import moment from "moment";

export const sendDashboardReport = async (req, res) => {
  try {
    const { reportDate, imageData } = req.body;

    if (!reportDate || !imageData) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Received reportDate:", reportDate);

    const today = reportDate;

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email setup
    const mailOptions = {
      from: `<${process.env.EMAIL_USER}>`,
      to: ["vs.ml.infomap@gmail.com", "dy9530@gmail.com"],
      subject: ` Team Work Report: ${today}`,
      html: `
        <img src="cid:reportImage" style="max-width:500px;border:1px solid #ccc;border-radius:8px;"/>
      `,
      attachments: [
        {
          filename: `"ML"  Project_Report_${today}.png`,
          content: imageData.split("base64,")[1],
          encoding: "base64",
          cid: "reportImage",
        },
        {
          filename: `Project_Report_${today}.png`,
          content: imageData.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.status(200).json({
      message: "Dashboard report emailed successfully!",
      date: today,
    });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
