export const checkIfTokenExpired = (decodedToken: any) => {
  const expirationDate = decodedToken.exp;
  const now = Date.now() / 1000;
  if (!expirationDate) return false;
  return now > expirationDate;
};
