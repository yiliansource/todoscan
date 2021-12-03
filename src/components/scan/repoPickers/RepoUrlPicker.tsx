import { LoadingButton } from "@mui/lab";
import { Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { getOctoClient, parseGitHubUrl, RepositoryIdentifier } from "src/lib/github";

import { ValidRepoLabel } from "./ValidRepoLabel";

const octo = getOctoClient();

export interface RepoUrlPickerProps {
    handleScan(repo: RepositoryIdentifier): Promise<void>;
}

export function RepoUrlPicker({ handleScan }: RepoUrlPickerProps) {
    const [url, setUrl] = useState("");

    const [isValid, setValid] = useState<boolean | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);

    const validateRepo = () => {
        setValid(null);
        if (!url) return;

        const identifier = parseGitHubUrl(url);
        if (!identifier) {
            setValid(false);
            return;
        }

        octo.repos
            .get({ owner: identifier.owner, repo: identifier.repo })
            .then(() => setValid(true))
            .catch(() => setValid(false));
    };
    const submitForm = () => {
        const identifier = parseGitHubUrl(url);

        setSubmitting(true);
        handleScan(identifier || { owner: "", repo: "" }).then(() => setSubmitting(false));
    };

    return (
        <>
            <Typography mb={1}>Paste the repository&apos;s GitHub URL directly:</Typography>

            <Stack direction="row" spacing={1}>
                <TextField
                    name="url"
                    label="GitHub URL"
                    fullWidth
                    disabled={isSubmitting}
                    onChange={(e) => setUrl(e.target.value)}
                    onBlur={validateRepo}
                    sx={{ maxWidth: 500 }}
                />
                <LoadingButton
                    type="submit"
                    variant="contained"
                    sx={{ minWidth: 100 }}
                    loading={isSubmitting}
                    onClick={submitForm}
                >
                    Scan!
                </LoadingButton>
            </Stack>

            <ValidRepoLabel isValid={isValid} />
        </>
    );
}
