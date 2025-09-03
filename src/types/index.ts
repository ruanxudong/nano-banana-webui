export interface GenerateRequest {
    prompt: string
    images: string[]
    apikey: string
}

export interface GenerateResponse {
    imageUrl: string
}

export interface StyleTemplate {
    id: string
    title: string
    prompt: string
    image: string
    description: string
}
