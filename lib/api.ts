import axios from "axios";
import axiosInstance from "./axios";

function getServerErrorMessage(status?: number, serverMessage?: unknown) {
  if (typeof serverMessage === "string" && serverMessage.trim()) {
    return serverMessage;
  }

  // the drb99 api gives nice, and appripriate errors, maybe change to that. (for now this works)
  switch (status) {
    case 400:
      return "The server rejected this request. Check the form values and try again.";
    case 404:
      return "The generate endpoint was not found. Check that the backend server is running the expected routes.";
    case 422:
      return "The backend could not validate this input. Check the repository URL, binary name, version, and asset URLs.";
    case 500:
      return "The backend failed while generating the package. Try again after checking the server logs.";
    case 502:
    case 503:
    case 504:
      return "The backend is temporarily unavailable. Try again in a moment.";
    default:
      return "The request failed while generating the package.";
  }
}

export async function prefillFormData(repoUrl: string) {
  try {
    const response = await axiosInstance.post("/api/v1/prefill", {
      repo_url: repoUrl,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        getServerErrorMessage(
          error.response.status,
          error.response.data?.message ?? error.response.data?.error
        )
      );
    }

    if (axios.isAxiosError(error) && error.request) {
      throw new Error(
        "Cannot reach the backend API. Check `NEXT_PUBLIC_API_BASE_URL` and make sure the backend server is running."
      );
    }

    throw new Error("Failed to prefill form data.");
  }
}

export async function generatePackage(payload: unknown) {
  try {
    const response = await axiosInstance.post("/api/v1/generate", payload);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        getServerErrorMessage(
          error.response.status,
          error.response.data?.message ?? error.response.data?.error
        )
      );
    }

    if (axios.isAxiosError(error) && error.request) {
      throw new Error(
        "Cannot reach the backend API. Check `NEXT_PUBLIC_API_BASE_URL` and make sure the backend server is running."
      );
    }

    throw new Error("Something unexpected went wrong while generating the package.");
  }
}
