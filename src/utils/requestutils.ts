import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { Key } from "../enum/cache.key";
import { IResponse } from "../models/IResponse";
import { toastError, toastSuccess } from "../services/ToastService";

export const baseUrl = "http://localhost:8085/user";

export const isJsonContentType = (headers: Headers): boolean => {
  const contentType = headers.get("content-type");
  if (contentType) {
    return [
      "application/vnd.api+json",
      "application/json",
      "application/vnd.hal+json",
      "application/pdf",
      "multipart/form-data",
    ].includes(contentType.trimEnd());
  }
  return false;
};

export const processResponse = <T>(
  response: IResponse<T>,
  meta: FetchBaseQueryMeta | undefined,
  _arg: unknown
): IResponse<T> => {
  const requestUrl = meta?.request?.url;

  if (requestUrl?.includes("logout")) {
    localStorage.removeItem(Key.LOGGEDIN);
  }
  if (requestUrl && !requestUrl.includes("profile")) {
    toastSuccess(response.message);
  }
  console.log({ response });
  return response;
};

export const processError = (
  error: FetchBaseQueryError,
  _meta: FetchBaseQueryMeta | undefined,
  _arg: unknown
): FetchBaseQueryError => {
  if (isHttpError(error)) {
    const data = error.data as IResponse<void>;
    if (
      data.code === 401 &&
      data.status === "UNAUTHORIZED" &&
      data.message === "You are not logged in"
    ) {
      localStorage.setItem(Key.LOGGEDIN, "false");
    }
    toastError(data.message);
  } else if (isFetchError(error) || isParsingError(error)) {
    toastError(error.error);
  } else {
    toastError("An unknown error occurred.");
  }

  console.log({ error });
  return error;
};

function isHttpError(
  error: FetchBaseQueryError
): error is { status: number; data: IResponse<void> } {
  return typeof error.status === "number" && "data" in error;
}

function isFetchError(
  error: FetchBaseQueryError
): error is { status: "FETCH_ERROR"; error: string } {
  return error.status === "FETCH_ERROR";
}

function isParsingError(
  error: FetchBaseQueryError
): error is Extract<FetchBaseQueryError, { status: "PARSING_ERROR" }> {
  return error.status === "PARSING_ERROR";
}
