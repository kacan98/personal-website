'use client'
import { CVSettings } from "@/types";
import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../redux/store';


export default function StoreProvider({
    children,
    cvConfig
}: {
    children: React.ReactNode
    cvConfig: CVSettings | undefined
}) {
    // Create a new store whenever cvConfig changes (for language switching)
    const store = useMemo(() => {
        return makeStore(cvConfig || {} as CVSettings);
    }, [cvConfig]);

    // Ensure store is available before rendering children
    if (!store) {
        return <div>Loading...</div>;
    }

    return <Provider store={store}>{children}</Provider>
}