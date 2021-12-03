import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Fade, Typography } from "@mui/material";
import { SwitchTransition } from "react-transition-group";

export interface ValidRepoLabelProps {
    isValid: boolean | null;
}

export function ValidRepoLabel({ isValid }: ValidRepoLabelProps) {
    return (
        <SwitchTransition>
            <Fade key={isValid?.toString() || "null"}>
                <Typography variant="caption">
                    {isValid === true && (
                        <span>
                            <CheckIcon fontSize="inherit" color="success" /> This is a valid GitHub repository.
                        </span>
                    )}
                    {isValid === false && (
                        <span>
                            <CloseIcon fontSize="inherit" color="error" /> This is not a valid GitHub repository.
                        </span>
                    )}
                </Typography>
            </Fade>
        </SwitchTransition>
    );
}
