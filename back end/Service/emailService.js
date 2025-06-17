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
  console.log("📨 Sending booking confirmation to:", toEmail);
  const mailOptions = {
    from: `"BookingCare" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Xác nhận lịch hẹn khám bệnh",
    html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    <h2 style="color: #2a8fd4;">Xác nhận đặt lịch khám thành công</h2>
    <p>Xin chào <strong>${bookingInfo.firstname} ${
      bookingInfo.lastname
    }</strong>,</p>

    <p>Bạn đã đặt lịch khám với thông tin như sau:</p>

    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 8px; font-weight: bold;">👨‍⚕️ Bác sĩ</td>
        <td style="padding: 8px;">${bookingInfo.doctorName}</td>
      </tr>
      <tr style="background-color: #f5f5f5;">
        <td style="padding: 8px; font-weight: bold;">🏥 Phòng khám</td>
        <td style="padding: 8px;">${bookingInfo.nameClinic}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">📍 Địa chỉ</td>
        <td style="padding: 8px;">${bookingInfo.addressClinic}</td>
      </tr>
      <tr style="background-color: #f5f5f5;">
        <td style="padding: 8px; font-weight: bold;">🗓️ Ngày khám</td>
        <td style="padding: 8px;">${bookingInfo.date}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">💬 Triệu chứng</td>
        <td style="padding: 8px;">${
          bookingInfo.symptomDescription || "Không có mô tả"
        }</td>
      </tr>
    </table>

    <p>Vui lòng đến đúng giờ và mang theo các giấy tờ cần thiết (nếu có). Nếu bạn cần hỗ trợ hoặc thay đổi lịch hẹn, hãy liên hệ với chúng tôi qua email này.</p>

    <p style="margin-top: 30px;">Trân trọng,</p>
    <p><strong>Hệ thống BookingCare</strong></p>
    <hr style="margin-top: 40px;" />
    <p style="font-size: 12px; color: #777;">Đây là email tự động, vui lòng không trả lời lại.</p>
  </div>
`,
  };

  await transporter.sendMail(mailOptions);
};
