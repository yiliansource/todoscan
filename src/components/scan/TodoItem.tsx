import { Alert, AlertTitle, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { ScanItem } from "src/lib/types";

export interface TodoItemProps {
    item: ScanItem;
}

export function TodoItem({ item }: TodoItemProps) {
    if (item.type === "TODO") {
        return (
            <Alert sx={{ position: "relative" }}>
                <AlertTitle>TODO</AlertTitle>

                <Box m={1.5} sx={{ position: "absolute", top: 0, right: 0 }}>
                    <Link href={item.url} target="_blank" rel="noopener">
                        {item.path}:{item.line}
                    </Link>
                </Box>

                <Typography>{item.content}</Typography>
                <SyntaxHighlighter language={item.path.split(".").reverse()[0]} style={materialLight}>
                    {item.code}
                </SyntaxHighlighter>
            </Alert>
        );
    }

    return null;
}
