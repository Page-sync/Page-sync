import { json } from "stream/consumers";

const BASE_URL = import.meta.env.BASE_URL;
const sendDelete = async (path: string, id: number) => {
  try {
    const response = await fetch(`${BASE_URL}${path}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      return { success: true };
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Delete error");
  }
};

const sendPost = async (path: string, id: number, content: object) => {
  try {
    // check current user in session?
    const response = await fetch(`${BASE_URL}${path}/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    if (response.ok) {
      return { success: true };
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Post error");
  }
};
const sendPatch = async (path: string, id: number, content: object) => {
  try {
    const response = await fetch(`${BASE_URL}${path}/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    if (response.ok) {
      return { success: true };
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Patch error");
  }
};
export { sendDelete, sendPost, sendPatch };
