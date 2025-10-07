import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import AuthPage from "./AuthPage";

describe('AuthPage', () => {
    it('should render the login form by default', () => {
        render(<AuthPage onRegister={vi.fn()} onLogin={vi.fn()} error={null} />);

        const loginForm = screen.getByRole('form', { name: /login form/i });
        expect(loginForm).toBeInTheDocument();

        expect(screen.queryByRole('form', { name: /registration form/i })).not.toBeInTheDocument();
    });

    it('should switch to the registration form when the "Sign Up" button is clicked', async () => {
        const user = userEvent.setup();
        render(<AuthPage onRegister={vi.fn()} onLogin={vi.fn()} error={null} />);

        const signUpButton = screen.getByRole('button', { name: /sign up/i });

        await user.click(signUpButton);

        const registrationForm = screen.getByRole('form', { name: /registration form/i });
        expect(registrationForm).toBeInTheDocument();
        expect(screen.queryByRole('form', { name: /login form/i })).not.toBeInTheDocument();
    })
})