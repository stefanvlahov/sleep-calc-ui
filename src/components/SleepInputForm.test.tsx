import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from "vitest";
import SleepInputForm from "./SleepInputForm";
import userEvent from "@testing-library/user-event";

describe('SleepInputForm', () => {
    it('should render input fields for hours and minutes, and a submit button', () => {
        render(<SleepInputForm hoursValue={""} minutesValue={""} onHoursChange={() => vi.fn()}
                               onMinutesChange={() => vi.fn()} onSubmit={async () => {}}
                               selectedDate={new Date()} onDateChange={() => vi.fn()}/>);

        const hoursInput = screen.getByPlaceholderText('8');
        expect(hoursInput).toBeInTheDocument();

        const minutesInput = screen.getByPlaceholderText(/e\.g\., 30/i);
        expect(minutesInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', {name: /log sleep/i});
        expect(submitButton).toBeInTheDocument();
    })

    it('should call the onChange handler when the user types in the hours input', async () => {
        const user = userEvent.setup();
        const mockOnHoursChange = vi.fn();

        render(
            <SleepInputForm
                onHoursChange={mockOnHoursChange}
                onMinutesChange={() => vi.fn()}
                onSubmit={async () => {}}
                hoursValue=""
                minutesValue=""
                selectedDate={new Date()}
                onDateChange={() => vi.fn()}
            />
        );

        const hoursInput = screen.getByPlaceholderText('8');
        await user.type(hoursInput, '8');

        expect(mockOnHoursChange).toHaveBeenCalledWith('8');
    });

    it('should call onSubmit when the form is submitted', async () => {
        const user = userEvent.setup();
        const mockOnSubmit = vi.fn();

        render(
            <SleepInputForm hoursValue="8" minutesValue="30" onHoursChange={() => vi.fn()}
                            onMinutesChange={() => vi.fn()} onSubmit={mockOnSubmit}
                            selectedDate={new Date()} onDateChange={() => vi.fn()}/>
        );

        const submitButton = screen.getByRole('button', {name: /log sleep/i});
        await user.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalled();
    })
})