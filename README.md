# todoscan

A compact web application, used to scan GitHub repositories for `// TODO:` comments.

Try it out at https://todoscan.vercel.app/!

## Installation & Setup

```console
yarn install
yarn dev
```

This will run the application on your localhost. No further setup required!

## How it works

The application uses the GitHub API to fetch tree of the repository, before sending the files to a serverless function for scanning. It uses [`multilang-extract-comments`](https://www.npmjs.com/package/multilang-extract-comments) to parse the comments of the source files, so that they can be queried for `// TODO:` comments.

## Known limitations

-   The project currently only supports JavaScript, Typescript and their React variants.

## License

This project is licensed under the [MIT License](./LICENSE).
