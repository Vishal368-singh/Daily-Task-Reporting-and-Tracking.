import cron from "node-cron";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const REPORT_URL = "http://localhost:5173/admin/report?capture=true";

const sendAutoDashboardReport = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const imagePath = path.resolve(`./Project_Report_${today}.png`);

    console.log("📊 Generating dashboard report for:", today);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Increase viewport so full report fits
    await page.setViewport({ width: 1920, height: 1080 });

    // Go to report URL
    await page.goto(REPORT_URL, { waitUntil: "networkidle2" });

    // Wait for the container
    await page.waitForSelector("#report-capture", {
      visible: true,
      timeout: 90000,
    });

    // Wait for charts inside the report to render
    await page.waitForFunction(
      () => {
        const chart = document.querySelector(".recharts-wrapper");
        return chart && chart.clientHeight > 0;
      },
      { timeout: 90000 }
    );

    // Small additional delay to ensure full render
    await new Promise((resolve) => setTimeout(resolve, 15000));

    // Capture screenshot
    const reportElement = await page.$("#report-capture");

    await page.evaluate((el) => {
      el.style.padding = "20px";
    }, reportElement);

    await reportElement.screenshot({ path: imagePath, type: "png" });

    await browser.close();
    console.log(" Report captured successfully:", imagePath);

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Auto Analysis Report" <${process.env.EMAIL_USER}>`,
      to: ["Receivers Mail IDs"],
      subject: `Team Work Report - ${today}`,
      html: `
          <p>Hi Team,</p>
          <p>Please find attached the daily dashboard report for <b>${today}</b>.</p>
          <p>Regards,<br/>Automated TaskSheet Bot</p>
        `,
      attachments: [
        { filename: `Project_Report_${today}.png`, path: imagePath },
      ],
    });

    console.log(" Auto dashboard report emailed successfully!");

    fs.unlinkSync(imagePath); // cleanup
    console.log(" Temporary report file deleted.");
  } catch (error) {
    console.error(" Auto report send error:", error);
  }
};

//  Schedule daily at 7:00 PM IST (19:00 => 13:30 UTC)
cron.schedule("18 16 * * *", () => {
  console.log("⏰ Running scheduled report job at 7:00 PM IST...");
  sendAutoDashboardReport();
});
