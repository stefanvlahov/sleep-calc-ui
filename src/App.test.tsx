import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('should render the main title', () => {
        render(<App />);

        const mainTitle = screen.getByRole('heading', { name: /sleep debt tracker/i });
        expect(mainTitle).toBeInTheDocument();

        const sleepForm = screen.getByRole('form');
        expect(sleepForm).toBeInTheDocument();
    })
})