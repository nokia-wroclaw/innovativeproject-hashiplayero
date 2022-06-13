import { Button, TextField, Checkbox } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";

const TimeInput = ({
  value,
  timeEnable,
  handleChange,
  values,
}: {
  value: Date;
  timeEnable: boolean;
  handleChange: any;
  values: any;
}) => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <h5>Enable Time Limit</h5>
        <Checkbox
          checked={timeEnable}
          onChange={handleChange("enableTimeLimitInput")}
          inputProps={{ "aria-label": "controlled" }}
        />
      </div>

      <div className="form-element">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileTimePicker
            views={["minutes", "seconds"]}
            ampm={false}
            inputFormat="mm:ss"
            mask="__:__"
            label="Minutes and seconds"
            value={value}
            disabled={timeEnable}
            onChange={(newValue) => {
              if (newValue !== null) {
                handleChange({ ...values, timeLimitInput: newValue });
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
    </>
  );
};

export default TimeInput;
