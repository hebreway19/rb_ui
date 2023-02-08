import { FilterQuery, HydratedDocument, LeanDocument, Model, QueryOptions } from "mongoose";

export interface PopulateOptions {
  /** space delimited path(s) to populate */
  path: string;
  /** fields to select */
  select?: any;
  /** query conditions to match */
  match?: any;
  /** optional model to use for population */
  model?: string | Model<any>;
  /** optional query options like sort, limit, etc */
  options?: any;
  /** deep populate */
  populate?: PopulateOptions | Array<PopulateOptions>;
  /**
   * If true Mongoose will always set `path` to an array, if false Mongoose will
   * always set `path` to a document. Inferred from schema by default.
   */
  justOne?: boolean;
  /** transform function to call on every populated doc */
  transform?: (doc: any, id: any) => any;
}

export interface CustomLabels {
  totalDocs?: string | undefined;
  docs?: string | undefined;
  limit?: string | undefined;
  page?: string | undefined;
  nextPage?: string | undefined;
  prevPage?: string | undefined;
  hasNextPage?: string | undefined;
  hasPrevPage?: string | undefined;
  totalPages?: string | undefined;
  pagingCounter?: string | undefined;
  meta?: string | undefined;
}

export interface ReadOptions {
  pref: string;
  tags?: any[] | undefined;
}

export interface PaginateOptions {
  select?: object | string | undefined;
  collation?: import("mongodb").CollationOptions | undefined;
  sort?: object | string | undefined;
  populate?: PopulateOptions[] | string[] | PopulateOptions | string | PopulateOptions | undefined;
  projection?: any;
  lean?: boolean | undefined;
  leanWithId?: boolean | undefined;
  offset?: number | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  customLabels?: CustomLabels | undefined;
  /* If pagination is set to `false`, it will return all docs without adding limit condition. (Default: `true`) */
  pagination?: boolean | undefined;
  useEstimatedCount?: boolean | undefined;
  useCustomCountFn?: (() => Promise<number>) | undefined;
  forceCountFn?: boolean | undefined;
  allowDiskUse?: boolean | undefined;
  read?: ReadOptions | undefined;
  options?: QueryOptions | undefined;
}

export interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page?: number | undefined;
  totalPages: number;
  offset: number;
  prevPage?: number | null | undefined;
  nextPage?: number | null | undefined;
  pagingCounter: number;
  meta?: any;

  [customLabel: string]: T[] | number | boolean | null | undefined;
}

export type PaginateDocument<T, TMethods, TVirtuals, O extends PaginateOptions = {}> = O["lean"] extends true
                                                                                       ? O["leanWithId"] extends true
                                                                                         ? LeanDocument<T & { id: string }>
                                                                                         : LeanDocument<T>
                                                                                       : HydratedDocument<T, TMethods, TVirtuals>;

export interface PaginateModel<T, TQueryHelpers = {}, TMethods = {}, TVirtuals = {}>
  extends Model<T, TQueryHelpers, TMethods, TVirtuals> {
  paginate<O extends PaginateOptions>(
    query?: FilterQuery<T>,
    options?: O,
    callback?: (err: any, result: PaginateResult<PaginateDocument<T, TMethods, TVirtuals, O>>) => void
  ): Promise<PaginateResult<PaginateDocument<T, TMethods, TVirtuals, O>>>;
}
