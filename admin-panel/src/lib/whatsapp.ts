import twilio from 'twilio';

/**
 * TWILIO WHATSAPP CONFIGURATION
 * 
 * To use the Twilio Sandbox for testing:
 * 1. Open WhatsApp and send "join [your-sandbox-keyword]" to the sandbox number (+1 415 523 8886).
 * 2. You will receive a confirmation that you are joined to the sandbox.
 * 3. Only then can the sandbox send messages to your number.
 * 
 * In production, ensure you use an approved WhatsApp Business number.
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendWhatsApp(to: string, message: string) {
    // Graceful no-op if not configured
    if (!client || !accountSid) {
        console.warn('Twilio not configured. WhatsApp message skipped:', { to, message });
        return { success: false, error: 'Twilio not configured' };
    }

    try {
        // Format recipient number
        let formattedTo = to.trim();
        if (!formattedTo.startsWith('whatsapp:')) {
            if (!formattedTo.startsWith('+')) {
                // Default to India (+91) if no country code provided
                formattedTo = `whatsapp:+91${formattedTo}`;
            } else {
                formattedTo = `whatsapp:${formattedTo}`;
            }
        }

        const response = await client.messages.create({
            body: message,
            from: from,
            to: formattedTo,
        });

        console.log('WhatsApp message sent successfully:', response.sid);
        return { success: true, sid: response.sid };
    } catch (error: any) {
        console.error('Error sending WhatsApp message:', error.message);
        return { success: false, error: error.message };
    }
}

// --- Message Templates ---

const SCHOOL_NAME = "MP Kids School";
const CONTACT_PHONE = "+91 98765 43210";

export const templates = {
    admissionReceived: (studentName: string, applicationNo: string, className: string) =>
        `Hello! We've received ${studentName}'s application (${applicationNo}) for Class ${className}. We will review it shortly. - ${SCHOOL_NAME}`,

    admissionApproved: (studentName: string, applicationNo: string) =>
        `Congratulations! ${studentName}'s admission (${applicationNo}) has been APPROVED. Please visit the school office for next steps. - ${SCHOOL_NAME}`,

    admissionRejected: (studentName: string) =>
        `We regret to inform you that ${studentName}'s admission could not be processed at this time. Contact ${CONTACT_PHONE} for queries. - ${SCHOOL_NAME}`,

    admissionStatusUpdate: (studentName: string, applicationNo: string, status: string) =>
        `Update: ${studentName}'s application (${applicationNo}) status is now: ${status.toUpperCase()}. Check the portal for details. - ${SCHOOL_NAME}`,

    newLeadAck: (parentName: string, enquiryType: string) =>
        `Hi ${parentName}, thank you for your ${enquiryType} enquiry at ${SCHOOL_NAME}. Our team will contact you shortly. Call ${CONTACT_PHONE} for urgent help.`,

    generalNotice: (recipientName: string, message: string) =>
        `Notice for ${recipientName}: ${message} - Regards, ${SCHOOL_NAME}`,
};
