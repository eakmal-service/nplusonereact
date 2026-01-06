
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP credentials missing. Emails will not be sent.");
}

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 465, // or 587
    secure: true, // true for 465, false for 587
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

export const sendOrderConfirmationEmail = async (order: any, customer: any, items: any[]) => {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return;

    const itemsHtml = items.map((item) => `
        <div style="display: flex; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <img src="${item.product.image || 'https://via.placeholder.com/80'}" width="60" height="80" style="object-fit: cover; border-radius: 4px;" />
            <div>
                <p style="margin: 0; font-weight: bold; font-size: 14px;">${item.product.title}</p>
                <p style="margin: 4px 0; font-size: 12px; color: #555;">Size: ${item.size} | Qty: ${item.quantity}</p>
                 <p style="margin: 0; font-weight: bold; font-size: 13px;">₹${item.product.price}</p>
            </div>
        </div>
    `).join('');

    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
                 <img src="https://res.cloudinary.com/douy8ujry/image/upload/v1709827845/nplus/logo-white.png" alt="NPlusOne" height="40" style="display: block; margin: 0 auto;" />
            </div>
            
            <div style="padding: 24px;">
                <h2 style="color: #333; margin-top: 0;">Order Confirmed! 🎉</h2>
                <p style="color: #555;">Hi ${customer.name},</p>
                <p style="color: #555;">Thank you for your order. We've received it and are getting it ready.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px;"><strong>Order ID:</strong> ${order.id}</p>
                    <p style="margin: 5px 0 0; font-size: 14px;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>

                <h3 style="margin-bottom: 15px; font-size: 16px;">Order Details</h3>
                ${itemsHtml}

                <div style="margin-top: 20px; text-align: right;">
                    <p style="font-size: 18px; font-weight: bold;">Total: ₹${order.total_amount}</p>
                </div>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                
                <p style="font-size: 12px; color: #999; text-align: center;">Need help? Reply to this email or contact support.</p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"NPlusOne Fashion" <${SMTP_USER}>`,
            to: customer.email,
            subject: `Order Confirmation #${order.id.slice(0, 8)} - NPlusOne Fashion`,
            html: html,
        });
        console.log(`Order confirmation email sent to ${customer.email}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
