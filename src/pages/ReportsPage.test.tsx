import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ReportsPage from './ReportsPage';
import { AuthProvider } from '../context/AuthProvider';

// Mock the API and Auth
vi.mock('../utils/api', () => ({
    fetchWithAuth: vi.fn(),
}));

// Mock Recharts to avoid rendering issues in test environment if needed, 
// but usually it works fine with jsdom. If not, we can mock ResizeObserver.
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
        render(
            <AuthProvider>
                <MemoryRouter>
                    <ReportsPage />
                </MemoryRouter>
            </AuthProvider>
        );

        expect(screen.getByText('Sleep Reports')).toBeInTheDocument();
        expect(screen.getByText('Loading reports...')).toBeInTheDocument();

        // Wait for mock data to load (simulated delay in component)
        await waitFor(() => {
            expect(screen.queryByText('Loading reports...')).not.toBeInTheDocument();
        }, { timeout: 2000 });

        expect(screen.getByText('Weekly Sleep Debt/Surplus')).toBeInTheDocument();
        expect(screen.getByText('Weekly Sleep Hours Trend')).toBeInTheDocument();
    });
});
