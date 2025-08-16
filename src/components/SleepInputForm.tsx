function SleepInputForm() {
    return (
        <form aria-label={"Sleep Input Form"}>
            <div>
                <label htmlFor="hours">Hours</label>
                <input id="hours" type="number" />
            </div>

            <div>
                <label htmlFor="minutes">Minutes</label>
                <input id="minutes" type="number" />
            </div>

            <button type="submit">Record Sleep</button>
        </form>
    );
}

export default SleepInputForm;