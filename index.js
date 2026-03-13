import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory - based on your folder structure
app.set('views', join(__dirname, 'views', 'Ejs components'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON bodies

// Serve static files from 'public' directory
app.use(express.static(join(__dirname, 'public')));

// EMAIL CREDENTIALS FROM ENVIRONMENT VARIABLES
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

// Validate environment variables
if (!EMAIL_USER || !EMAIL_PASS || !CONTACT_EMAIL) {
    console.error('❌ Missing required environment variables. Please check your .env file');
    console.error('Required variables: EMAIL_USER, EMAIL_PASS, CONTACT_EMAIL');
    process.exit(1);
}

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
    console.error("Please check your email credentials in the .env file");
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

app.get('/', (req, res) => {
    res.render('Eternity');
});

///////////////////////////// Homepage/Landing route
// 1. Homecare route
app.get('/homecare', (req, res) => {
    res.render('Disability Care/HomeCare.ejs', {
        title: 'Homecare Services',
        message: 'Professional in-home care and support'
    });
});

// 2. Support Coordination route
app.get('/support-coordination', (req, res) => {
    res.render('Disability Care/Support Coordination', {
        title: 'Support Coordination',
        message: 'Expert guidance to navigate your NDIS plan'
    });
});

// 3. Community Access route
app.get('/community-access', (req, res) => {
    res.render('Disability Care/Community Access', {
        title: 'Community Access',
        message: 'Engaging community participation and social activities'
    });
});

// 4. Day Program route
app.get('/day-program', (req, res) => {
    res.render('Disability Care/Day Program', {
        title: 'Day Programs',
        message: 'Structured daily activities and skill development'
    });
});

// 5. Disability Transport route
app.get('/disability-transport', (req, res) => {
    res.render('Disability Care/Disability Transport', {
        title: 'Disability Transport Services',
        message: 'Safe and reliable transport solutions'
    });
});

// 7. Disability Transport route
app.get('/disability-transport-services', (req, res) => {
    res.render('Disability Care/Disability Transport', {
        title: 'Disability Transport',
        message: 'Comprehensive transport services for participants'
    });
});

app.get('/mental-health-care', (req, res) => {
    res.render('Disability Care/Mental Health Care', {
        title: 'Mental Health Care',
        message: 'Specialised support for emotional and psychological wellbeing'
    });
});

app.get('/community-nursing', (req, res) => {
    res.render('Disability Care/Community Nursing', {
        title: 'Community Nursing',
        message: 'Professional nursing care in the comfort of your home'
    });
});

////////////////////// / ACCOMMODATION Routes

// 1. SIL (Supported Independent Living) route
app.get('/sil', (req, res) => {
    res.render('Accomodation/SIL', {
        title: 'Supported Independent Living (SIL)',
        message: 'Independent living with personalized support'
    });
});
// 5. SDA (Specialist Disability Accommodation) route
app.get('/sda', (req, res) => {
    res.render('Accomodation/SDA', {
        title: 'Specialist Disability Accommodation (SDA)',
        message: 'Specialized housing solutions designed for your needs'
    });
});

///////////////////// About Routes

// 1. Our Story route
app.get('/our-story', (req, res) => {
    res.render('About/Our Story', {
        title: 'Our Story',
        message: 'The journey behind our care and commitment'
    });
});

// 2. Our Team route
app.get('/our-team', (req, res) => {
    res.render('About/Our Team', {
        title: 'Our Team',
        message: 'Meet our dedicated professionals'
    });
});

app.get('/feedback', (req, res) => {
    res.render('About/Feedback', {
        title: 'Feedback',
        message: 'We value your thoughts and experiences'
    });
});

///////////////////// Referral form 
app.get('/referral-foam', (req, res) => {
    res.render('Referral form/Referral form', {
        title: 'Referral Form',
        message: 'Submit a referral for our services'
    });
});

// GET route to display the contact form
app.get('/contact-form', (req, res) => {
    res.render('Contact/Contact Us', {
        title: 'Contact Form',
        message: 'Send us a message'
    });
});

// ============================================
// CONTACT FORM HANDLER FOR ETERNITY CARE SERVICES
// ============================================

// POST route to handle contact form submission
app.post('/contact-form', async (req, res) => {
    try {
        const { name, email, contact, subject, details } = req.body;
        
        console.log('📝 Form submission received:', { name, email, subject, contact });

        // Validate required fields
        if (!name || !email || !contact || !subject || !details) {
            console.log('❌ Validation failed: Missing fields');
            return res.status(400).json({ 
                success: false,
                error: 'All fields are required' 
            });
        }

        // Email validation
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (!emailRegex.test(email)) {
            console.log('❌ Validation failed: Invalid email');
            return res.status(400).json({ 
                success: false,
                error: 'Please enter a valid email address' 
            });
        }

        // Phone validation
        const phoneDigits = contact.replace(/\D/g, '');
        if (phoneDigits.length < 8) {
            console.log('❌ Validation failed: Invalid phone');
            return res.status(400).json({ 
                success: false,
                error: 'Please enter a valid phone number (minimum 8 digits)' 
            });
        }

        // Create transporter with credentials from env
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection
        await transporter.verify();
        console.log('✅ Transporter verified successfully');

        // Email to Admin
        const adminMailOptions = {
            from: `"Eternity Care Services" <${EMAIL_USER}>`,
            to: CONTACT_EMAIL,
            replyTo: email,
            subject: `New Contact Form: ${subject} - ${name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #97d700; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .field { margin-bottom: 20px; }
                        .label { font-weight: bold; color: #555; margin-bottom: 5px; }
                        .value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin:0;">New Contact Form Submission</h2>
                            <p style="margin:5px 0 0; opacity:0.9;">Eternity Care Services</p>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">👤 Personal Information</div>
                                <div class="value">
                                    <strong>Name:</strong> ${name}<br>
                                    <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br>
                                    <strong>Phone:</strong> <a href="tel:${contact}">${contact}</a>
                                </div>
                            </div>
                            
                            <div class="field">
                                <div class="label">📌 Subject</div>
                                <div class="value">${subject}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">💬 Message</div>
                                <div class="value" style="white-space: pre-wrap;">${details}</div>
                            </div>
                            
                            <div class="footer">
                                <p>This message was sent from the Eternity Care Services contact form.</p>
                                <p>Submitted on: ${new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
NEW CONTACT FORM SUBMISSION
============================
Eternity Care Services

PERSONAL INFORMATION:
--------------------
Name: ${name}
Email: ${email}
Phone: ${contact}

SUBJECT:
--------
${subject}

MESSAGE:
--------
${details}

---
Submitted on: ${new Date().toLocaleString()}
            `
        };

        // Send email to admin
        const adminInfo = await transporter.sendMail(adminMailOptions);
        console.log('✅ Admin email sent. Message ID:', adminInfo.messageId);

        // Email to User (auto-reply) - don't fail if this doesn't work
        try {
            const userMailOptions = {
                from: `"Eternity Care Services" <${EMAIL_USER}>`,
                to: email,
                subject: 'Thank you for contacting Eternity Care Services',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: #97d700; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h2 style="margin:0;">Thank You for Contacting Us!</h2>
                            </div>
                            <div class="content">
                                <p>Dear ${name},</p>
                                <p>Thank you for reaching out to Eternity Care Services. We have received your message and will get back to you within 24 hours.</p>
                                <p><strong>Your message:</strong> ${subject}</p>
                                <p>For urgent matters, please call us at <a href="tel:1300799885">1300 799 885</a>.</p>
                                <div class="signature">
                                    <p>Warm regards,<br>The Eternity Care Services Team</p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };
            
            const userInfo = await transporter.sendMail(userMailOptions);
            console.log('✅ User auto-reply sent. Message ID:', userInfo.messageId);
        } catch (userEmailError) {
            console.log('⚠️ User auto-reply failed but admin email sent:', userEmailError.message);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Thank you for contacting us! We will get back to you within 24 hours.' 
        });

    } catch (error) {
        console.error('❌ Email sending error:', error);
        
        // More specific error messages
        if (error.code === 'EAUTH') {
            return res.status(500).json({ 
                success: false,
                error: 'Email authentication failed. Please check your email settings.' 
            });
        } else if (error.code === 'ESOCKET') {
            return res.status(500).json({ 
                success: false,
                error: 'Network error. Please try again.' 
            });
        } else {
            return res.status(500).json({ 
                success: false,
                error: 'There was an error sending your message. Please try again or call us directly at 1300 799 885.' 
            });
        }
    }
});

// ============================================
// REFERRAL FORM HANDLER FOR ETERNITY CARE SERVICES
// ============================================

// POST route to handle referral form submission
app.post('/referral-form', async (req, res) => {
    try {
        const { 
            participantName, 
            dob, 
            participantPhone, 
            participantEmail, 
            ndisNumber, 
            planManager,
            streetAddress,
            suburb,
            state,
            postalCode,
            referrerFirstName,
            referrerLastName,
            referrerPhone,
            referrerEmail,
            organization,
            relationship
        } = req.body;
        
        console.log('📝 Referral form submission received:', { 
            participantName, 
            participantPhone,
            referrerName: (referrerFirstName || '') + ' ' + (referrerLastName || '')
        });

        // Validate required fields
        if (!participantName || !participantPhone) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({ 
                success: false,
                error: 'Participant name and phone number are required fields' 
            });
        }

        // Phone validation for participant
        const participantPhoneDigits = participantPhone.replace(/\D/g, '');
        if (participantPhoneDigits.length < 8) {
            console.log('❌ Validation failed: Invalid participant phone');
            return res.status(400).json({ 
                success: false,
                error: 'Please enter a valid participant phone number (minimum 8 digits)' 
            });
        }

        // Email validation if provided
        if (participantEmail) {
            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
            if (!emailRegex.test(participantEmail)) {
                console.log('❌ Validation failed: Invalid participant email');
                return res.status(400).json({ 
                    success: false,
                    error: 'Please enter a valid email address for participant' 
                });
            }
        }

        // Email validation for referrer if provided
        if (referrerEmail) {
            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
            if (!emailRegex.test(referrerEmail)) {
                console.log('❌ Validation failed: Invalid referrer email');
                return res.status(400).json({ 
                    success: false,
                    error: 'Please enter a valid email address for referrer' 
                });
            }
        }

        // Phone validation for referrer if provided
        if (referrerPhone) {
            const referrerPhoneDigits = referrerPhone.replace(/\D/g, '');
            if (referrerPhoneDigits.length < 8) {
                console.log('❌ Validation failed: Invalid referrer phone');
                return res.status(400).json({ 
                    success: false,
                    error: 'Please enter a valid referrer phone number (minimum 8 digits)' 
                });
            }
        }

        // Postal code validation if provided
        if (postalCode && !/^\d{4}$/.test(postalCode)) {
            console.log('❌ Validation failed: Invalid postal code');
            return res.status(400).json({ 
                success: false,
                error: 'Please enter a valid 4-digit postal code' 
            });
        }

        // DOB validation if provided (DD/MM/YYYY format)
        if (dob && !/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
            console.log('❌ Validation failed: Invalid date format');
            return res.status(400).json({ 
                success: false,
                error: 'Please enter date of birth in DD/MM/YYYY format' 
            });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection
        await transporter.verify();
        console.log('✅ Transporter verified successfully');

        // Build address string
        const address = [streetAddress, suburb, state, postalCode].filter(Boolean).join(', ') || 'Not provided';

        // Build referrer full name
        const referrerFullName = ((referrerFirstName || '') + ' ' + (referrerLastName || '')).trim() || 'Not provided';

        // Email to Admin
        const adminMailOptions = {
            from: `"Eternity Care Services" <${EMAIL_USER}>`,
            to: CONTACT_EMAIL,
            replyTo: referrerEmail || participantEmail || EMAIL_USER,
            subject: `New NDIS Referral: ${participantName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #97d700; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .section { margin-bottom: 25px; }
                        .section-title { 
                            background: #97d700; 
                            color: white; 
                            padding: 8px 15px; 
                            border-radius: 5px; 
                            margin-bottom: 15px; 
                            font-weight: bold;
                        }
                        .field { margin-bottom: 10px; }
                        .label { font-weight: bold; color: #555; }
                        .value { background: white; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; margin-top: 2px; }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin:0;">New NDIS Referral Form Submission</h2>
                            <p style="margin:5px 0 0; opacity:0.9;">Eternity Care Services</p>
                        </div>
                        <div class="content">
                            
                            <!-- Participant Details Section -->
                            <div class="section">
                                <div class="section-title">👤 NDIS Participant Details</div>
                                <div class="field">
                                    <div class="label">Full Name:</div>
                                    <div class="value">${participantName || 'Not provided'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Date of Birth:</div>
                                    <div class="value">${dob || 'Not provided'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Phone Number:</div>
                                    <div class="value">${participantPhone || 'Not provided'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Email:</div>
                                    <div class="value">${participantEmail || 'Not provided'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">NDIS Number:</div>
                                    <div class="value">${ndisNumber || 'Not provided'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">NDIS Plan Manager:</div>
                                    <div class="value">${planManager || 'Not provided'}</div>
                                </div>
                            </div>

                            <!-- Address Section -->
                            <div class="section">
                                <div class="section-title">📍 Address Information</div>
                                <div class="field">
                                    <div class="label">Full Address:</div>
                                    <div class="value">${address}</div>
                                </div>
                                ${streetAddress ? `<div class="field"><div class="label">Street:</div><div class="value">${streetAddress}</div></div>` : ''}
                                ${suburb ? `<div class="field"><div class="label">Suburb:</div><div class="value">${suburb}</div></div>` : ''}
                                ${state ? `<div class="field"><div class="label">State:</div><div class="value">${state}</div></div>` : ''}
                                ${postalCode ? `<div class="field"><div class="label">Postal Code:</div><div class="value">${postalCode}</div></div>` : ''}
                            </div>

                            <!-- Referrer Details Section -->
                            <div class="section">
                                <div class="section-title">📋 Person Making Referral</div>
                                <div class="field">
                                    <div class="label">Full Name:</div>
                                    <div class="value">${referrerFullName}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Phone Number:</div>
                                    <div class="value">${referrerPhone || 'Not provided'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Email:</div>
                                    <div class="value">${referrerEmail || 'Not provided'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Organization & Position:</div>
                                    <div class="value">${organization || 'Not provided'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Relationship to Participant:</div>
                                    <div class="value">${relationship || 'Not provided'}</div>
                                </div>
                            </div>

                            <!-- Privacy Statement -->
                            <div class="section" style="background: #f0f9f0; padding: 15px; border-radius: 5px;">
                                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <i class="ri-shield-check-line" style="color: #97d700; font-size: 24px; margin-right: 10px;"></i>
                                    <h4 style="margin:0; color: #333;">Privacy Statement</h4>
                                </div>
                                <p style="margin:0; color: #555; font-size: 13px;">
                                    This referral was submitted with acknowledgment of our privacy policy.
                                    All information will be handled in accordance with the Australian Privacy Act 1988.
                                </p>
                            </div>
                            
                            <div class="footer">
                                <p>This referral was submitted from the Eternity Care Services website.</p>
                                <p>Submitted on: ${new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
NEW NDIS REFERRAL FORM SUBMISSION
==================================
Eternity Care Services

NDIS PARTICIPANT DETAILS:
-------------------------
Full Name: ${participantName || 'Not provided'}
Date of Birth: ${dob || 'Not provided'}
Phone: ${participantPhone || 'Not provided'}
Email: ${participantEmail || 'Not provided'}
NDIS Number: ${ndisNumber || 'Not provided'}
NDIS Plan Manager: ${planManager || 'Not provided'}

ADDRESS INFORMATION:
-------------------
${address}

PERSON MAKING REFERRAL:
----------------------
Full Name: ${referrerFullName}
Phone: ${referrerPhone || 'Not provided'}
Email: ${referrerEmail || 'Not provided'}
Organization: ${organization || 'Not provided'}
Relationship: ${relationship || 'Not provided'}

---
Submitted on: ${new Date().toLocaleString()}
            `
        };

        // Send email to admin
        const adminInfo = await transporter.sendMail(adminMailOptions);
        console.log('✅ Admin referral email sent. Message ID:', adminInfo.messageId);

        // Email to referrer if email provided
        if (referrerEmail) {
            try {
                const referrerMailOptions = {
                    from: `"Eternity Care Services" <${EMAIL_USER}>`,
                    to: referrerEmail,
                    subject: 'Thank you for your referral - Eternity Care Services',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: #97d700; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .highlight { background: #f0f9f0; padding: 15px; border-left: 4px solid #97d700; margin: 20px 0; }
                                .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h2 style="margin:0;">Thank You for Your Referral!</h2>
                                </div>
                                <div class="content">
                                    <p>Dear ${referrerFirstName || 'Referrer'},</p>
                                    
                                    <p>Thank you for referring <strong>${participantName}</strong> to Eternity Care Services. We have received your referral and will take the following steps:</p>
                                    
                                    <div class="highlight">
                                        <p style="margin:0;"><strong>What happens next?</strong></p>
                                        <ul style="margin-top:10px;">
                                            <li>Our intake team will review the referral within 24-48 hours</li>
                                            <li>We'll contact the participant to discuss their needs</li>
                                            <li>A service agreement will be prepared if suitable</li>
                                        </ul>
                                    </div>
                                    
                                    <p><strong>Referral Summary:</strong><br>
                                    Participant: ${participantName}<br>
                                    Phone: ${participantPhone}</p>
                                    
                                    <p>If you need to add any additional information, please contact our intake team at <a href="mailto:admin@eternitycs.com.au">admin@eternitycs.com.au</a> or call <a href="tel:1300799885">1300 799 885</a>.</p>
                                    
                                    <div class="signature">
                                        <p>Warm regards,<br>
                                        <strong>The Eternity Care Services Team</strong></p>
                                        <p style="font-size:12px; color:#666;">
                                            admin@eternitycs.com.au | 1300 799 885<br>
                                            Suite 535, 1 Queens Rd, Melbourne VIC 3004
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                };
                
                const referrerInfo = await transporter.sendMail(referrerMailOptions);
                console.log('✅ Referrer email sent. Message ID:', referrerInfo.messageId);
            } catch (referrerError) {
                console.log('⚠️ Referrer email failed but admin email sent:', referrerError.message);
            }
        }

        // Email to participant if email provided
        if (participantEmail && participantEmail !== referrerEmail) {
            try {
                const participantMailOptions = {
                    from: `"Eternity Care Services" <${EMAIL_USER}>`,
                    to: participantEmail,
                    subject: 'Referral Received - Eternity Care Services',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: #97d700; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h2 style="margin:0;">Your Referral Has Been Received</h2>
                                </div>
                                <div class="content">
                                    <p>Dear ${participantName},</p>
                                    
                                    <p>Thank you for your interest in Eternity Care Services. We have received your referral and our team will be in touch with you within 24-48 hours to discuss your needs and how we can support you.</p>
                                    
                                    <p>In the meantime, if you have any questions, please don't hesitate to contact us.</p>
                                    
                                    <div class="signature">
                                        <p>Warm regards,<br>
                                        <strong>The Eternity Care Services Team</strong></p>
                                        <p style="font-size:12px; color:#666;">
                                            admin@eternitycs.com.au | 1300 799 885
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                };
                
                const participantInfo = await transporter.sendMail(participantMailOptions);
                console.log('✅ Participant email sent. Message ID:', participantInfo.messageId);
            } catch (participantError) {
                console.log('⚠️ Participant email failed but admin email sent:', participantError.message);
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Thank you for your referral! Our team will review it and contact you within 24-48 hours.' 
        });

    } catch (error) {
        console.error('❌ Referral form error:', error);
        
        if (error.code === 'EAUTH') {
            return res.status(500).json({ 
                success: false,
                error: 'Email authentication failed. Please try again later.' 
            });
        } else if (error.code === 'ESOCKET') {
            return res.status(500).json({ 
                success: false,
                error: 'Network error. Please try again.' 
            });
        } else {
            return res.status(500).json({ 
                success: false,
                error: 'There was an error submitting your referral. Please try again or call us directly at 1300 799 885.' 
            });
        }
    }
});

// ============================================
// FEEDBACK FORM HANDLER FOR ETERNITY CARE SERVICES
// ============================================

// POST route to handle feedback form submission
// ============================================
// FEEDBACK FORM HANDLER FOR ETERNITY CARE SERVICES
// ============================================

// ============================================
// FEEDBACK FORM HANDLER FOR ETERNITY CARE SERVICES
// ============================================

// POST route to handle feedback form submission
app.post('/feedback-form', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            rating, 
            message
        } = req.body;
        
        console.log('📝 Feedback form submission received:', { 
            name, 
            email
        });

        // Validate required fields
        if (!name || !email || !message) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({ 
                success: false,
                error: 'Please fill in all required fields' 
            });
        }

        // Email validation
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (!emailRegex.test(email)) {
            console.log('❌ Validation failed: Invalid email');
            return res.status(400).json({ 
                success: false,
                error: 'Please enter a valid email address' 
            });
        }

        // Name validation
        if (name.length < 2) {
            console.log('❌ Validation failed: Name too short');
            return res.status(400).json({ 
                success: false,
                error: 'Please enter a valid name (minimum 2 characters)' 
            });
        }

        // Message validation
        if (message.length < 10) {
            console.log('❌ Validation failed: Message too short');
            return res.status(400).json({ 
                success: false,
                error: 'Please provide more details (minimum 10 characters)' 
            });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection
        await transporter.verify();
        console.log('✅ Transporter verified successfully');

        // Format rating text
        const ratingText = rating ? `${rating}/5` : 'Not provided';

        // Email to Admin
        const adminMailOptions = {
            from: `"Eternity Care Services" <${EMAIL_USER}>`,
            to: CONTACT_EMAIL,
            replyTo: email,
            subject: `New Feedback from ${name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #97d700; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .section { margin-bottom: 25px; }
                        .section-title { 
                            background: #97d700; 
                            color: white; 
                            padding: 8px 15px; 
                            border-radius: 5px; 
                            margin-bottom: 15px; 
                            font-weight: bold;
                        }
                        .field { margin-bottom: 10px; }
                        .label { font-weight: bold; color: #555; }
                        .value { background: white; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; margin-top: 2px; }
                        .message-box { 
                            background: white; 
                            padding: 15px; 
                            border-radius: 6px; 
                            border-left: 4px solid #97d700; 
                            margin-top: 10px;
                            white-space: pre-wrap;
                        }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin:0;">New Feedback Form Submission</h2>
                            <p style="margin:5px 0 0; opacity:0.9;">Eternity Care Services</p>
                        </div>
                        <div class="content">
                            
                            <!-- Personal Details Section -->
                            <div class="section">
                                <div class="section-title">👤 Personal Information</div>
                                <div class="field">
                                    <div class="label">Name:</div>
                                    <div class="value">${name}</div>
                                </div>
                                <div class="field">
                                    <div class="label">Email:</div>
                                    <div class="value"><a href="mailto:${email}">${email}</a></div>
                                </div>
                                <div class="field">
                                    <div class="label">Rating:</div>
                                    <div class="value">${ratingText}</div>
                                </div>
                            </div>

                            <!-- Feedback Message Section -->
                            <div class="section">
                                <div class="section-title">📝 Feedback Message</div>
                                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                            
                            <div class="footer">
                                <p>This feedback was submitted from the Eternity Care Services website.</p>
                                <p>Submitted on: ${new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
NEW FEEDBACK FORM SUBMISSION
==============================
Eternity Care Services

PERSONAL INFORMATION:
--------------------
Name: ${name}
Email: ${email}
Rating: ${ratingText}

FEEDBACK MESSAGE:
----------------
${message}

---
Submitted on: ${new Date().toLocaleString()}
            `
        };

        // Send email to admin
        const adminInfo = await transporter.sendMail(adminMailOptions);
        console.log('✅ Admin feedback email sent. Message ID:', adminInfo.messageId);

        // Send simple auto-reply to user (always send thank you email)
        try {
            const userMailOptions = {
                from: `"Eternity Care Services" <${EMAIL_USER}>`,
                to: email,
                subject: 'Thank you for your feedback - Eternity Care Services',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: #97d700; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .feedback-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #97d700; margin: 20px 0; }
                            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h2 style="margin:0;">Thank You for Your Feedback!</h2>
                            </div>
                            <div class="content">
                                <p>Dear ${name},</p>
                                
                                <p>Thank you for taking the time to share your feedback with Eternity Care Services. We truly value your input as it helps us improve our services and provide better care.</p>
                                
                                <div class="feedback-box">
                                    <p style="margin:0;"><strong>Your feedback:</strong></p>
                                    <hr style="margin:10px 0; border:1px solid #e5e7eb;">
                                    <p>${message}</p>
                                    ${rating ? `<p><strong>Rating:</strong> ${rating}/5</p>` : ''}
                                </div>
                                
                                <p><strong>What happens next?</strong></p>
                                <ul>
                                    <li>Your feedback has been recorded in our system</li>
                                    <li>Our team will review it to help improve our services</li>
                                </ul>
                                
                                <p>If you have any additional information to add, please contact us at <a href="mailto:admin@eternitycs.com.au">admin@eternitycs.com.au</a> or call <a href="tel:1300799885">1300 799 885</a>.</p>
                                
                                <div class="signature">
                                    <p>Warm regards,<br>
                                    <strong>The Eternity Care Services Team</strong></p>
                                    <p style="font-size:12px; color:#666;">
                                        admin@eternitycs.com.au | 1300 799 885<br>
                                        Suite 535, 1 Queens Rd, Melbourne VIC 3004
                                    </p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };
            
            const userInfo = await transporter.sendMail(userMailOptions);
            console.log('✅ User auto-reply sent. Message ID:', userInfo.messageId);
        } catch (userError) {
            console.log('⚠️ User auto-reply failed but admin email sent:', userError.message);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Thank you for your feedback! Your input helps us improve our services.' 
        });

    } catch (error) {
        console.error('❌ Feedback form error:', error);
        
        if (error.code === 'EAUTH') {
            return res.status(500).json({ 
                success: false,
                error: 'Email authentication failed. Please try again later.' 
            });
        } else if (error.code === 'ESOCKET') {
            return res.status(500).json({ 
                success: false,
                error: 'Network error. Please try again.' 
            });
        } else {
            return res.status(500).json({ 
                success: false,
                error: 'There was an error submitting your feedback. Please try again or call us directly at 1300 799 885.' 
            });
        }
    }
});

// TEST ROUTE to check email configuration
app.get('/test-email', async (req, res) => {
    try {
        const testTransporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await testTransporter.verify();
        
        const info = await testTransporter.sendMail({
            from: `"Test" <${EMAIL_USER}>`,
            to: CONTACT_EMAIL,
            subject: 'Test Email from Server',
            text: 'If you receive this, email is working!'
        });

        res.send(`✅ Test email sent successfully! Message ID: ${info.messageId}`);
    } catch (error) {
        res.send(`❌ Test failed: ${error.message}`);
    }
});

// Use port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server started successfully on port ${PORT}`);
    console.log("📁 Views directory:", join(__dirname, 'views', 'Ejs components'));
    console.log("📧 Email configured for:", EMAIL_USER);
    console.log("📨 Contact emails will be sent to:", CONTACT_EMAIL);
    console.log("🔒 Using environment variables for configuration");
});