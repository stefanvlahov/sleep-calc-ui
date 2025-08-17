import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import userEvent from '@testing-library/user-event';

describe('App', () => {
    it('should allow the user to record sleep and see the updated state', async () => {
        const user = userEvent.setup();

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ sleepDebt: 1.0, sleepSurplus: 0.5 }),
        });

        render(<App />)

        const hoursInput = screen.getByLabelText(/hours/i);
        const minutesInput = screen.getByLabelText(/minutes/i);
        const submitButton = screen.getByRole('button', { name: /record sleep/i });

        await user.type(hoursInput, '8');
        await user.type(minutesInput, '30');

        await user.click(submitButton);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/sleep',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeSlept: '8:30' }),
            })
        );

        const debtDisplay = await screen.findByText(/current sleep debt: 1.0/i);
        const surplusDisplay = await screen.findByText(/current sleep surplus 0.5/i);

        expect(debtDisplay).toBeInTheDocument();
        expect(surplusDisplay).toBeInTheDocument();
    })
})