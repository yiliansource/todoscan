import { CacheProvider } from "@emotion/react";
import { EmotionCache } from "@emotion/utils";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import { Layout } from "src/components/layout/Layout";
import createEmotionCache from "src/lib/styles/createEmotionCache";
import "src/styles/globals.css";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export default function MyApp({
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
}: MyAppProps): React.ReactElement {
    return (
        <CacheProvider value={emotionCache}>
            <CssBaseline />
            <Layout>
                <Head>
                    <title>todoscan</title>
                </Head>
                <Component {...pageProps} />
            </Layout>
        </CacheProvider>
    );
}
