
export const setToken = (token: string) => {
  document.cookie = `token=${token}; path=/; max-age=604800`;
};

export const getToken = () => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];
};

export const removeToken = () => {
  document.cookie = "token=; path=/; max-age=0";
};