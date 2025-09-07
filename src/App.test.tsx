import { render, screen, waitFor } from "@testing-library/react";
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
    it('should show login/register forms when logged out, then show the tracker when logged in', async () => {
        const user = userEvent.setup();

        global.fetch = vi.fn()
            .mockImplementationOnce((url) => {
                if (url.toString().endsWith('/register')) {
                    return Promise.resolve({ ok: true });
                }
                return Promise.resolve({ ok: false, status: 404 });
        })
            .mockImplementationOnce((url) => {
                if (url.toString().endsWith('/login')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({ token: 'fake-jwt-token' }),
                    });
                }
                return Promise.resolve({ ok: false, status: 404 });
            });

        renderApp();

        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /sleep debt tracker/i })).not.toBeInTheDocument();

        const usernameInput = screen.getAllByLabelText(/username/i)[0];
        const passwordInput = screen.getAllByLabelText(/password/i)[0];
        const registerButton = screen.getByRole('button', { name: /register/i });

        await user.type(usernameInput, 'newuser');
        await user.type(passwordInput, 'password123');
        await user.click(registerButton);

        const loginUsernameInput = screen.getByLabelText(/username/i);
        const loginPasswordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(loginUsernameInput, 'newuser');
        await user.type(loginPasswordInput, 'password123');
        await user.click(loginButton);

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /sleep debt tracker/i})).toBeInTheDocument();
            expect(screen.getByRole('form', { name: /sleep input form/i })).toBeInTheDocument();
        });
    });
});