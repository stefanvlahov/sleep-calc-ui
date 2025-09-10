import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import RegistrationForm from './RegistrationForm';

describe('RegistrationForm', () => {
    it('should render username and password fields, and a register button', () => {
        render(<RegistrationForm onRegister={vi.fn()} />);

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('should call onRegister with the user input when the form is submitted', async () => {
        const user = userEvent.setup();
        const mockOnRegister = vi.fn();

        render(<RegistrationForm onRegister={mockOnRegister} />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const registerButton = screen.getByRole('button', { name: /register/i });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        await user.click(registerButton);

        expect(mockOnRegister).toHaveBeenCalledWith('testuser', 'password123');
    })
})