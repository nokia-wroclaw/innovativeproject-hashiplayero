import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Checkbox from "@mui/material/Checkbox";



const VisibilityInput = ({ value, handleChange }: { value: boolean, handleChange: any }) => {

    return (
        <>
            {
                value ? "Prywatne" : "Publiczne"
            }
            <Checkbox
                checked={value}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
                icon={<LockOpenIcon />}
                checkedIcon={<LockIcon />}
            />
        </>
    )
}

export default VisibilityInput;