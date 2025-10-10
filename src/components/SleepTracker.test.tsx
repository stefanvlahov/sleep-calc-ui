import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import SleepTracker from "./SleepTracker";
import { AuthProvider } from "../context/AuthProvider";

vi.mock('../hooks/useAuth.ts', () => ({
    useAuth: () => ({
        token: 'fake-jwt-token',
        logout: vi.fn(),
    }),
}));

describe('SleepTracker', () => {
    it('should fetch and display the initial sleep state on render', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ sleepDebt: 5.0, sleepSurplus: 1.0 }),
        });

        render(
            <AuthProvider>
                <SleepTracker />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/sleep/state', {
                headers: { Authorization: `Bearer fake-jwt-token` },
            });
            expect(screen.getByText(/5.0 hours/i)).toBeInTheDocument();
            expect(screen.getByText(/1.0 hours/i)).toBeInTheDocument();
        });
    });

    it('should submit new sleep data and display the updated state', async () => {
        const user = userEvent.setup();

        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ sleepDebt: 5.0, sleepSurplus: 1.0 }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ sleepDebt: 0.0, sleepSurplus: 2.0 }),
            });

        render(
            <AuthProvider>
                <SleepTracker />
            </AuthProvider>
        );

        await screen.findByText(/5.0 hours/i);

        const hoursInput = screen.getByPlaceholderText('8');
        const minutesInput = screen.getByPlaceholderText(/e\.g\., 30/i);
        const logSleepButton = screen.getByRole('button', { name: /log sleep/i });

        await user.type(hoursInput, '9');
        await user.type(minutesInput, '30');
        await user.click(logSleepButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/sleep', expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer fake-jwt-token`,
                },
                body: JSON.stringify({ timeSlept: '09:30' }),
            }));

            expect(screen.getByText(/0.0 hours/i)).toBeInTheDocument();
            expect(screen.getByText(/2.0 hours/i)).toBeInTheDocument();
        })
    })
})