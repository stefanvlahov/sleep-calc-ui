import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from "vitest";
import SleepInputForm from "./SleepInputForm";
import userEvent from "@testing-library/user-event";

describe('SleepInputForm', () => {
    it('should render input fields for hours and minutes, and a submit button', () => {
        render(<SleepInputForm hoursValue={""} minutesValue={""} onHoursChange={() => {}} onMinutesChange={() => {}}/>);

        const hoursInput = screen.getByLabelText(/hours/i);
        expect(hoursInput).toBeInTheDocument();

        const minutesInput = screen.getByLabelText(/minutes/i);
        expect(minutesInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', {name: /record sleep/i});
        expect(submitButton).toBeInTheDocument();
    })

    it('should call the onChange handler when the user types in the hours input', async () => {
        const user = userEvent.setup();
        const mockOnHoursChange = vi.fn();

        render(
            <SleepInputForm
                onHoursChange={mockOnHoursChange}
                onMinutesChange={() => {
                }}
                hoursValue=""
                minutesValue=""
            />
        );

        const hoursInput = screen.getByLabelText(/hours/i);
        await user.type(hoursInput, '8');

        expect(mockOnHoursChange).toHaveBeenCalledWith('8');
    });
})