import { Octokit } from "@octokit/rest";

export interface RepositoryIdentifier {
    owner: string;
    repo: string;
}
export interface RepositoryBranchIdentifier extends RepositoryIdentifier {
    branch: string;
}
export interface CommentSpan {
    begin: number;
    end: number;
}

const client = new Octokit();
export const getOctoClient = (): Octokit => {
    return client;
};

export const getGitHubBaseUrl = () => "https://github.com";

export const getRepositoryUrl = ({ owner, repo }: RepositoryIdentifier): string =>
    `${getGitHubBaseUrl()}/${owner}/${repo}`;

export const getRepositoryFileUrl = (
    identifier: RepositoryIdentifier,
    branch: string,
    path: string,
    comment?: CommentSpan
) => `${getRepositoryUrl(identifier)}/blob/${branch}/${path}${comment ? `#L${comment.begin}-L${comment.end}` : ""}`;

export const getRepositoryRawFileUrl = ({ owner, repo }: RepositoryIdentifier, branch: string, path: string): string =>
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;

export const parseGitHubUrl = (url: string): RepositoryIdentifier | null => {
    const base = getGitHubBaseUrl();
    if (!url.startsWith(base)) return null;

    const match = url.substr(base.length).match(/^\/(.+?)\/(.+?)\/?$/);
    if (!match) return null;

    return {
        owner: match[1],
        repo: match[2],
    };
};
