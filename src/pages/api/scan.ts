import extract from "multilang-extract-comments";
import type { NextApiRequest, NextApiResponse } from "next";

import { getRepositoryFileUrl, getRepositoryRawFileUrl } from "src/lib/github";
import type { ScanItem, ScanResult } from "src/lib/types";

export interface ScanRequestBody {
    owner?: string;
    repo?: string;
    branch: string;
    files: string[];
}

export default async function handleScanRequest(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { owner, repo, branch, files } = Object.assign(
            { branch: "main", files: [] } as ScanRequestBody,
            req.body as ScanRequestBody
        );

        if (!owner || !repo) throw new Error("Missing repository/owner parameters.");

        const result = await scan(owner, repo, branch, files);
        return res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
    }
}

const supportedExtensions = ["js", "jsx", "ts", "tsx"]; // for now

async function scan(owner: string, repo: string, branch: string, files: string[]): Promise<ScanResult> {
    const items: ScanItem[] = [];

    for (const path of files) {
        if (supportedExtensions.some((ext) => path.endsWith(ext))) {
            const response = await fetch(getRepositoryRawFileUrl({ owner, repo }, branch, path));
            const content = await response.text();
            const comments = extract(content);

            for (const line in comments) {
                const comment = comments[line];

                const pin = "TODO:";
                if (comment.content.startsWith(pin)) {
                    items.push({
                        content: comment.content.slice(pin.length).trim(),
                        line: parseInt(line),
                        code: comment.code.trim(),
                        path: path,
                        type: "TODO",
                        url: getRepositoryFileUrl({ owner, repo }, branch, path, {
                            begin: comment.begin,
                            end: comment.end,
                        }),
                    });
                }
            }
        }
    }

    return {
        items: items,
    };
}
