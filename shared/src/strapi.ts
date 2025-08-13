import { StrapiUser } from "./user";

export type StrapiErrorResponse = {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details:
      | {}
      | {
          key: string;
          path: string;
          source: string;
          param: string;
        };
  };
};
export type StrapiAuthResponse =
  | {
      jwt: string;
      user: StrapiUser;
    }
  | StrapiErrorResponse;

export type StrapiSignInRequest = {
  identifier: string;
  password: string;
};

export type StrapiSignUpRequest = {
  username: string;
  email: string;
  password: string;
};

export type StrapiSingleCollectionResponse<T> =
  | {
      data: T;
      meta: {};
    }
  | StrapiErrorResponse;

export type StrapiCollectionResponse<T> =
  | {
      data: T[];
      meta: {
        pagination: {
          page: number;
          pageSize: number;
          pageCount: number;
          total: number;
        };
      };
    }
  | StrapiErrorResponse;
