'use client'
import { useAppDispatch } from '@/redux/hooks';
import { initCv } from '@/redux/slices/cv';
import { CVSettings } from "@/sanity/schemaTypes/singletons/cvSettings";
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '../redux/store';


export default function StoreProvider({
    children,
    cvSettings
}: {
    children: React.ReactNode
    cvSettings: CVSettings
}) {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore(cvSettings)
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}