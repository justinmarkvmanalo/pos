export type ActionState = {
  message: string;
  status: "idle" | "success" | "error";
  token: number;
};

export const emptyActionState: ActionState = {
  message: "",
  status: "idle",
  token: 0,
};

export function successActionState(message: string): ActionState {
  return {
    message,
    status: "success",
    token: Date.now(),
  };
}

export function errorActionState(message: string): ActionState {
  return {
    message,
    status: "error",
    token: Date.now(),
  };
}
