import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForgotPasswordForm from './ForgotPasswordForm';
import { BrowserRouter } from 'react-router-dom';

describe('ForgotPasswordForm', () => {
    it('renders the form correctly', () => {
        render(
            <BrowserRouter>
                <ForgotPasswordForm onForgotPassword={vi.fn()} />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/forgot password form/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
    });

    it('validates email input', () => {
        const handleForgotPassword = vi.fn();
        render(
            <BrowserRouter>
                <ForgotPasswordForm onForgotPassword={handleForgotPassword} />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText(/enter your email/i);
        // HTML5 validation check reference, mainly relying on browser behavior for required/type=email
        expect(emailInput).toBeRequired();
        expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('submits the form with email', () => {
        const handleForgotPassword = vi.fn();
        render(
            <BrowserRouter>
                <ForgotPasswordForm onForgotPassword={handleForgotPassword} />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText(/enter your email/i);
        const submitButton = screen.getByRole('button', { name: /send reset link/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);

        expect(handleForgotPassword).toHaveBeenCalledWith('test@example.com');
    });
});
