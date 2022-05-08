interface IMark{
    value: number;
    label: string;
}

export default function createMarks() {
    const marks: IMark[] = [];
    for (let i = 2; i <= 10; i++) { // # TOOD change loop
        marks.push({
            value: i,
            label: i.toString(),
        });
    }
    return marks;
}