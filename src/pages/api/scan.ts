import extract from "multilang-extract-comments";
import type { NextApiRequest, NextApiResponse } from "next";

import { ScanItem, ScanResult } from "src/lib/types";

export default async function handleScanRequest(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const { owner, repo } = req.query as Record<string, string>;
    if (!owner || !repo) return res.status(400).json({ message: "Missing name qualifiers." });

    try {
        const result = await scan(owner, repo);
        return res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
    }
}

const extensions = ["js", "jsx", "ts", "tsx"];

async function scan(owner: string, repo: string): Promise<ScanResult> {
    const defaultBranch = (await fetchData(`https://api.github.com/repos/${owner}/${repo}`))["default_branch"];
    if (!defaultBranch) throw new Error("Failed to load repository data.");

    const data = await fetchData(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=true`
    );

    const items: ScanItem[] = [];

    for (const twig of data.tree) {
        if (twig.type === "blob" && extensions.some((ext) => twig.path.endsWith(ext))) {
            const response = await fetch(getRawFileUrl(owner, repo, defaultBranch, twig.path));
            const content = await response.text();
            const comments = extract(content);

            for (const line in comments) {
                const comment = comments[line];

                if (comment.content.startsWith("TODO:")) {
                    items.push({
                        content: comment.content.slice("TODO:".length).trim(),
                        line: parseInt(line),
                        code: comment.code.trim(),
                        path: twig.path,
                        type: "TODO",
                        url: `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${twig.path}#L${comment.begin}-L${comment.end}`,
                    });
                }
            }
        }
    }

    return {
        truncated: data["truncated"],
        items: items,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchData<T = any>(url: string): Promise<T> {
    const response = await fetch(url);
    const data = await response.json();

    return data as T;
}

function getRawFileUrl(owner: string, repo: string, branch: string, path: string): string {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}
