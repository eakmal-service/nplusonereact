// Utility to check for RTO risks
interface CustomerDetails {
    phoneNumber?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    address1?: string;
    addressLine1?: string;
    pincode?: string;
}

export const validateOrderRisk = (customer: CustomerDetails) => {
    const phone = customer.phoneNumber || customer.phone || customer.mobile || '';
    const address = customer.address || customer.address1 || customer.addressLine1 || '';
    const pincode = customer.pincode || '';

    // 1. Phone Check (Simple 10 digit check)
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's 10-12 digits (allowing for 91 prefix)
    const isValidPhone = cleanPhone.length >= 10 && cleanPhone.length <= 12;

    if (!isValidPhone) {
        return { isSafe: false, reason: `Invalid Phone Number: ${phone}` };
    }

    // 2. Address Length Check
    // "Surat" = 5 chars. We want at least 10-15 chars.
    if (address.trim().length < 10) {
        return { isSafe: false, reason: `Address too short (${address.length} chars)` };
    }

    // 3. Pincode Check
    if (!/^\d{6}$/.test(pincode)) {
        return { isSafe: false, reason: `Invalid Pincode: ${pincode}` };
    }

    return { isSafe: true, reason: 'Passed' };
};
