import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    modal: React.ReactNode;
}

const Layout = async ({ children, modal }: LayoutProps) => {
    return (
        <>
            {modal}
            {children}
        </>
    );
};

export default Layout;