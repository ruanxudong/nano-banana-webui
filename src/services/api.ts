import type { GenerateRequest, GenerateResponse } from '../types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function generateImage(request: GenerateRequest): Promise<GenerateResponse> {
    // 构建OpenRouter API请求格式
    const messages = [
        {
            role: 'user',
            content: [
                { type: 'text', text: request.prompt },
                ...request.images.map(img => ({
                    type: 'image_url',
                    image_url: { url: img }
                }))
            ]
        }
    ]

    const openrouterPayload = {
        model: 'google/gemini-2.5-flash-image-preview:free',
        messages
    }

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${request.apikey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(openrouterPayload)
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    if (!data.choices?.[0]?.message) {
        throw new Error('Invalid response from OpenRouter API')
    }

    const message = data.choices[0].message

    // 检查是否返回图片
    if (message.images?.[0]?.image_url?.url) {
        return { imageUrl: message.images[0].image_url.url }
    }

    // 检查content是否是base64图片
    if (typeof message.content === 'string' && message.content.startsWith('data:image/')) {
        return { imageUrl: message.content }
    }

    // 如果是文本回复，抛出错误或返回文本
    if (typeof message.content === 'string' && message.content.trim()) {
        throw new Error(`Model returned text instead of image: ${message.content}`)
    }

    throw new Error('Model did not return a valid image')
}
