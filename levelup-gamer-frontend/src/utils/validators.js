export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1;
  }
  return age;
};

export const isOver18 = (birthDate) => {
  return validateAge(birthDate) >= 18;
};

export const isDuocEmail = (email) => {
  return email.toLowerCase().endsWith("@duocuc.cl");
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateReferralCode = (code) => {
  return code.length >= 6 && code.length <= 10;
};
