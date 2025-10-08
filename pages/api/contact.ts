import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail'; 

// --- Configuration ---

// 1. Get the SendGrid API Key from environment variables
//    This key is set in your .env.local file.
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// 2. Define the verified sender email address.
//    This MUST be the email you verified in your SendGrid account (e.g., utkarshjain5678@gmail.com).
const VERIFIED_SENDER_EMAIL = 'utkarshjain5678@gmail.com'; // TODO: Replace with your verified sender email

// --- Handler Function ---
interface SendGridErrorResponse {
  response: {
    body: {
      errors?: Array<{ message: string }>;
    };
  };
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Method Check
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, email, message } = req.body;

  // 2. Input Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields (name, email, message) are required.' });
  }

  try {
    // --- Define and Send Email Message ---
    
    // Acknowledge Email (to the user who submitted the form)
    const msgToUser = {
      to: email,
      from: VERIFIED_SENDER_EMAIL,
      subject: `Thank You for Contacting Musicore, ${name}!`,
      html: `
        <p style="font-family: sans-serif; color: #111827;">Dear ${name},</p>
        <p style="font-family: sans-serif; color: #6B7280;">We have successfully received your message and will respond to your query as quickly as possible, usually within 24 hours.</p>
        <div style="border-left: 3px solid #A0522D; padding-left: 15px; margin-top: 20px;">
          <p style="font-family: sans-serif; font-style: italic; color: #6B7280;">Your message: ${message}</p>
        </div>
        <p style="font-family: sans-serif; color: #6B7280; margin-top: 20px;">The Musicore Team</p>
      `,
    };

    // Send only the user acknowledgement email
    await sgMail.send(msgToUser);
    
    // 3. Success Response
    return res.status(200).json({ message: 'Success! Your message has been sent.' });

  } catch (error) {
    
    let errorMessage = 'An unexpected server error occurred.';
    
    // Safely assign errorDetails only if the type is known or can be narrowed
    let errorDetails: string | object = (typeof error === 'object' && error !== null) || (typeof error === 'string') 
        ? error 
        : errorMessage; 

    // --- Type Guard Check (Safely checks for SendGrid structure) ---
    // We check if the error resembles our defined SendGrid error response
    if (typeof error === 'object' && error !== null && 'response' in error && (error as SendGridErrorResponse).response?.body) {
        
        const sgError = error as SendGridErrorResponse;

        // Use the strongly typed object to extract the message
        errorMessage = `SendGrid Error: ${sgError.response.body.errors?.[0]?.message || 'Check server logs.'}`;
        errorDetails = sgError.response.body; // Assigns the typed body object
        
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    // Log detailed error for debugging purposes
    console.error('SendGrid Error Details:', errorDetails);
    console.error('Internal Error Message:', errorMessage);

    // 4. Error Response
    return res.status(500).json({ error: 'Failed to send message due to a server error.' });
  }
}