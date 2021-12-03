import { Link, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";

export function Header() {
    return (
        <Box component="header" mt={8} py={6}>
            <Stack direction="row" alignItems="center">
                <Box px={2}>
                    <Image src="/todoscan.svg" height={72} width={72} alt="todoscan Logo" draggable={false} />
                </Box>
                <Stack direction="column">
                    <Typography variant="h2">
                        <Link href="/" color="inherit" underline="none">
                            todoscan
                        </Link>
                    </Typography>
                    <Typography>
                        Helps you find{" "}
                        <Typography display="inline-block" fontFamily="monospace" color="green">
                            &#47;&#47;
                        </Typography>{" "}
                        <Typography display="inline-block" fontFamily="monospace" color="green">
                            TODO:
                        </Typography>{" "}
                        comments in a snap.
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}
