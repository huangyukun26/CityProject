import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { useAuthStore } from "../store/authStore";

beforeEach(() => {
  useAuthStore.setState({ user: null });
});

it("redirects to login when unauthenticated", async () => {
  render(
    <MemoryRouter initialEntries={["/app/dashboard"]}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("城市植被覆盖率平台")).toBeInTheDocument();
  });
});

it("allows access when authenticated", async () => {
  useAuthStore.setState({ user: { username: "test", role: "User" } });
  render(
    <MemoryRouter initialEntries={["/app/dashboard"]}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("项目概览")).toBeInTheDocument();
  });
});
