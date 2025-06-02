export const setAdminAuth = (token, adminData) => {
  localStorage.setItem("adminToken", token);
  localStorage.setItem("admin", JSON.stringify(adminData));
};

export const getAdminAuth = () => {
  const token = localStorage.getItem("adminToken");
  const admin = JSON.parse(localStorage.getItem("admin"));
  return { token, admin };
};

export const isAdminAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
};
