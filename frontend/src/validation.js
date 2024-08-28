const passwordMinLength = 8;

const validateForm = (email, password, confirmPassword) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordChecks = [
    {
      check: (password) => password === confirmPassword,
      message: "Passwords do not match.",
    },
    {
      check: (password) => password.length >= passwordMinLength,
      message: `Password must be at least ${passwordMinLength} characters long.`,
    },
    {
      check: (password) => /\d/.test(password),
      message: "Password must include at least one number.",
    },
    {
      check: (password) => /[A-Z]/.test(password),
      message: "Password must include at least one uppercase letter.",
    },
    {
      check: (password) => /[a-z]/.test(password),
      message: "Password must include at least one lowercase letter.",
    },
    {
      check: (password) => /[^A-Za-z0-9]/.test(password),
      message: "Password must include at least one special character.",
    },
  ];

  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  for (let i = 0; i < passwordChecks.length; i++) {
    if (!passwordChecks[i].check(password)) {
      return { isValid: false, error: passwordChecks[i].message };
    }
  }

  return { isValid: true, error: "" };
};

export default validateForm;
