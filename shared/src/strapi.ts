export type StrapiErrorResponse = {
  data: null;
  error: {
    status: number;
    name?: string;
    message: string;
    statusCode?: number;
    error?: string;
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
      user: {
        id: number;
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: string;
        blocked: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
      };
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
