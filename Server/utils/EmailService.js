const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.service,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  port: process.env.EMAIL_PORT,
  host: process.env.HOST,
  secure: process.env.SECURE === 'true',  // Ensure secure is boolean
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,  // Replacing text with html
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email', err);
  }
};

exports.sendVerificationEmail = async (email, verificationUrl) => {
  const htmlContent = generateEmailVerificationTemplate(verificationUrl);
  await sendEmail(email, 'Email Verification', htmlContent);
};

exports.sendOtpEmail = async (email, otpCode) => {
  const htmlContent = generateOtpTemplate(otpCode);
  await sendEmail(email, 'Your OTP Code', htmlContent);
};



const generateEmailVerificationTemplate = (verificationUrl) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f7f7f7; padding: 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
      <tr>
        <td align="center" bgcolor="#d3a4c9" style="padding: 40px 0;">
          <img src="https://example.com/logo.png" alt="Logo" width="200" height="80" style="display: block;" />
        </td>
      </tr>
      <tr>
        <td bgcolor="#ffffff" style="padding: 40px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="text-align: center;">
                <h1 style="font-size: 24px; color: #333333;">Verify Your Email</h1>
                <p style="font-size: 16px; color: #666666; line-height: 24px;">
                  Thank you for joining our platform! Please verify your email by clicking the button below.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; padding: 12px 25px; background-color: #d3a4c9; color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px;">
                  Verify Email
                </a>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 20px; font-size: 14px; color: #999999;">
                <p>If you didn't create this account, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td bgcolor="#f7f7f7" style="padding: 20px; text-align: center; font-size: 14px; color: #999999;">
          &copy; 2024 Your Company. All Rights Reserved.
        </td>
      </tr>
    </table>
  </div>
`;

const generateOtpTemplate = (otpCode) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f7f7f7; padding: 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
      <tr>
        <td align="center" bgcolor="#d3a4c9" style="padding: 40px 0;">
          <img src="https://example.com/logo.png" alt="Logo" width="200" height="80" style="display: block;" />
        </td>
      </tr>
      <tr>
        <td bgcolor="#ffffff" style="padding: 40px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="text-align: center;">
                <h1 style="font-size: 24px; color: #333333;">Your OTP Code</h1>
                <p style="font-size: 16px; color: #666666; line-height: 24px;">
                  Use the code below to complete your verification. It will expire in 5 minutes.
                </p>
                <h2 style="font-size: 36px; color: #d3a4c9; text-align: center; margin: 20px 0;">${otpCode}</h2>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td bgcolor="#f7f7f7" style="padding: 20px; text-align: center; font-size: 14px; color: #999999;">
          &copy; 2024 Your Company. All Rights Reserved.
        </td>
      </tr>
    </table>
  </div>
`;
