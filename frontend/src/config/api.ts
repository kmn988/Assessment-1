import axiosInstance from "./axios";

export const get_expenses = async (params: any) => {
  const res = await axiosInstance.get("/expenses", {
    params: params,
  });
  return res.data;
};

export const get_expense_by_category = async (params: any) => {
  const res = await axiosInstance.get("/expense_by_category", {
    params: params,
  });
  return res.data;
};

export const create_expense = async (params: any) => {
  const res = await axiosInstance.post("/expense", params);
  return res.data;
};
export const update_expense_by_id = async ({ id, params }: any) => {
  const res = await axiosInstance.put(`/expense/${id}`, params);
  return res.data;
};

export const delete_expense_by_id = async (id: any) => {
  const res = await axiosInstance.delete(`/expense/${id}`);
  return res.data;
};

export const get_trend = async (params: any) => {
  const res = await axiosInstance.get("/trends", {
    params: params,
  });
  return res.data;
};


export const login = async (params: any) => {
  const res = await axiosInstance.post("/login", params);
  return res.data;
};

export const register = async (params: any) => {
  const res = await axiosInstance.post("/register", params);
  return res.data;
};

export const get_users = async (params?: any) => {
  const res = await axiosInstance.get("/users", { params });
  return res.data;
};

export const get_user_detail = async (userId: string, year: number) => {
  const res = await axiosInstance.get(`/users/${userId}`, { params: { year } });
  return res.data;
};

export const create_user = async (params: any) => {
  const res = await axiosInstance.post("/users", params);
  return res.data;
};

export const update_user = async (userId: string, params: any) => {
  const res = await axiosInstance.put(`/users/${userId}`, params);
  return res.data;
};

export const delete_user = async (userId: string) => {
  const res = await axiosInstance.delete(`/users/${userId}`);
  return res.data;
};
