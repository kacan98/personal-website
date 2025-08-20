'use client'
import { CVSettings } from "@/sanity/schemaTypes/singletons/cvSettings";
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '../redux/store';


export default function StoreProvider({
    children,
    cvSettings
}: {
    children: React.ReactNode
    cvSettings: CVSettings | undefined
}) {
    const storeRef = useRef<AppStore | undefined>(undefined)
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore(cvSettings || {} as CVSettings)
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}