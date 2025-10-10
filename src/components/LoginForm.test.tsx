import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import LoginForm from './LoginForm';

describe('LoginForm', () => {
    it('should render username and password fields, and a login button', () => {
        render(<LoginForm onLogin={vi.fn()} />);

        expect(screen.getByPlaceholderText(/email or username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    })

    it('should call onLogin with the user input when the form is submitted', async () => {
        const user = userEvent.setup();
        const mockOnLogin = vi.fn();

        render(<LoginForm onLogin={mockOnLogin} />);

        const usernameInput = screen.getByPlaceholderText(/email or username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        await user.click(loginButton);

        expect(mockOnLogin).toHaveBeenCalledWith('testuser', 'password123');
    })
})