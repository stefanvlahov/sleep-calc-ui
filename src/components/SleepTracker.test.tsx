import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import SleepTracker from "./SleepTracker";
import { AuthProvider } from "../context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import * as api from '../utils/api';

// Mock fetchWithAuth from the utils module (Option A)
vi.mock('../utils/api.ts', () => ({
    fetchWithAuth: vi.fn(),
}));

vi.mock('../hooks/useAuth.ts', () => ({
    useAuth: () => ({
        token: 'fake-jwt-token',
        logout: vi.fn(),
    }),
}));

const renderWithProviders = (ui: React.ReactNode) => {
    return render(
        <AuthProvider>
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </AuthProvider>
    );
};

// Helper to construct a real Response object with JSON body to satisfy strict typings
const jsonResponse = (data: unknown, init?: ResponseInit) =>
    new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
        ...init,
    });

describe('SleepTracker', () => {
    it('should fetch and display the initial sleep state on render', async () => {
        const fetchWithAuthMock = vi.mocked(api.fetchWithAuth);
        fetchWithAuthMock.mockResolvedValue(
            jsonResponse({ sleepDebt: 5.0, sleepSurplus: 1.0 }, { status: 200, statusText: 'OK' })
        );


        renderWithProviders(<SleepTracker />);

        await waitFor(() => {
            expect(fetchWithAuthMock).toHaveBeenCalledWith('/api/sleep/state', {}, expect.any(Function));
            expect(screen.getByText(/5.0 hours/i)).toBeInTheDocument();
            expect(screen.getByText(/1.0 hours/i)).toBeInTheDocument();
        });
    });

    it('should submit new sleep data and display the updated state', async () => {
        const user = userEvent.setup();

        const fetchWithAuthMock = vi.mocked(api.fetchWithAuth);

        fetchWithAuthMock
            .mockResolvedValueOnce(
                jsonResponse({ sleepDebt: 5.0, sleepSurplus: 1.0 }, { status: 200, statusText: 'OK' })
            )
            .mockResolvedValueOnce(
                jsonResponse({ sleepDebt: 0.0, sleepSurplus: 2.0 }, { status: 200, statusText: 'OK' })
            );

        renderWithProviders(<SleepTracker />);

        await screen.findByText(/5.0 hours/i);

        const hoursInput = screen.getByPlaceholderText('8');
        const minutesInput = screen.getByPlaceholderText(/e\.g\., 30/i);
        const logSleepButton = screen.getByRole('button', { name: /log sleep/i });

        await user.type(hoursInput, '9');
        await user.type(minutesInput, '30');
        await user.click(logSleepButton);

        await waitFor(() => {
            // Assert the POST call in a type-safe way without assigning any-typed matchers
            const lastCall = fetchWithAuthMock.mock.calls.at(-1);
            expect(lastCall).toBeDefined();

            const [postUrl, postInit] = lastCall as [string, RequestInit, (status: number) => void];

            // URL and method
            expect(postUrl).toBe('/api/sleep');
            expect(postInit.method).toBe('POST');

            // Headers may be Headers | string[][] | Record<string, string>
            const headers = postInit.headers;
            let contentType: string | null = null;
            if (headers instanceof Headers) {
                contentType = headers.get('Content-Type');
            } else if (Array.isArray(headers)) {
                const entry = headers.find(([k]) => k.toLowerCase() === 'content-type');
                contentType = entry ? entry[1] : null;
            } else if (headers && typeof headers === 'object') {
                const h = headers;
                contentType = h['Content-Type'] ?? h['content-type'] ?? null;
            }
            expect(contentType).toBe('application/json');

            // Body should be a JSON string with expected fields
            expect(typeof postInit.body).toBe('string');
            const parsed = JSON.parse(postInit.body as string) as { timeSlept: string; date: string };
            expect(parsed.timeSlept).toBe('09:30');
            expect(typeof parsed.date).toBe('string');

            expect(screen.getByText(/0.0 hours/i)).toBeInTheDocument();
            expect(screen.getByText(/2.0 hours/i)).toBeInTheDocument();
        });
    });
});