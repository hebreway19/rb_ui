import { contentType } from "mime-types";

export enum HttpContentType {
  JSON = contentType("json"),
  TEXT = contentType("text"),
  BLOB = contentType("application/octet-stream"),
  MULTIPART = contentType("multipart/form-data")
}