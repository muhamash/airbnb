declare module 'negotiator' {
    interface Headers {
        [key: string]: string | string[] | undefined;
    }

    class Negotiator {
        constructor(req: { headers: Headers });
        languages(available?: string[]): string[];
        mediaTypes(available?: string[]): string[];
        charsets(available?: string[]): string[];
        encodings(available?: string[]): string[];
    }

    export = Negotiator;
}