const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("== ENV CHECK ==");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendBookingConfirmation = async (toEmail, bookingInfo) => {
  const mailOptions = {
    from: `"BookingCare Clone" <${process.env.EMAIL_USER}>`,
    to: "xuanhuan921@gmail.com",
    subject: "Xác nhận lịch hẹn khám bệnh",
    html: `
      <h3>Xin chào ${bookingInfo.firstname} ${bookingInfo.lastname},</h3>
      <p>Bạn đã đặt lịch khám thành công với bác sĩ <strong>${bookingInfo.doctorName}</strong>.</p>
      <p><strong>Thời gian:</strong> ${bookingInfo.date} (${bookingInfo.timeType})</p>
      <p><strong>Triệu chứng:</strong> ${bookingInfo.symptomDescription}</p>
      <br/>
      <p>Trân trọng,</p>
      <p>Hệ thống BookingCare Clone</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
