import type { JSX as ReactJSX } from 'react';

declare global {
    interface Window {
        chrome?: typeof chrome;
    }
    
    namespace JSX {
        interface Element extends ReactJSX.Element {}
        interface ElementClass extends ReactJSX.ElementClass {}
        interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
        interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
        interface LibraryManagedAttributes<C, P> extends ReactJSX.LibraryManagedAttributes<C, P> {}
        interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
        interface IntrinsicClassAttributes<T> extends ReactJSX.IntrinsicClassAttributes<T> {}
        interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
    }
}

export { };