type Success<T> = T extends undefined
  ? { status: true; message?: string }
  : { status: true; data: T; message?: string };

type Failure = { status: false; message: string };

export type ServerActionResponse<T = undefined> = Success<T> | Failure;
