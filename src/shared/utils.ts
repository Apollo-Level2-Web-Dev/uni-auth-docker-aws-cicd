export const hideEmail = (email: string) => {
  let hiddenEmail = '';
  const visibleChars = 4;

  for (let i = 0; i < email.length; i++) {
    if (i < visibleChars || email[i] === '@') {
      hiddenEmail += email[i];
    } else {
      hiddenEmail += '*';
    }
  }

  return hiddenEmail;
};
