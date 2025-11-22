import { render, screen, within, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { MemoryRouter } from "react-router-dom";

const renderApp = () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </AuthProvider>
    );
};

describe('App', () => {
    it('should show login/register forms, allow registration and login, then show the tracker', async () => {
        const user = userEvent.setup();

        global.fetch = vi.fn()
            .mockImplementation((url: string | URL) => {
                // Use string matching to be safer with relative/absolute URLs
                const urlString = url.toString();
                if (urlString.endsWith('/register')) {
                    return Promise.resolve({ ok: true, text: () => Promise.resolve("Success")});
                }
                if (urlString.endsWith('/login')) {
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'fake-jwt-token' })});
                }
                // Mock the initial state fetch that happens after login
                if (urlString.endsWith('/state')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({ sleepDebt: 0, sleepSurplus: 0 })
                    });
                }
                // Mock the history fetch for the dashboard
                if (urlString.endsWith('/history')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve([])
                    });
                }

                return Promise.reject(new Error(`Unexpected call: ${urlString}`));
            });

        renderApp();

        const signUpToggle = screen.getByRole('button', { name: /sign up/i });
        await user.click(signUpToggle);

        const registrationForm = screen.getByRole('form', { name: /registration form/i});

        const usernameInput = within(registrationForm).getByLabelText(/username/i);
        const passwordInput = within(registrationForm).getByLabelText(/password/i);
        const registerButton = within(registrationForm).getByRole('button', { name: /register/i });

        await user.type(usernameInput, 'newuser');
        await user.type(passwordInput, 'password123');
        await user.click(registerButton);

        const loginToggle = screen.getByRole('button', { name: /login/i });
        await user.click(loginToggle);

        const loginForm = screen.getByRole('form', { name: /login form/i});

        const loginUsernameInput = within(loginForm).getByPlaceholderText(/email or username/i)
        const loginPasswordInput = within(loginForm).getByPlaceholderText(/password/i)
        const loginSubmitButton = within(loginForm).getByRole('button', { name: /login/i });

        await user.type(loginUsernameInput, 'newuser');
        await user.type(loginPasswordInput, 'password123');
        await user.click(loginSubmitButton);

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
            expect(screen.getByText(/Sleep Dashboard/i)).toBeInTheDocument();
        });
    });
});