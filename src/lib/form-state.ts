export type ActionState = {
  message: string;
  status: "idle" | "success" | "error";
};

export const emptyActionState: ActionState = {
  message: "",
  status: "idle",
};

export function successActionState(message: string): ActionState {
  return {
    message,
    status: "success",
  };
}

export function errorActionState(message: string): ActionState {
  return {
    message,
    status: "error",
  };
}
