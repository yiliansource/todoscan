import { LoadingButton } from "@mui/lab";
import { Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { getOctoClient, RepositoryIdentifier } from "src/lib/github";

import { ValidRepoLabel } from "./ValidRepoLabel";

const octo = getOctoClient();

export interface OwnerNamePickerProps {
    handleScan(repo: RepositoryIdentifier): Promise<void>;
}

export function OwnerNamePicker({ handleScan }: OwnerNamePickerProps) {
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");

    const [isValid, setValid] = useState<boolean | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);

    const validateRepo = () => {
        setValid(null);
        if (!owner || !repo) return;

        octo.repos
            .get({ owner, repo })
            .then(() => setValid(true))
            .catch(() => setValid(false));
    };
    const submitForm = () => {
        setSubmitting(true);
        handleScan({ owner, repo }).then(() => setSubmitting(false));
    };

    return (
        <>
            <Typography mb={1}>Enter the repository&apos;s owner and name:</Typography>

            <Stack direction="row" spacing={1}>
                <TextField
                    name="owner"
                    label="Owner"
                    disabled={isSubmitting}
                    onChange={(e) => setOwner(e.target.value)}
                    onBlur={validateRepo}
                />
                <TextField
                    name="repo"
                    label="Name"
                    disabled={isSubmitting}
                    onChange={(e) => setRepo(e.target.value)}
                    onBlur={validateRepo}
                />

                <LoadingButton
                    type="submit"
                    variant="contained"
                    sx={{ minWidth: 100, height: 56 }}
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
