import {
    Slider,
} from "@mui/material";

interface IMark {
    value: number;
    label: string;
}

function createMarks() {
    const marks: IMark[] = [];
    for (let i = 2; i <= 10; i++) { // # TOOD change loop
        marks.push({
            value: i,
            label: i.toString(),
        });
    }
    return marks;
}

function valueLabelFormat(value: number) {
    const marks = createMarks();
    return marks.findIndex((mark) => mark.value === value) + 2;
}

const PlayersInput = ({ value, handleChange, isAdmin }: { value?: number | number[], handleChange: any, isAdmin: boolean }) => {
    const marks = createMarks();

    return (
        <>
            <Slider
                disabled={!isAdmin}
                aria-label="Custom marks"
                marks={marks}
                valueLabelDisplay="auto"
                valueLabelFormat={valueLabelFormat}
                value={value}
                onChange={handleChange}
                min={2}
                step={1}
                max={10}
            />
        </>
    )
};

export default PlayersInput;
