import type { Area } from 'react-easy-crop'

export const getCroppedImage = (
    imageSrc:    string,
    croppedArea: Area,          // ← was CroppedArea, now Area
    fileName:    string = 'cropped.jpg'
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src   = imageSrc

        image.onload = () => {
            const canvas  = document.createElement('canvas')
            canvas.width  = croppedArea.width
            canvas.height = croppedArea.height
            const ctx     = canvas.getContext('2d')

            if (!ctx) {
                reject(new Error('Canvas context not available'))
                return
            }

            ctx.drawImage(
                image,
                croppedArea.x,
                croppedArea.y,
                croppedArea.width,
                croppedArea.height,
                0,
                0,
                croppedArea.width,
                croppedArea.height
            )

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Failed to create blob'))
                    return
                }
                const file = new File([blob], fileName, { type: 'image/jpeg' })
                resolve(file)
            }, 'image/jpeg', 0.9)
        }

        image.onerror = () => reject(new Error('Failed to load image'))
    })
}