import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as api from '../utils/api';
import { HistoryPage } from './HistoryPage';
import { AuthProvider } from '../context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';


vi.mock('../utils/api.ts', () => ({
    fetchWithAuth: vi.fn(),
}));

vi.mock('../hooks/useAuth.ts', () => ({
    useAuth: () => ({
        logout: vi.fn(),
        token: 'fake-token',
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

describe('HistoryPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    // Use a properly typed mocked function to avoid "any" casts
    const fetchWithAuthMock = vi.mocked(api.fetchWithAuth);
    
    // Helper to construct a real Response object with JSON body
    const jsonResponse = (data: unknown, init?: ResponseInit) =>
        new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
            ...init,
        });

    it('should render the page title and calendar container', () => {
        fetchWithAuthMock.mockResolvedValue(
            jsonResponse([], { status: 200, statusText: 'OK' })
        );

        renderWithProviders(<HistoryPage />);

        expect(screen.getByText(/Historical Data/i)).toBeInTheDocument();
    });

    it('should fetch history data for the current month on load', async () => {
        fetchWithAuthMock.mockResolvedValue(
            jsonResponse([], { status: 200, statusText: 'OK' })
        );

        renderWithProviders(<HistoryPage />);

        await waitFor(() => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const fmt = (d: Date) => d.toISOString().split('T')[0];

            const expectedStart = fmt(start);
            const expectedEnd = fmt(end);

            expect(api.fetchWithAuth).toHaveBeenCalledWith(
                `/api/sleep/history/range?from=${expectedStart}&to=${expectedEnd}`,
                expect.anything(),
                expect.anything()
            );
        });
    });

    it('should display an error message if the API call fails', async () => {
        // Simulate a non-OK response; body can be empty or contain error text
        fetchWithAuthMock.mockResolvedValue(
            new Response('Server Error', { status: 500, statusText: 'Server Error' })
        );

        renderWithProviders(<HistoryPage />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch history data/i)).toBeInTheDocument();
        });
    });

    it('should display sleep details when data is present for the selected date', async () => {
        const today = new Date().toISOString().split('T')[0];
        const mockData = [{
            sleepDate: today,
            hoursSlept: 7.5,
            sleepDebt: 0.0,
            sleepSurplus: 1.5
        }];

        fetchWithAuthMock.mockResolvedValue(
            jsonResponse(mockData, { status: 200, statusText: 'OK' })
        );

        renderWithProviders(<HistoryPage />);

        await waitFor(() => {
            expect(screen.getByText('7.50 hrd')).toBeInTheDocument();
            expect(screen.getByText('+1.50 hrs')).toBeInTheDocument();
        });
    })

})
