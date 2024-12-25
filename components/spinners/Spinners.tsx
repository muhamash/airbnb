'use client'

import { ColorRing, Discuss, DNA, InfinitySpin, MagnifyingGlass, Radio, RotatingTriangles, Triangle } from 'react-loader-spinner';

export const RotateTriangle = () => {
    return (
        <RotatingTriangles
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="rotating-triangles-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    );
}

export const  Search = ()=>
{
    return (
        <MagnifyingGlass
            visible={true}
            height="80"
            width="80"
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{}}
            wrapperClass="magnifying-glass-wrapper"
            glassColor="#c0efff"
            color="#e15b64"
        />
    );
}

export const InfinitySpinner = () =>
{
    return (
        <InfinitySpin
            visible={true}
            width="200"
            color="#4fa94d"
            ariaLabel="infinity-spin-loading"
        />
    );
}

export const DnaLoadder = () =>
{
    return (
        <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        />
    );
}

export const DiscussSpinner = () =>
{
    return (
        <Discuss
            visible={true}
            height="80"
            width="80"
            ariaLabel="discuss-loading"
            wrapperStyle={{}}
            wrapperClass="discuss-wrapper"
            color="#fff"
            backgroundColor="#F4442E"
        />
    );
}

export const ColorSpinner = () =>
{
    return (
        <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={[ '#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87' ]}
        />
    );
}

export const RadioSpinner = () =>
{
    return (
        <Radio
            visible={true}
            height="80"
            width="80"
            color="#118557"
            ariaLabel="radio-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    );
}

export const  TriangleSpinner = ()=> {
    return (
        <Triangle
            visible={true}
            height="80"
            width="100"
            color="#4fa94d"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    );
}