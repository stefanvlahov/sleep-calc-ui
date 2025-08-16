type SleepInputFormProps = {
    hoursValue: string;
    minutesValue: string;
    onHoursChange: (value: string) => void;
    onMinutesChange: (value: string) => void;
};

function SleepInputForm({
                            hoursValue,
                            minutesValue,
                            onHoursChange,
                            onMinutesChange
                        }: SleepInputFormProps) {
    return (
        <form aria-label={"Sleep Input Form"}>
            <div>
                <label htmlFor="hours">Hours</label>
                <input id="hours" type="number" value={hoursValue} onChange={(e) => onHoursChange(e.target.value)}/>
            </div>

            <div>
                <label htmlFor="minutes">Minutes</label>
                <input id="minutes" type="number" value={minutesValue}
                       onChange={(e) => onMinutesChange(e.target.value)}/>
            </div>

            <button type="submit">Record Sleep</button>
        </form>
    );
}

export default SleepInputForm;