import React from "react";
import { Query } from "../../models/IDocument";
import { documentAPI } from "../../services/DocumentService";
import DocumentLoader from "./DocumentLoader";
import Document from "./Document";

const Documents = () => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = React.useState<Query>({
    page: 0,
    size: 4,
    name: "",
  });
  const {
    data: documentData,
    error: _error,
    isSuccess: _isSuccess,
    isLoading,
    refetch: _refetch,
  } = documentAPI.useFetchDocumentsQuery(query);
  const [
    uploadDocuments,
    {
      data: _uploadData,
      isLoading: _uploadLoading,
      error: _uploadError,
      isSuccess: _uploadSuccess,
    },
  ] = documentAPI.useUploadDocumentsMutation();

  const selectDocuments = () => inputRef.current?.click();

  const goToPage = (direction: string) => {
    setQuery((prev) => ({
      ...prev,
      page: prev.page + (direction === "back" ? -1 : 1),
    }));
  };

  const onUploadDocuments = async (documents: FileList) => {
    if (documents) {
      const form = new FormData();
      Array.from(documents).forEach((document) =>
        form.append("files", document, document.name)
      );
      await uploadDocuments(form);
    }
  };

  if (isLoading) {
    return <DocumentLoader />;
  }

  // Safely extract properties with default values
  const documents = documentData?.data?.documents;
  const content = documents?.content ?? [];
  const contentLength = content.length;
  const pageNumber = documents?.number ?? 0;
  const pageSize = documents?.size ?? 0;
  const totalElements = documents?.totalElements ?? 0;
  const totalPages = documents?.totalPages ?? 0;

  return (
    <div className="container mtb">
      <div className="row">
        <div className="col-lg-12">
          <div className="align-items-center row">
            <div className="col-lg-4">
              <div className="mb-3 mb-lg-0">
                {contentLength > 0 && (
                  <h6 className="fs-16 mb-0">{`Showing ${
                    pageNumber * pageSize + 1
                  } - ${
                    pageNumber * pageSize + contentLength
                  } of ${totalElements} results`}</h6>
                )}
              </div>
            </div>
            <div className="col-lg-8">
              <div className="candidate-list-widgets">
                <div className="row">
                  <div className="col-lg-6 mb-2">
                    <div className="selection-widget">
                      <input
                        type="search"
                        onChange={(event) =>
                          setQuery((prev) => {
                            return {
                              ...prev,
                              page: 0,
                              name: event.target.value,
                            };
                          })
                        }
                        name="name"
                        className="form-control"
                        id="email"
                        placeholder="Search documents"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="selection-widget">
                      <select
                        onChange={(event) =>
                          setQuery((prev) => {
                            return { ...prev, size: +event.target.value };
                          })
                        }
                        className="form-select"
                        data-trigger="true"
                        name="size"
                        aria-label="Select page size"
                      >
                        <option value="4">Per page (4)</option>
                        <option value="6">6</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="selection-widget mt-2 mt-lg-0">
                      <button
                        type="button"
                        onClick={selectDocuments}
                        className="btn btn-primary w-100"
                        style={{ display: "inline-block" }}
                      >
                        <i className="bi bi-upload upload-icon"></i>
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="candidate-list">
            {documentData?.data.documents.content?.length === 0 && (
              <h4
                className="card mt-4 align-items-center row"
                style={{ border: "none", boxShadow: "none" }}
              >
                No documents found
              </h4>
            )}
            {documentData?.data.documents.content.map((document) => (
              <Document {...document} key={document.id} />
            ))}
          </div>
        </div>
      </div>
      {contentLength > 0 && totalPages > 1 && (
        <div className="row">
          <div className="mt-4 pt-2 col-lg-12">
            <nav aria-label="Page navigation example">
              <div className="pagination job-pagination mb-0 justify-content-center">
                <li className="page-item">
                  <a
                    onClick={() => goToPage("back")}
                    className={`page-link ' ${
                      0 === query.page ? "disabled" : undefined
                    }`}
                  >
                    <i className="bi bi-chevron-double-left"></i>
                  </a>
                </li>
                {[
                  ...Array(documentData?.data?.documents.totalPages).keys(),
                ].map((page, _index) => (
                  <li key={page} className="page-item">
                    <a
                      onClick={() =>
                        setQuery((prev) => {
                          return { ...prev, page };
                        })
                      }
                      className={`page-link ' ${
                        page === query.page ? "active" : undefined
                      }`}
                    >
                      {page + 1}
                    </a>
                  </li>
                ))}
                <li className="page-item">
                  <a
                    onClick={() => goToPage("forward")}
                    className={`page-link ' ${
                      documentData?.data?.documents.totalPages ===
                      query.page + 1
                        ? "disabled"
                        : undefined
                    }`}
                  >
                    <i className="bi bi-chevron-double-right"></i>
                  </a>
                </li>
              </div>
            </nav>
          </div>
        </div>
      )}
      <div style={{ display: "none" }}>
        <input
          type="file"
          ref={inputRef}
          onChange={(event) => {
            if (event.target.files) {
              onUploadDocuments(event.target.files);
            }
          }}
          name="file"
          accept="*"
          multiple
        />
      </div>
    </div>
  );
};

export default Documents;
