import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export function Header() {
    return (
        <Box component="header" mt={12} py={6}>
            <Typography variant="h2">todoscan 🔍</Typography>
            <Typography>Helps you find TODO comments in a snap.</Typography>
        </Box>
    );
}
