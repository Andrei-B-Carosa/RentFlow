// src/components/common/ImageCropper/ImageCropper.tsx

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { getCroppedImage } from './CroppedArea'
import Button from '../Button'

interface Props {
    imageSrc:    string          // base64 or object URL of image to crop
    fileName?:   string          // output file name
    aspectRatio?: number         // default 16/9, pass 1 for square, 4/3 etc
    onCropDone:  (file: File) => void
    onCancel:    () => void
}

const ImageCropper = ({
    imageSrc,
    fileName     = 'photo.jpg',
    aspectRatio  = 16 / 9,
    onCropDone,
    onCancel,
}: Props) => {

    const [crop, setCrop]                         = useState({ x: 0, y: 0 })
    const [zoom, setZoom]                         = useState(1)
    const [rotation, setRotation]                 = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isProcessing, setIsProcessing]         = useState(false)

    const onCropComplete = useCallback(
        (_: any, croppedPixels: Area) => {
            setCroppedAreaPixels(croppedPixels)
        },
        []
    )

    const handleCropDone = async () => {
        if (!croppedAreaPixels) return
        setIsProcessing(true)
        try {
            const croppedFile = await getCroppedImage(
                imageSrc,
                croppedAreaPixels,
                fileName
            )
            onCropDone(croppedFile)
        } catch (error) {
            console.error('Crop failed:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">

            {/* Cropper area */}
            <div className="relative w-full h-72 bg-gray-900 rounded-xl overflow-hidden">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspectRatio}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>

            {/* Controls */}
            <div className="space-y-3 px-1">

                {/* Zoom */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-gray-600">
                            Zoom
                        </label>
                        <span className="text-xs text-gray-400">
                            {Math.round(zoom * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full accent-blue-600 cursor-pointer"
                    />
                </div>

                {/* Rotation */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-gray-600">
                            Rotation
                        </label>
                        <span className="text-xs text-gray-400">
                            {rotation}°
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full accent-blue-600 cursor-pointer"
                    />
                </div>

                {/* Aspect ratio shortcuts */}
                <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                        Aspect Ratio
                    </label>
                    <div className="flex gap-2">
                        {[
                            { label: '16:9',  value: 16 / 9  },
                            { label: '4:3',   value: 4 / 3   },
                            { label: '1:1',   value: 1       },
                            { label: 'Free',  value: undefined },
                        ].map((option) => (
                            <button
                                key={option.label}
                                type="button"
                                onClick={() => {
                                    // parent controls aspectRatio via prop
                                    // this is just visual — extend if needed
                                }}
                                className="px-3 py-1 text-xs border border-gray-200
                                    rounded-lg hover:bg-gray-50 text-gray-600 transition"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200
                        rounded-lg hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <Button
                    type="button"
                    loading={isProcessing}
                    loadingText="Processing..."
                    onClick={handleCropDone}
                    className="px-6"
                >
                    Apply Crop
                </Button>
            </div>

        </div>
    )
}

export default ImageCropper