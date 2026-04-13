import axiosInstance from "./axios";

export async function generatePackage(payload: unknown) {
  try {
    const response = await axiosInstance.post("/generate", payload);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
        "Server error while generating package"
      );
    }

    if (error.request) {
      throw new Error("API not reachable. Is backend running?");
    }

    throw new Error("Unexpected error occurred");
  }
}