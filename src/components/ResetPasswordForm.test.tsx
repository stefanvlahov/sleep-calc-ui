import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResetPasswordForm from './ResetPasswordForm';
import { BrowserRouter } from 'react-router-dom';

describe('ResetPasswordForm', () => {
    it('renders the form correctly', () => {
        render(
            <BrowserRouter>
                <ResetPasswordForm onResetPassword={vi.fn()} />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/reset password form/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/^new password$/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/confirm new password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^reset password$/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
    });

    it('shows error when passwords do not match', () => {
        const handleResetPassword = vi.fn();
        render(
            <BrowserRouter>
                <ResetPasswordForm onResetPassword={handleResetPassword} />
            </BrowserRouter>
        );

        const passwordInput = screen.getByPlaceholderText(/^new password$/i);
        const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
        const submitButton = screen.getByRole('button', { name: /^reset password$/i });

        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmInput, { target: { value: 'password456' } });
        fireEvent.click(submitButton);

        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        expect(handleResetPassword).not.toHaveBeenCalled();
    });

    it('submits the form when passwords match', () => {
        const handleResetPassword = vi.fn();
        render(
            <BrowserRouter>
                <ResetPasswordForm onResetPassword={handleResetPassword} />
            </BrowserRouter>
        );

        const passwordInput = screen.getByPlaceholderText(/^new password$/i);
        const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
        const submitButton = screen.getByRole('button', { name: /^reset password$/i });

        fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
        fireEvent.change(confirmInput, { target: { value: 'newpassword' } });
        fireEvent.click(submitButton);

        expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
        expect(handleResetPassword).toHaveBeenCalledWith('newpassword');
    });
});
