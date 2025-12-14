//This checks whether a user is “logged in”.
export function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}
