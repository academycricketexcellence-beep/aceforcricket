const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Contact form submission - Redirect to WhatsApp
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, program } = req.body;

    // Validate input
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Log the inquiry
    console.log('Contact form received:', {
      name,
      email,
      phone,
      message,
      program,
      timestamp: new Date().toISOString()
    });

    // Build WhatsApp message with form details
    const whatsappMessage = `Hello ACE! 👋

I'm interested in joining ACE Cricket Academy.

*My Details:*
📱 Name: ${name}
📧 Email: ${email}
☎️ Phone: ${phone}
${program ? `🎯 Program: ${program}` : ''}

*Message:*
${message}

Please let me know the next steps. Thank you!`;

    const phoneNumber = '918121334894'; // WhatsApp format without + sign
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return res.status(200).json({ 
      success: true,
      redirectUrl: whatsappUrl,
      message: 'Redirecting to WhatsApp...' 
    });
  } catch (error) {
    console.error('Error handling contact form:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Phone call handler (tracks phone interactions)
app.post('/api/phone-inquiry', async (req, res) => {
  try {
    const { visitorPhone, inquiryType } = req.body;

    console.log('Phone inquiry:', {
      visitorPhone,
      inquiryType,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({ 
      success: true,
      message: 'Please call +91 81213 34894 to speak with our team.'
    });
  } catch (error) {
    console.error('Error handling phone inquiry:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// WhatsApp integration
app.post('/api/whatsapp', async (req, res) => {
  try {
    const { phone, message } = req.body;
    const phoneNumber = '+918121334894';
    
    // WhatsApp Web URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    return res.status(200).json({ 
      success: true,
      url: whatsappUrl
    });
  } catch (error) {
    console.error('Error handling WhatsApp request:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ ACE Cricket Academy Backend Server running on http://localhost:${PORT}`);
  console.log(`📞 Contact Phone: +91 81213 34894`);
});
