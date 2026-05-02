export const formatDateToBanglaFull = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const banglaMonths = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  const banglaNumbers = { '0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯' };

  const toBangla = (num) => num.toString().split('').map(d => banglaNumbers[d] || d).join('');

  return `${toBangla(day)} ${banglaMonths[month]} ${toBangla(year)}`;
};