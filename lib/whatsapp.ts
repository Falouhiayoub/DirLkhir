export function generateWhatsAppMessage(need: {
  id: number;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
}): string {
  const message = `🤝 *Dir-Khir - Community Aid*

*Need:* ${need.title}
*Category:* ${need.category.toUpperCase()}
*Neighborhood:* ${need.neighborhood}

*Description:*
${need.description}

---
Help someone in your community! Download Dir-Khir to see how you can assist or post your own needs.`;

  return message;
}

export function getWhatsAppShareUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/?text=${encoded}`;
}

export function shareNeedViaWhatsApp(need: {
  id: number;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
}): void {
  const message = generateWhatsAppMessage(need);
  const url = getWhatsAppShareUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function shareNeedViaWhatsAppDirect(phoneNumber: string, need: {
  id: number;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
}): void {
  const message = generateWhatsAppMessage(need);
  const encoded = encodeURIComponent(message);
  // Format phone number (remove all non-digits, ensure +)
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const phone = cleanPhone.startsWith('212') ? '212' + cleanPhone.slice(3) : cleanPhone;
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
