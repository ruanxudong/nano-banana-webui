import type { StyleTemplate } from '../types'

export const styleTemplates: StyleTemplate[] = [
    {
        id: 'figurine',
        title: '🍌 桌面手办风格',
        prompt: 'Using the nano-banana model,create a 1/7 scale commercialized figurine of the characters in the picture, in a realistic style, in a real environment. The figurine is placed on a computer desk. The figurine has a round transparent acrylic base, with no text on the base. The content on the computer screen is the Zbrush modeling process of this figurine. Next to the computer screen is a BANDAI-style toy packaging box printed with the original artwork., The packaging features two-dimensional flat illustrations.Maintain consistency with the image',
        image: '/1.png',
        description: '将你的角色变成精美的收藏手办，配有专业包装和制作过程展示'
    },
    {
        id: 'display-cabinet',
        title: '🍌 展示柜收藏风格',
        prompt: 'Create a highly realistic 1/7 scale commercialized figure based on the illustration’s adult character, ensuring the appearance and content are safe, healthy, and free from any inappropriate elements. Render the figure in a detailed, lifelike style and environment, placed on a shelf inside an ultra-realistic figure display cabinet, mounted on a circular transparent acrylic base without any text. Maintain highly precise details in texture, material, and paintwork to enhance realism. The cabinet scene should feature a natural depth of field with a smooth transition between foreground and background for a realistic photographic look. Lighting should appear natural and adaptive to the scene, automatically adjusting based on the overall composition instead of being locked to a specific direction, simulating the quality and reflection of real commercial photography. Other shelves in the cabinet should contain different figures which are slightly blurred due to being out of focus, enhancing spatial realism and depth.',
        image: '/2.png',
        description: '打造专业级展示柜收藏场景，超逼真的手办陈列效果，完美的景深和光影'
    },
    {
        id: 'blind-box',
        title: '🍌 盲盒玩具风格',
        prompt: 'Transform the illustrated cat into a highly detailed blind box figurine. Place it on a clean white display table with soft spotlighting from above. Next to the figurine is a matching product box featuring the cats illustration on the cover. Surround the display with a few small accessories like miniature books or toy props to enhance visual interest. The scene is set in a cozy, minimal incoor environment with warm lighting, resembling a designer toy showcase or collectors shelf.',
        image: '/3.png',
        description: '可爱的盲盒玩具风格，配有精美包装盒和温馨的展示环境'
    }
]
