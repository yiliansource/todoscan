import { Alert, Button, Collapse, Divider, Fade, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Octokit } from "@octokit/rest";
import { useState } from "react";
import { SwitchTransition } from "react-transition-group";

import { RepositoryIdentifier } from "src/lib/github";
import { ScanResult } from "src/lib/types";

import { TodoItem } from "./TodoItem";
import { OwnerNamePicker } from "./repoPickers/OwnerNamePicker";
import { RepoUrlPicker } from "./repoPickers/RepoUrlPicker";

const octokit = new Octokit();

export function ScanApp() {
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const performScan = async ({ owner, repo }: RepositoryIdentifier): Promise<void> => {
        setError(null);

        try {
            let branch: string, files: string[];

            try {
                const info = await octokit.repos.get({ owner, repo });
                // TODO: Allow user branch selection.
                branch = info.data.default_branch;
            } catch {
                throw new Error("Could not retrieve the repository.");
            }

            try {
                const tree = await octokit.git.getTree({ owner, repo, tree_sha: branch, recursive: "true" });
                files = tree.data.tree.map((twig) => twig.path || "");

                if (tree.data.truncated) {
                    console.warn("Returned tree data was truncated.");
                }
            } catch {
                throw new Error("Could not retrieve the repository tree.");
            }

            const response = await fetch("/api/scan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner,
                    repo,
                    branch,
                    files,
                }),
            });
            const result = (await response.json()) as ScanResult;

            setResult(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }

        // setResult({ items: [] });
    };

    return (
        <>
            <Collapse in={!!error}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Collapse>

            <SwitchTransition>
                <Fade key={!!result ? "has-results" : "no-results"} appear={false}>
                    <Box>
                        {!result && (
                            <>
                                <Typography variant="h5">Let&apos;s pick a repository first.</Typography>

                                <Box py={3}>
                                    <OwnerNamePicker handleScan={performScan} />
                                </Box>
                                <Divider>or</Divider>
                                <Box py={3}>
                                    <RepoUrlPicker handleScan={performScan} />
                                </Box>
                            </>
                        )}
                        {!!result && (
                            <>
                                <Typography variant="h5" mb={1}>
                                    Enjoy your results!
                                </Typography>

                                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={1}>
                                    <Typography mb={1} variant="caption" color="GrayText">
                                        {result.items.length} comment(s) found.
                                    </Typography>
                                    <Button variant="outlined" color="warning" onClick={() => setResult(null)}>
                                        Perform a new scan
                                    </Button>
                                </Stack>
                                <Stack spacing={1}>
                                    {result.items.map((item) => (
                                        <TodoItem key={item.url} item={item} />
                                    ))}
                                </Stack>
                            </>
                        )}
                    </Box>
                </Fade>
            </SwitchTransition>
        </>
    );
}
