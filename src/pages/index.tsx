import { LoadingButton } from "@mui/lab";
import { Alert, AlertTitle, Link, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { ScanItem, ScanResult } from "src/lib/types";

export default function Index() {
    const [data, setData] = useState<ScanResult | null>(null);
    const [error, setError] = useState<{ message: string } | null>(null);
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [scanning, setScanning] = useState(false);

    const scan = () => {
        setScanning(true);

        (async function () {
            const res = await fetch(`/api/scan?owner=${owner}&repo=${repo}`);
            const body = await res.json();

            if (res.ok) {
                setData(body as ScanResult);
                setError(null);
            } else {
                setData(null);
                setError(body as { message: string });
            }

            setScanning(false);
        })();
    };

    return (
        <>
            <Box mb={4}>
                <Stack direction="row" alignItems="center" spacing={0.3}>
                    <Typography>https://github.com/</Typography>
                    <TextField size="small" label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
                    <Typography>/</Typography>
                    <TextField size="small" label="Repository" value={repo} onChange={(e) => setRepo(e.target.value)} />
                    <LoadingButton color="primary" variant="contained" loading={scanning} onClick={scan}>
                        Scan
                    </LoadingButton>
                </Stack>
            </Box>

            {error && <Alert severity="error">{error.message}</Alert>}

            {data && (
                <Box>
                    <Typography mb={1} variant="body2" color="GrayText">
                        {data.items.length} comment(s) found.
                    </Typography>
                    <Stack spacing={1}>{data.items.map((item) => renderScanItem(item))}</Stack>
                </Box>
            )}

            {/* <JsonView data={data || error} /> */}
        </>
    );
}

function renderScanItem(item: ScanItem) {
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
