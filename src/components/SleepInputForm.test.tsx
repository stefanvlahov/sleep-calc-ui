import { render, screen } from '@testing-library/react';
import { describe, it, expect } from "vitest";
import SleepInputForm from "./SleepInputForm";

describe('SleepInputForm', () => {
    it('should render input fields for hours and minutes, and a submit button', () => {
        render(<SleepInputForm />);

        const hoursInput = screen.getByLabelText(/hours/i);
        expect(hoursInput).toBeInTheDocument();

        const minutesInput = screen.getByLabelText(/minutes/i);
        expect(minutesInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: /record sleep/i});
        expect(submitButton).toBeInTheDocument();
    })
})