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
  | {
      data: null;
      error: {
        status: number;
        name: string;
        message: string;
        details: any;
      };
    };

export type StrapiSignInRequest = {
  identifier: string;
  password: string;
};

export type StrapiSignUpRequest = {
  username: string;
  email: string;
  password: string;
};
