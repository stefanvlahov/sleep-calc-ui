import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AuthLayout from './AuthLayout';

describe('AuthLayout', () => {
    it('renders children correctly', () => {
        render(
            <AuthLayout>
                <div>Test Child Content</div>
            </AuthLayout>
        );

        expect(screen.getByText('Test Child Content')).toBeInTheDocument();
        expect(screen.getByText('SleepTracker')).toBeInTheDocument();
        // The image is hidden on small screens but present in DOM
        expect(screen.getByAltText('Person sleeping peacefully')).toBeInTheDocument();
    });

    it('renders title and subtitle when provided', () => {
        render(
            <AuthLayout title="Test Title" subtitle="Test Subtitle">
                <div>Content</div>
            </AuthLayout>
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
        render(
            <AuthLayout error="Something went wrong">
                <div>Content</div>
            </AuthLayout>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
});
