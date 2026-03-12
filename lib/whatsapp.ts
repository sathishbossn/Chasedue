import * as Linking from 'expo-linking';

type ChaseParams = {
  phone: string;
  message: string;
};

export function getWhatsAppUrl({ phone, message }: ChaseParams) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export async function openWhatsApp(params: ChaseParams) {
  const url = getWhatsAppUrl(params);
  await Linking.openURL(url);
}

