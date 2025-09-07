import { render, screen, within, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./context/AuthContext.tsx";

const renderApp = () => {
    render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );
};

describe('App', () => {
    it('should show login/register forms, allow registration and login, then show the tracker', async () => {
        const user = userEvent.setup();

        global.fetch = vi.fn()
            .mockImplementationOnce((url) => {
                if (url.toString().endsWith('/register')) {
                    return Promise.resolve({ ok: true, text: () => Promise.resolve("Success")});
                }
                return Promise.reject(new Error('Unexpected register call'));
            })
            .mockImplementationOnce((url) => {
                if (url.toString().endsWith('/login')) {
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'fake-jwt-token' })});
                }
                return Promise.reject(new Error('Unexpected login call'));
            });

        renderApp();

        const registerHeading = screen.getByRole('heading', { name: /register/i });
        const registrationForm = registerHeading.closest('form');

        const usernameInput = within(registrationForm).getByLabelText(/username/i);
        const passwordInput = within(registrationForm).getByLabelText(/password/i);
        const registerButton = within(registrationForm).getByRole('button', { name: /register/i });

        await user.type(usernameInput, 'newuser');
        await user.type(passwordInput, 'password123');
        await user.click(registerButton);

        const loginHeading = screen.getByRole('heading', { name: /login/i });
        const loginForm = loginHeading.closest('form');

        const loginUsernameInput = within(loginForm).getByLabelText(/username/i);
        const loginPasswordInput = within(loginForm).getByLabelText(/password/i);
        const loginButton = within(loginForm).getByRole('button', { name: /login/i });

        await user.type(loginUsernameInput, 'newuser');
        await user.type(loginPasswordInput, 'password123');
        await user.click(loginButton);

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /sleep debt tracker/i})).toBeInTheDocument();
        });
    });
});