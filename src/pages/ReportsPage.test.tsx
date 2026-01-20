import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ReportsPage from './ReportsPage';
import { AuthProvider } from '../context/AuthProvider';
import { fetchWithAuth } from '../utils/api';

// Mock the API
vi.mock('../utils/api', () => ({
    fetchWithAuth: vi.fn(),
}));

// Mock ResizeObserver for recharts
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock ResponsiveContainer to render children directly
vi.mock('recharts', async () => {
    const OriginalModule = await vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 800, height: 800 }}>{children}</div>
        ),
    };
});

describe('ReportsPage', () => {
    it('renders the reports page title', async () => {
        // Mock the API responses
        const mockWeeklyData = {
            netSleepDebt: 2.5,
            netSleepSurplus: 0,
            percentageChange: 10,
            dailyItems: [
                { date: '2026-01-13', hoursSlept: 7, debtChange: 0.5, surplusChange: 0 },
                { date: '2026-01-14', hoursSlept: 8, debtChange: 0, surplusChange: 0.5 },
            ]
        };

        const mockMonthlyData = {
            averageHoursSlept: 7.2,
            percentageChange: -5,
            weeklyItems: [
                { weekLabel: 'Week 1', averageHoursSlept: 6.5 },
                { weekLabel: 'Week 2', averageHoursSlept: 7.2 },
            ]
        };

        vi.mocked(fetchWithAuth).mockImplementation((url: string) => {
            if (url.includes('/weekly')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockWeeklyData)
                } as Response);
            }
            if (url.includes('/monthly')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockMonthlyData)
                } as Response);
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        render(
            <AuthProvider>
                <MemoryRouter>
                    <ReportsPage />
                </MemoryRouter>
            </AuthProvider>
        );

        expect(screen.getByText('Sleep Reports')).toBeInTheDocument();
        expect(screen.getByText('Loading reports...')).toBeInTheDocument();

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByText('Loading reports...')).not.toBeInTheDocument();
        }, { timeout: 2000 });

        expect(screen.getByText('Weekly Sleep Debt/Surplus')).toBeInTheDocument();
        expect(screen.getByText('Weekly Sleep Hours Trend')).toBeInTheDocument();
    });

    it('triggers export API call when export button is clicked', async () => {
        // Mock blob and URL.createObjectURL
        window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost:3000/123');
        window.URL.revokeObjectURL = vi.fn();

        const mockBlob = new Blob(['date,hours\n2025-01-01,8'], { type: 'text/csv' });

        vi.mocked(fetchWithAuth).mockImplementation((url: string) => {
            if (url.includes('/export')) {
                return Promise.resolve({
                    ok: true,
                    blob: () => Promise.resolve(mockBlob)
                } as Response);
            }
            // Return empty weekly/monthly data to pass the initial load
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ dailyItems: [], weeklyItems: [] }) // Minimal structure
            } as Response);
        });

        render(
            <AuthProvider>
                <MemoryRouter>
                    <ReportsPage />
                </MemoryRouter>
            </AuthProvider>
        );

        // Wait for initial load
        await waitFor(() => {
            expect(screen.queryByText('Loading reports...')).not.toBeInTheDocument();
        });

        const exportButton = screen.getByText('Export Report');
        exportButton.click();

        await waitFor(() => {
            expect(fetchWithAuth).toHaveBeenCalledWith(
                expect.stringContaining('/api/reports/export'),
                expect.any(Object),
                expect.any(Function)
            );
        });
    });
});

