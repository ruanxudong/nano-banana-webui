<template>
    <div class="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-200 text-gray-900 relative overflow-hidden">
        <!-- 香蕉装饰元素 -->
        <div class="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🍌</div>
        <div class="absolute top-32 right-20 text-4xl opacity-30 animate-pulse">🍌</div>
        <div class="absolute bottom-20 left-32 text-5xl opacity-25 animate-bounce delay-1000">🍌</div>
        <div class="absolute bottom-40 right-10 text-3xl opacity-20 animate-pulse delay-500">🍌</div>

        <div class="container mx-auto px-4 py-8 max-w-4xl relative z-10">
            <!-- Header -->
            <div class="relative mb-8">
                <div class="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg p-6 border-4 border-black shadow-lg">
                    <div class="flex justify-between items-start">
                        <div class="text-center flex-1">
                            <h1 class="text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
                                🍌 Nano<br />
                                <span class="text-yellow-100 text-5xl">Banana</span>
                            </h1>
                            <p class="text-white font-medium">上传你的图片，我来创造艺术！</p>
                        </div>

                        <!-- API设置按钮 -->
                        <div class="flex-shrink-0">
                            <button
                                @click="showApiSettings = !showApiSettings"
                                :class="[
                                    'px-4 py-2 rounded-lg border-2 border-white font-bold text-sm transition-all flex items-center gap-2',
                                    apiKey ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-orange-500 hover:bg-gray-100 animate-pulse'
                                ]"
                            >
                                <span>🔑</span>
                                <span v-if="!apiKey">需要配置API</span>
                                <span v-else>API已配置</span>
                                <svg :class="['w-4 h-4 transition-transform', showApiSettings ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- API设置折叠面板 -->
                <div v-if="showApiSettings" class="mt-4">
                    <ApiKeyInput v-model="apiKey" />
                </div>
            </div>

            <!-- Step 1: Upload Image -->
            <div class="mb-6">
                <div class="bg-pink-400 text-white font-bold px-4 py-2 rounded-t-lg border-4 border-black border-b-0 flex items-center gap-2">🍌 1. 上传图片</div>
                <ImageUpload v-model="selectedImages" />
            </div>

            <!-- Step 2: Style Selection and Custom Prompt -->
            <div class="mb-6">
                <div class="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold px-4 py-2 rounded-t-lg border-4 border-black border-b-0 flex items-center gap-2">
                    🎨 2. 选择风格或自定义提示词
                </div>
                <StylePromptSelector v-model:selectedStyle="selectedStyle" v-model:customPrompt="customPrompt" :templates="styleTemplates" />
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col items-center gap-4 mb-8">
                <GenerateButton :loading="isLoading" :disabled="!canGenerate" @click="handleGenerate" />
                <!-- <button @click="handleReset" class="px-8 py-3 bg-white border-4 border-black rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                    🔄 重置
                </button> -->
            </div>

            <!-- Step 3: Result -->
            <div>
                <div class="bg-black text-white font-bold px-4 py-2 rounded-t-lg border-4 border-black border-b-0 flex items-center gap-2">✨ 3. 生成结果</div>
                <ResultDisplay :result="result" :loading="isLoading" :error="error" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ApiKeyInput from './components/ApiKeyInput.vue'
import ImageUpload from './components/ImageUpload.vue'
import StylePromptSelector from './components/StylePromptSelector.vue'
import GenerateButton from './components/GenerateButton.vue'
import ResultDisplay from './components/ResultDisplay.vue'
import { generateImage } from './services/api'
import { styleTemplates } from './data/templates'
import { LocalStorage } from './utils/storage'
import type { GenerateRequest } from './types'

const apiKey = ref('')
const selectedImages = ref<string[]>([])
const selectedStyle = ref('')
const customPrompt = ref('')
const isLoading = ref(false)
const result = ref<string | null>(null)
const error = ref<string | null>(null)
const showApiSettings = ref(false)

// 组件挂载时从本地存储读取API密钥
onMounted(() => {
    const savedApiKey = LocalStorage.getApiKey()
    if (savedApiKey) {
        apiKey.value = savedApiKey
        showApiSettings.value = false
    } else {
        // 如果没有API密钥，自动展开设置面板
        showApiSettings.value = true
    }
})

// 监听API密钥变化，自动保存到本地存储
watch(
    apiKey,
    (newApiKey: string) => {
        if (newApiKey.trim()) {
            LocalStorage.saveApiKey(newApiKey)
            // 当API密钥配置成功后，延迟关闭设置面板
            setTimeout(() => {
                showApiSettings.value = false
            }, 1500)
        }
    },
    { immediate: false }
)

const canGenerate = computed(() => apiKey.value.trim() && selectedImages.value.length > 0 && (selectedStyle.value || customPrompt.value.trim()) && !isLoading.value)

const handleGenerate = async () => {
    if (!canGenerate.value) return

    isLoading.value = true
    error.value = null
    result.value = null

    try {
        // 使用选中的样式模板或自定义提示词
        const prompt = selectedStyle.value ? styleTemplates.find(t => t.id === selectedStyle.value)?.prompt || customPrompt.value : customPrompt.value

        const request: GenerateRequest = {
            prompt,
            images: selectedImages.value,
            apikey: apiKey.value
        }

        const response = await generateImage(request)
        result.value = response.imageUrl
    } catch (err) {
        error.value = err instanceof Error ? err.message : '生成失败'
    } finally {
        isLoading.value = false
    }
}

const handleReset = () => {
    selectedImages.value = []
    selectedStyle.value = ''
    customPrompt.value = ''
    result.value = null
    error.value = null
}
</script>
