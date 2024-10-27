import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IResponse } from "../models/IResponse";
import {
  isJsonContentType,
  processError,
  processResponse,
} from "../utils/requestutils";
import { Http } from "../enum/http.method";
import { Document, DocumentForm, Documents, Query } from "../models/IDocument";
import { Page } from "../models/IPage";
const baseUrl = "http://localhost:8085/documents";

export const documentAPI = createApi({
  reducerPath: "documentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    isJsonContentType,
  }),
  tagTypes: ["Documents"],
  endpoints: (builder) => ({
    fetchDocuments: builder.query<IResponse<Page>, Query>({
      query: (query) => ({
        url: `/search?page=${query.page}&size=${query.size}&name=${query.name}`,
        method: Http.GET,
      }),
      transformErrorResponse: processError,
      providesTags: (_result, _error) => ["Documents"],
    }),
    uploadDocuments: builder.mutation<IResponse<Documents>, FormData>({
      query: (form) => ({
        url: "/upload",
        method: Http.POST,
        body: form,
      }),
      transformResponse: processResponse<Documents>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => (error ? [] : ["Documents"]),
    }),
    fetchDocument: builder.query<IResponse<Document>, string>({
      query: (documentId) => ({
        url: `/${documentId}`,
        method: Http.GET,
      }),
      transformErrorResponse: processError,
      providesTags: (_result, _error) => ["Documents"],
    }),
    updateDocument: builder.mutation<IResponse<Document>, DocumentForm>({
      query: (document) => ({
        url: ``,
        method: Http.PATCH,
        body: document,
      }),
      transformResponse: processResponse<Document>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => (error ? [] : ["Documents"]),
    }),
    downloadDocument: builder.mutation<Blob, string>({
      query: (documentName) => ({
        url: `/download/${documentName}`,
        method: Http.GET,
        responseHandler: (response) => response.blob(),
      }),
      transformErrorResponse: processError,
    }),
  }),
});
