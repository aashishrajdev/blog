// Type for video data sent from frontend (nested format)
export type VideoFromData = {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controllers?: boolean;
    owner?: {
        name?: string;
    };
    transformation?: {
        height?: number;
        width?: number;
        quality?: number;
    };
}
type fetchOptions = {
    method?:"GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiClient{
    private async fetch<T>(endpoint : string,options: fetchOptions):Promise<T>{
        const {method = "GET", body, headers={}} = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        }
       const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        })

        if(!response.ok){
            throw new Error(await response.text());
        }

        return response.json() as Promise<T>;
    }

    async getVideo(){
        return this.fetch("/videos", {});
    }
    async createVideos(videoData:VideoFromData){
        return this.fetch("/videos", {
            method: "POST",
            body: videoData,
        });
    }
}

export const apiClient = new ApiClient();