import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";

// Mock the supabase client module. Each test sets the session via the mock.
const getSession = vi.fn();
const onAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: vi.fn() } },
}));

vi.mock("@/lib/supabase", () => ({
  get supabase() {
    return mockSupabase;
  },
}));

let mockSupabase: unknown;

const renderGate = () =>
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/protected" element={<div>Korumalı içerik</div>} />
        </Route>
        <Route path="/login" element={<div>Giriş sayfası</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  getSession.mockReset();
  mockSupabase = { auth: { getSession, onAuthStateChange } };
});

describe("RequireAuth", () => {
  it("renders the protected outlet when a session exists", async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: "1" } } } });
    renderGate();
    expect(await screen.findByText("Korumalı içerik")).toBeInTheDocument();
  });

  it("redirects to /login when there is no session", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    renderGate();
    expect(await screen.findByText("Giriş sayfası")).toBeInTheDocument();
  });

  it("redirects to /login when supabase is not configured", async () => {
    mockSupabase = null;
    renderGate();
    await waitFor(() =>
      expect(screen.getByText("Giriş sayfası")).toBeInTheDocument(),
    );
  });
});
