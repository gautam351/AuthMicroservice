
const sgMail =require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const SendMail=async(recepeint:string,subject:string,htmlText:string)=>{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: recepeint, // Change to your recipient
      from: 'gautampraveen351@gmail.com', // Change to your verified sender
      subject: subject,
    //   text: text,
      html: htmlText,
    }
    await sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error:Error) => {
        console.error(error)
      })
}

const SendMailUsingSmtp=async(recepeint:string,subject:string,htmlText:string)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD, // generated ethereal password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: recepeint,
        subject: subject,
        // text: text,
        html:htmlText
        
    };

     transporter.sendMail(mailOptions);
}



exports.SendVerifyMail=async(recepeint:string,code:string)=>{

    const subject="Verify your account"
    const htmlText=`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
  <style type="text/css">
    /* General Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }

    /* Main Styles */
    .email-wrapper {
      background-color: #f4f4f7;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden; /* Ensures border radius is respected by inner elements */
      border: 1px solid #e0e0e0; /* Subtle border */
    }
    .email-header {
      background-color: #4A90E2; /* A slightly more modern blue */
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .email-body {
      padding: 30px 25px;
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
    }
    .email-body p {
      margin: 0 0 15px 0;
    }
    .verify-button-container {
      text-align: center;
      margin: 25px 0;
    }
    .verify-button {
      display: inline-block;
      padding: 12px 30px; /* Slightly more padding */
      background-color: #4CAF50; /* A common 'success' green, or use your brand color */
      color: #ffffff !important; /* Important to override link color */
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      font-size: 16px;
      border: none; /* Remove border for a cleaner look */
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow */
    }
    .email-footer {
      padding: 20px 25px;
      font-size: 13px;
      color: #777777;
      text-align: center;
      border-top: 1px solid #eeeeee;
    }
    .email-footer a {
        color: #4A90E2;
        text-decoration: none;
    }
    .content-block { /* For better spacing and structure within the body */
        padding-bottom: 10px;
    }
    .highlight {
        color: #2a7ae2;
        font-weight: bold;
    }

    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        border-radius: 0; /* Full width on mobile */
      }
      .email-wrapper {
        padding: 0;
      }
      .email-body, .email-footer, .email-header {
        padding: 20px !important;
      }
      .email-header h1 {
        font-size: 22px !important;
      }
      .verify-button {
        padding: 15px 25px !important; /* Make button easier to tap */
        font-size: 17px !important;
        width: 90% !important; /* Make button wider on mobile */
        box-sizing: border-box; /* Include padding and border in the element's total width and height */
      }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Please verify your email address to complete your account setup.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0;">
          <tr>
            <td align="center" class="email-header" style="background-color: #4A90E2; color: #ffffff; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Verify Your Account</h1>
            </td>
          </tr>

          <tr>
            <td class="email-body" style="padding: 30px 25px; font-size: 16px; line-height: 1.6; color: #333333;">
              <p style="margin: 0 0 15px 0;">Hello,</p>
              <p style="margin: 0 0 15px 0;">Thank you for signing up with <span class="highlight" style="color: #2a7ae2; font-weight: bold;">DocUSort Team</span>! We're excited to have you.</p>
              <p style="margin: 0 0 15px 0;">Please find the below code to activate your account:</p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="verify-button-container" style="text-align: center; margin: 25px 0;">
                <tr>
                  <td align="center">
                    <a href="#"  disabled class="verify-button"  style="display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${code}</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 15px 0;">This verification Code is valid for the next <strong style="color: #333333;">10 minutes</strong>.</p>
              <p style="margin: 0 0 15px 0;">If you did not request to create an account with DocUSort Team, please disregard this email. No further action is needed.</p>
              <p style="margin: 0 0 15px 0;">Thanks,<br>The DocUSort Team</p>
            </td>
          </tr>

          <tr>
            <td class="email-footer" style="padding: 20px 25px; font-size: 13px; color: #777777; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 10px 0;">You're receiving this email because you registered on our platform.</p>
              <p style="margin: 0 0 10px 0;">DocUSort Team </p>
              <p style="margin: 0;">
                <a href="#" target="_blank" style="color: #4A90E2; text-decoration: none;">Privacy Policy</a> | <a href="#" target="_blank" style="color: #4A90E2; text-decoration: none;">Contact Support</a>
              </p>
              <p style="margin: 10px 0 0 0;">Note: This is an automated email, please do not reply directly.</p>
            </td>
          </tr>
        </table>
        </td>
    </tr>
  </table>
</body>
</html>

    
    
    `
    await SendMailUsingSmtp(recepeint,subject,htmlText);

}

exports.SendResetPasswordMail=async(recepeint:string,resetToken:string)=>{

    const subject="Reset your password"
    const htmlText=`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - DocUSort</title>
  <style type="text/css">
    /* General Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }

    /* Main Styles */
    .email-wrapper {
      background-color: #f4f4f7; /* Light grey background for the whole email body */
      padding: 20px; /* Padding around the main container */
    }
    .email-container {
      max-width: 600px; /* Max width of the email content */
      margin: 0 auto; /* Center the container */
      background-color: #ffffff; /* White background for the content area */
      border-radius: 8px; /* Rounded corners for the container */
      overflow: hidden; /* Ensures border radius is respected by inner elements */
      border: 1px solid #e0e0e0; /* Subtle border around the container */
    }
    .email-header {
      background-color: #4A90E2; /* Header background color (modern blue) */
      color: #ffffff; /* Header text color (white) */
      padding: 30px 20px; /* Padding within the header */
      text-align: center; /* Center align header content */
    }
    .email-header h1 {
      margin: 0; /* Remove default margin for h1 */
      font-size: 24px; /* Font size for the main heading */
      font-weight: bold; /* Bold font weight for the heading */
    }
    .email-body {
      padding: 30px 25px; /* Padding within the main content area */
      font-size: 16px; /* Base font size for the body text */
      line-height: 1.6; /* Line height for readability */
      color: #333333; /* Dark grey text color for the body */
    }
    .email-body p {
      margin: 0 0 15px 0; /* Margin below paragraphs */
    }
    .reset-button-container {
      text-align: center; /* Center align the reset button */
      margin: 25px 0; /* Margin around the button container */
    }
    .reset-button {
      display: inline-block; /* Allows padding and margin */
      padding: 12px 30px; /* Padding inside the button */
      background-color: #E74C3C; /* A distinct color for password reset (e.g., a shade of red/orange) */
      color: #ffffff !important; /* Button text color (white), !important to override link styles */
      text-decoration: none; /* Remove underline from the link */
      border-radius: 5px; /* Rounded corners for the button */
      font-weight: bold; /* Bold font weight for button text */
      font-size: 16px; /* Font size for button text */
      border: none; /* Remove border for a cleaner look */
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for the button */
    }
    .email-footer {
      padding: 20px 25px; /* Padding within the footer */
      font-size: 13px; /* Smaller font size for footer text */
      color: #777777; /* Lighter grey text color for the footer */
      text-align: center; /* Center align footer content */
      border-top: 1px solid #eeeeee; /* Separator line above the footer */
    }
    .email-footer a {
        color: #4A90E2; /* Link color in the footer */
        text-decoration: none; /* Remove underline from footer links */
    }
    .content-block { /* Utility class for spacing */
        padding-bottom: 10px;
    }
    .highlight { /* Utility class for highlighting text */
        color: #2a7ae2; /* Highlight color (brand blue) */
        font-weight: bold;
    }

    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important; /* Full width on smaller screens */
        border-radius: 0; /* Remove border radius on smaller screens */
      }
      .email-wrapper {
        padding: 0; /* Remove padding around container on smaller screens */
      }
      .email-body, .email-footer, .email-header {
        padding: 20px !important; /* Adjust padding for smaller screens */
      }
      .email-header h1 {
        font-size: 22px !important; /* Slightly smaller heading on mobile */
      }
      .reset-button {
        padding: 15px 25px !important; /* Make button easier to tap */
        font-size: 17px !important; /* Slightly larger button text on mobile */
        width: 90% !important; /* Make button wider on mobile */
        box-sizing: border-box; /* Include padding and border in the element's total width and height */
      }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Reset your DocUSort password.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0;">
          <tr>
            <td align="center" class="email-header" style="background-color: #4A90E2; color: #ffffff; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Reset Your Password</h1>
            </td>
          </tr>

          <tr>
            <td class="email-body" style="padding: 30px 25px; font-size: 16px; line-height: 1.6; color: #333333;">
              <p style="margin: 0 0 15px 0;">Hello,</p>
              <p style="margin: 0 0 15px 0;">We received a request to reset the password for your <span class="highlight" style="color: #2a7ae2; font-weight: bold;">DocUSort</span> account. No problem!</p>
              <p style="margin: 0 0 15px 0;">Click the button below to choose a new password:</p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="reset-button-container" style="text-align: center; margin: 25px 0;">
                <tr>
                  <td align="center">
                    <a href="http://localhost:3000/reset-password/${resetToken}" class="reset-button" target="_blank" style="display: inline-block; padding: 12px 30px; background-color: #E74C3C; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Reset Password</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 15px 0;">This password reset link is valid for the next <strong style="color: #333333;">30 minutes</strong>. For security reasons, if you do not use this link within 30 minutes, it will expire, and you will need to request a new one.</p>
              <p style="margin: 0 0 15px 0;">If you did not request a password reset, please ignore this email or contact our support if you have concerns. Your account is still secure.</p>
              <p style="margin: 0 0 15px 0;">Thanks,<br>The DocUSort Team</p>
            </td>
          </tr>

          <tr>
            <td class="email-footer" style="padding: 20px 25px; font-size: 13px; color: #777777; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 10px 0;">You're receiving this email because a password reset was requested for your account.</p>
              <p style="margin: 0 0 10px 0;">DocUSort Team</p>
          </tr>
        </table>
        </td>
    </tr>
  </table>
</body>
</html>

    `
  SendMailUsingSmtp(recepeint,subject,htmlText);

  }

