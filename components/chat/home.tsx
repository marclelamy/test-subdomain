'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { FormInput } from '@/components/form-input/form'
import { SendNewMessage } from '@/lib/types/message-types'
import { toast } from 'sonner'
import { User } from '@/lib/types/user-types'
import { Badge } from "@/components/ui/badge"
import { FileText, Image, Video, AudioLines } from "lucide-react"
import { motion } from "motion/react"
import { defaultOpacityAnimationInitial, defaultOpacityAnimationAnimate, defaultOpacityAnimationTransition } from '@/lib/const'
import { models, ModelId } from '@/lib/models'
import { ModeSelector, ViewMode } from '../form-input/mode-selector'
import Voice from '../voice/voice'




export function HomeLandingChat({ name, user }: { name: string, user: User }) {
    // Initialize hooks
    const router = useRouter()
    const searchParams = useSearchParams()
    const [message, setMessage] = useState("")
    const [mode, setMode] = useState<ViewMode>("chat")

    // Initialize from localStorage on client side only
    useEffect(() => {
        const savedMode = localStorage.getItem("viewMode") as ViewMode
        if (savedMode) {
            setMode(savedMode)
        }
    }, [])

    const [preSelectedModel, setPreSelectedModel] = useState<ModelId>("openai:gpt-4o-mini" as const)

    // Initialize model from localStorage/URL on client side only
    useEffect(() => {
        // Check URL parameters first
        const urlModel = searchParams.get('model')
        if (urlModel && urlModel in models) {
            setPreSelectedModel(urlModel as ModelId)
            return
        }
        
        // Then check localStorage
        const storedModel = getLocalStorageValue({ key: 'lastModelUsed' })
        if (storedModel && typeof storedModel === 'string' && storedModel in models) {
            setPreSelectedModel(storedModel as ModelId)
        }
    }, [])



    
    // Get first name of user and capitalize first letter
    const firstName = user?.name?.split(' ')[0] || 'there'
    const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)




    // Handle sending message
    const handleSendingNewMessage = ({ message, options }: SendNewMessage) => {
        toast.info("Sending message: " + message.content)
        if (!message.content.trim()) return

        // Generate unique ID for chat
        const chatId = uuidv4()

        // Store message in localStorage
        setLocalStorageValue(chatId, {
            firstMessage: message,
            timestamp: new Date().toISOString()
        })

        // Redirect to chat page 
        router.push(`/app/${mode}/${chatId}`)
    }

    const handleModelSelect = (type: 'text' | 'image') => {
        const textModelId = "openai:gpt-4o-mini" as const
        const imageModelId = "falai:fal-ai/flux/schnell" as const
        const newModelId = type === 'text' ? textModelId : imageModelId
        setPreSelectedModel(newModelId)
        setLocalStorageValue('lastModelUsed', newModelId)
    }

    return (
        <motion.div
            className="w-full h-full flex flex-col items-center p-2 pt-24 gap-6 max-w-[800px] mx-auto"
            initial={defaultOpacityAnimationInitial}
            animate={defaultOpacityAnimationAnimate}
            transition={defaultOpacityAnimationTransition}
        >
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-foreground">Hi {capitalizedName}!</h1>
                <p className="text-xl text-muted-foreground">What's on your mind today?</p>
                <p className="text-xl text-muted-foreground">log the url in the request</p>
            </div>
            <div className="flex gap-2">
                <Badge 
                    variant="secondary" 
                    className="flex items-center gap-1 cursor-pointer hover:bg-accent"
                    onClick={() => handleModelSelect('text')}
                >
                    <FileText className="h-4 w-4" />
                    Text
                </Badge>
                <Badge 
                    variant="secondary" 
                    className="flex items-center gap-1 cursor-pointer hover:bg-accent"
                    onClick={() => handleModelSelect('image')}
                >
                    <Image className="h-4 w-4" />
                    Image
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    Video
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                    <AudioLines className="h-4 w-4" />
                    Audio
                </Badge>
                <ModeSelector onChange={setMode} />
            </div>
            {mode === 'voice' ? (
                <Voice />
            ) : (
                <FormInput
                    handleSendingNewMessage={handleSendingNewMessage}
                    formData={undefined}
                    defaultModelId={preSelectedModel}
                    showAdditionalParams={false}
                    minLines={3}
                />
            )}
        </motion.div>
    )
}