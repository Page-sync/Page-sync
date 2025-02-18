import { json } from "stream/consumers";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const sendGet = async (path: string, params?: object) => {
  try {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const urlString = url.toString();
    console.log(urlString);

    const response = await fetch(`${urlString}`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const result = await response.json();
      return { success: true, result: result };
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Get error");
  }
};

const sendPost = async (path: string, id: number, content: object) => {
  try {
    // check current user in session?
    const response = await fetch(`${BASE_URL}${path}/id=${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    if (response.ok) {
      const result = await response.json();
      return { success: true, result: result };
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Post error");
  }
};
const sendDelete = async (path: string, id: number) => {
  try {
    const response = await fetch(`${BASE_URL}${path}/id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      const result = await response.json();
      return { success: true, result: result };
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Delete error");
  }
};

const sendPatch = async (path: string, id: number, content: object) => {
  try {
    const response = await fetch(`${BASE_URL}${path}/id=${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    if (response.ok) {
      const result = await response.json();
      return { success: true, result: result };
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Patch error");
  }
};
export { sendDelete, sendPost, sendPatch, sendGet };
